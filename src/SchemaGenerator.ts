import * as path from "path";
import * as ts from "typescript";
import { NoRootTypeError } from "./Error/NoRootTypeError";
import { Context, NodeParser } from "./NodeParser";
import { Definition } from "./Schema/Definition";
import { Schema } from "./Schema/Schema";
import { BaseType } from "./Type/BaseType";
import { DefinitionType } from "./Type/DefinitionType";
import { TypeFormatter } from "./TypeFormatter";
import { getFullName } from "./Utils/fullName";
import { StringMap } from "./Utils/StringMap";
import { localSymbolAtNode, symbolAtNode } from "./Utils/symbolAtNode";

export class SchemaGenerator {
    public constructor(
        private program: ts.Program,
        private nodeParser: NodeParser,
        private typeFormatter: TypeFormatter,
    ) {
        const rootDir = this.program.getCompilerOptions().rootDir;
        if (!rootDir) {
            console.warn(`WARN: 'rootDir' compiler option is not specified. Will use cwd: '${process.cwd()}'`);
        }
    }

    public createSchema(fullName: string): Schema {
        const rootNode = this.findRootNode(fullName);
        const rootType = this.nodeParser.createType(rootNode, new Context());

        return {
            $schema: "http://json-schema.org/draft-06/schema#",
            definitions: this.getRootChildDefinitions(rootType),
            ...this.getRootTypeDefinition(rootType),
        };
    }

    private findRootNode(fullName: string): ts.Node {
        const typeChecker = this.program.getTypeChecker();
        const allTypes = new Map<string, ts.Node>();

        this.program.getSourceFiles().forEach((sourceFile) =>
            this.inspectNode(sourceFile, typeChecker, allTypes),
        );

        // return if exact match is found
        if (allTypes.has(fullName)) {
            return allTypes.get(fullName)!;
        }

        // if an exact match is not found, use fullName as RegExp string,
        // to find all approximate matches
        const re = new RegExp(`.*${fullName}`);
        const matches = <string[]>[];
        for (const k of allTypes.keys()) {
            if (k.match(re)) {
                matches.push(k);
            }
        }

        switch (matches.length) {
            case 1:
                // only one regexp match. use it.
                const node = allTypes.get(matches[0])!;
                return node;
            case 0: {
                const all: string[] = [];
                allTypes.forEach((val: ts.Node, key: string) => all.push(key));
                console.warn(`No types matching ${fullName} found.`);
                // console.warn(`No types matching ${fullName} found. ${JSON.stringify(all, null, 2)}`);
                throw new NoRootTypeError(fullName);
            }
            default: {
                // no approximate matches found, list them all and then throw
                const all: string[] = matches.map((key: string) => key);
                console.warn(`Multiple types match '${fullName}'. Please pick one: ${JSON.stringify(all, null, 2)}`);
                throw new NoRootTypeError(fullName);
            }
        }
    }
    private inspectNode(node: ts.Node, typeChecker: ts.TypeChecker, allTypes: Map<string, ts.Node>): void {
        if (
            node.kind === ts.SyntaxKind.InterfaceDeclaration ||
            node.kind === ts.SyntaxKind.EnumDeclaration ||
            node.kind === ts.SyntaxKind.TypeAliasDeclaration
        ) {
            if (!this.isExportType(node)) {
                return;
            } else if (this.isGenericType(node as ts.TypeAliasDeclaration)) {
                return;
            }

            allTypes.set(getFullName(node, this.program), node);
        } else {
            ts.forEachChild(
                node,
                (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
        }
    }

    private isExportType(node: ts.Node): boolean {
        const localSymbol = localSymbolAtNode(node);
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    private isGenericType(node: ts.TypeAliasDeclaration): boolean {
        return !!(
            node.typeParameters &&
            node.typeParameters.length > 0
        );
    }

    // FIXME: can we get rid of this?
    // private getFullName(node: ts.Node, typeChecker: ts.TypeChecker): string {
    //     const symbol = symbolAtNode(node)!;
    //     return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
    // }

    private getRootTypeDefinition(rootType: BaseType): Definition {
        return this.typeFormatter.getDefinition(rootType);
    }
    private getRootChildDefinitions(rootType: BaseType): StringMap<Definition> {
        return this.typeFormatter.getChildren(rootType)
            .filter((child) => child instanceof DefinitionType)
            .reduce((result: StringMap<Definition>, child: DefinitionType) => ({
                ...result,
                [child.getId()]: this.typeFormatter.getDefinition(child.getType()),
            }), {});
    }
}
