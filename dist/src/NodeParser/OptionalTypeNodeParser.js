"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const OptionalType_1 = require("../Type/OptionalType");
class OptionalTypeNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.OptionalType;
    }
    createType(node, context) {
        return new OptionalType_1.OptionalType(this.childNodeParser.createType(node.type, context));
    }
}
exports.OptionalTypeNodeParser = OptionalTypeNodeParser;
//# sourceMappingURL=OptionalTypeNodeParser.js.map