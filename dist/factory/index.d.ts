import * as ts from "typescript";
import { Config } from "../src/Config";
import { NodeParser } from "../src/NodeParser";
import { SchemaGenerator } from "../src/SchemaGenerator";
import { TypeFormatter } from "../src/TypeFormatter";
export declare const factory: {
    createFormatter: (config: Config) => TypeFormatter;
    createGenerator: (config: Config) => SchemaGenerator;
    createParser: (program: ts.Program, config: Config) => NodeParser;
    createProgram: (config: Config) => ts.Program;
};
