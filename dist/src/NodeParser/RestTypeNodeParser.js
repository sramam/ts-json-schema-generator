"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const RestType_1 = require("../Type/RestType");
class RestTypeNodeParser {
    constructor(childNodeParser) {
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.RestType;
    }
    createType(node, context) {
        return new RestType_1.RestType(this.childNodeParser.createType(node.type, context));
    }
}
exports.RestTypeNodeParser = RestTypeNodeParser;
//# sourceMappingURL=RestTypeNodeParser.js.map