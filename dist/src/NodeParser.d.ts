import * as ts from "typescript";
import { BaseType } from "./Type/BaseType";
export declare class Context {
    private arguments;
    private parameters;
    private reference?;
    private defaultArgument;
    constructor(reference?: ts.Node);
    pushArgument(argumentType: BaseType): void;
    pushParameter(parameterName: string): void;
    setDefault(parameterName: string, argumentType: BaseType): void;
    getArgument(parameterName: string): BaseType;
    getParameters(): ReadonlyArray<string>;
    getArguments(): ReadonlyArray<BaseType>;
    getReference(): ts.Node | undefined;
}
export interface NodeParser {
    createType(node: ts.Node, context: Context): BaseType;
}
