import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class UnionNodeParser implements SubNodeParser {
    private typeChecker;
    private childNodeParser;
    private visibility;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser, visibility: string);
    supportsNode(node: ts.UnionTypeNode): boolean;
    createType(node: ts.UnionTypeNode, context: Context): BaseType;
}
