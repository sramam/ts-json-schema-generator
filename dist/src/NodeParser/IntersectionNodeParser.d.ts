import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class IntersectionNodeParser implements SubNodeParser {
    private typeChecker;
    private childNodeParser;
    private visibility;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser, visibility: string);
    supportsNode(node: ts.IntersectionTypeNode): boolean;
    createType(node: ts.IntersectionTypeNode, context: Context): BaseType;
}
