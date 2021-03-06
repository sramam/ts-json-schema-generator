import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
import { EnumType } from "../Type/EnumType";

export class IndexedAccessTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.IndexedAccessTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }
    public createType(node: ts.IndexedAccessTypeNode, context: Context): BaseType {
        const symbol: ts.Symbol = this.typeChecker.getSymbolAtLocation((<ts.TypeQueryNode>node.objectType).exprName)!;
        // Object.keys(node).map((p: string) => {
        //     console.log(`${p}: ${node[p]}`);
        // });
        return new EnumType(
            `indexed-type-${node.getFullStart()}`,
            symbol ?
                (<any>symbol.valueDeclaration).type.elementTypes.map((memberType: ts.Node) =>
                    this.childNodeParser.createType(memberType, context)) : undefined,
        );
    }
}
