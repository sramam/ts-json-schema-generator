"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const NullType_1 = require("../Type/NullType");
class UndefinedLiteralNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.UndefinedKeyword;
    }
    createType(node, context) {
        return new NullType_1.NullType();
    }
}
exports.UndefinedLiteralNodeParser = UndefinedLiteralNodeParser;
//# sourceMappingURL=UndefinedLiteralNodeParser.js.map