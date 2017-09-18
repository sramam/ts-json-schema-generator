import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class TupleNodeParser implements SubNodeParser {
    private typeChecker;
    private childNodeParser;
    private visibility;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser, visibility: string | undefined);
    supportsNode(node: ts.TupleTypeNode): boolean;
    createType(node: ts.TupleTypeNode, context: Context): BaseType;
}
