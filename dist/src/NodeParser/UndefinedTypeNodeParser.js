"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const UndefinedType_1 = require("../Type/UndefinedType");
class UndefinedTypeNodeParser {
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.UndefinedKeyword;
    }
    createType(node, context) {
        return new UndefinedType_1.UndefinedType();
    }
}
exports.UndefinedTypeNodeParser = UndefinedTypeNodeParser;
//# sourceMappingURL=UndefinedTypeNodeParser.js.map