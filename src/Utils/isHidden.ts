import * as ts from "typescript";

export function inspectAllJsDocTags(
    symbol: ts.Symbol,
    visibility: string = "hide",
): boolean {
    const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return false;
    }
    const checkHidden = (prev: boolean, tag: ts.JSDocTagInfo) => {
        const isHidden = (
            prev || // prev tag hides
            tag.name === "hide" || // current tag hides
            // @visibility <val>, val !== visibility, hides
            (tag.name === "visibility" && tag.text !== visibility)
        );
        return isHidden;
    };

    return jsDocTags.reduce(checkHidden, false);
}

export function isNodeHidden(
    node: ts.Node,
    visibility: string,
): boolean | null {
    const symbol: ts.Symbol = (node as any).symbol;
    if (!symbol) {
        return null;
    }
    return inspectAllJsDocTags(symbol, visibility);
}

export function referenceHidden(typeChecker: ts.TypeChecker, visibility: string = "_hide_") {
    return function (node: ts.Node) {
        if (node.kind === ts.SyntaxKind.TypeReference) {
            return inspectAllJsDocTags(typeChecker.getSymbolAtLocation(
                (<ts.TypeReferenceNode>node).typeName)!,
                visibility);
        }

        return isNodeHidden(node, visibility);
    };
}
