import * as ts from "typescript";
import { NodeParser } from "./NodeParser";
import { Schema } from "./Schema/Schema";
import { TypeFormatter } from "./TypeFormatter";
export declare class SchemaGenerator {
    private program;
    private nodeParser;
    private typeFormatter;
    private allTypes;
    constructor(program: ts.Program, nodeParser: NodeParser, typeFormatter: TypeFormatter);
    createSchema(fullName: string): Schema;
    private findRootNode;
    private inspectNode;
    private isExportType;
    private isGenericType;
    private getRootTypeDefinition;
    private getRootChildDefinitions;
}
