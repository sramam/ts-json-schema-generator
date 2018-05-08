import * as ts from "typescript";
import { symbolAtNode } from "./symbolAtNode";

export function inspectAllJsDocTags(
    symbol: ts.Symbol,
    visibility: string = "",
): boolean {
    const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return false;
    }
    const checkHidden = (prev: boolean, tag: ts.JSDocTagInfo) => {
        const isHidden = (
            prev || // prev tag hides
            tag.name === "hide" || // current tag hides
            // @visibility <tag1, tag2>
            // visibility is the filter the user asked for
            // if visibility in <val1, val2>, show this symbol, else hide
            // NOTE: if @visibility/@hide tag is absent, symbol is visible by default
            (tag.name === "visibility" &&
                (-1 === ((<string>tag.text).split(",").map((x: string) => x.trim())).indexOf(visibility)))
        );
        return isHidden;
    };
    return jsDocTags.reduce(checkHidden, false);
}

export function isNodeHidden(
    node: ts.Node,
    visibility: string,
): boolean | null {
    const symbol = symbolAtNode(node);
    if (!symbol) {
        return null;
    }
    return inspectAllJsDocTags(symbol, visibility);
}

export function referenceHidden(
    typeChecker: ts.TypeChecker,
    visibility: string = "") {
    return function (node: ts.Node) {
        if (node.kind === ts.SyntaxKind.TypeReference) {
            return inspectAllJsDocTags(typeChecker.getSymbolAtLocation(
                (<ts.TypeReferenceNode>node).typeName)!,
                visibility);
        }

        return isNodeHidden(node, visibility);
    };
}
