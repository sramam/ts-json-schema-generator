import * as ts from "typescript";
import { Context } from "../NodeParser";
import { SubNodeParser } from "../SubNodeParser";
import { BaseType } from "../Type/BaseType";
export declare class EnumNodeParser implements SubNodeParser {
    private typeChecker;
    private visibility;
    constructor(typeChecker: ts.TypeChecker, visibility: string);
    supportsNode(node: ts.EnumDeclaration | ts.EnumMember): boolean;
    createType(node: ts.EnumDeclaration | ts.EnumMember, context: Context): BaseType;
    private getMemberValue(member, index);
    private parseInitializer(initializer);
}
