import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { ObjectProperty, ObjectType } from "../Type/ObjectType";
import { inspectAllJsDocTags } from "../Utils/isHidden";

export class TypeLiteralNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
        private visibility: string,
    ) {
    }

    public supportsNode(node: ts.TypeLiteralNode): boolean {
        return node.kind === ts.SyntaxKind.TypeLiteral;
    }
    public createType(node: ts.TypeLiteralNode, context: Context): BaseType {
        return new ObjectType(
            this.getTypeId(node, context),
            [],
            this.getProperties(node, context),
            this.getAdditionalProperties(node, context),
        );
    }

    private getProperties(node: ts.TypeLiteralNode, context: Context): ObjectProperty[] {
        return node.members
            .filter((property: ts.TypeElement) => property.kind === ts.SyntaxKind.PropertySignature)
            .reduce((result: ObjectProperty[], propertyNode: ts.PropertySignature) => {
                const propertySymbol: ts.Symbol = (propertyNode as any).symbol;
                if (inspectAllJsDocTags(propertySymbol, this.visibility)) {
                    return result;
                }
                const objectProperty = new ObjectProperty(
                    propertySymbol.getName(),
                    this.childNodeParser.createType(propertyNode.type!, context),
                    !propertyNode.questionToken,
                );

                result.push(objectProperty);
                return result;
            }, []);
    }
    private getAdditionalProperties(node: ts.TypeLiteralNode, context: Context): BaseType|false {
        const properties = node.members
            .filter((property: ts.TypeElement) => property.kind === ts.SyntaxKind.IndexSignature);
        if (!properties.length) {
            return false;
        }

        const signature: ts.IndexSignatureDeclaration = properties[0] as ts.IndexSignatureDeclaration;
        return this.childNodeParser.createType(signature.type!, context);
    }

    private getTypeId(node: ts.Node, context: Context): string {
        const fullName = `structure-${node.getFullStart()}`;
        const argumentIds = context.getArguments().map((arg: BaseType) => arg.getId());

        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
