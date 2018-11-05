import * as ts from "typescript";
import { Context, NodeParser } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class InterfaceNodeParser implements SubNodeParser {
    private typeChecker;
    private childNodeParser;
    private visibility;
    constructor(typeChecker: ts.TypeChecker, childNodeParser: NodeParser, visibility: string);
    supportsNode(node: ts.InterfaceDeclaration): boolean;
    createType(node: ts.InterfaceDeclaration, context: Context): BaseType;
    private getBaseTypes;
    private getProperties;
    private getAdditionalProperties;
    private getTypeId;
}
