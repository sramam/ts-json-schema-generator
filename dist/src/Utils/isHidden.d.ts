import * as ts from "typescript";
export declare function inspectAllJsDocTags(symbol: ts.Symbol, visibility?: string): boolean;
export declare function isNodeHidden(node: ts.Node, visibility: string): boolean | null;
export declare function referenceHidden(typeChecker: ts.TypeChecker, visibility?: string): (node: ts.Node) => boolean | null;
