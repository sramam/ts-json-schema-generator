"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function inspectAllJsDocTags(symbol, visibility = "") {
    const jsDocTags = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return false;
    }
    const checkHidden = (prev, tag) => {
        const isHidden = (prev ||
            tag.name === "hide" ||
            (tag.name === "visibility" &&
                (-1 === (tag.text.split(",").map((x) => x.trim())).indexOf(visibility))));
        return isHidden;
    };
    return jsDocTags.reduce(checkHidden, false);
}
exports.inspectAllJsDocTags = inspectAllJsDocTags;
function isNodeHidden(node, visibility) {
    const symbol = node.symbol;
    if (!symbol) {
        return null;
    }
    return inspectAllJsDocTags(symbol, visibility);
}
exports.isNodeHidden = isNodeHidden;
function referenceHidden(typeChecker, visibility = "") {
    return function (node) {
        if (node.kind === ts.SyntaxKind.TypeReference) {
            return inspectAllJsDocTags(typeChecker.getSymbolAtLocation(node.typeName), visibility);
        }
        return isNodeHidden(node, visibility);
    };
}
exports.referenceHidden = referenceHidden;
//# sourceMappingURL=isHidden.js.map