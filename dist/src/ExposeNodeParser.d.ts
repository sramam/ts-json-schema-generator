import * as ts from "typescript";
import { Context } from "./NodeParser";
import { SubNodeParser } from "./SubNodeParser";
import { BaseType } from "./Type/BaseType";
export declare class ExposeNodeParser implements SubNodeParser {
    private program;
    private subNodeParser;
    private expose;
    private typeChecker;
    constructor(program: ts.Program, subNodeParser: SubNodeParser, expose: "all" | "none" | "export");
    supportsNode(node: ts.Node): boolean;
    createType(node: ts.Node, context: Context): BaseType;
    private isExportNode(node);
    private getDefinitionName(node, context);
}
