"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const UnionType_1 = require("../Type/UnionType");
const typeKeys_1 = require("../Utils/typeKeys");
class TypeOperatorNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TypeOperator;
    }
    createType(node, context) {
        const type = this.childNodeParser.createType(node.type, context);
        const keys = typeKeys_1.getTypeKeys(type);
        return new UnionType_1.UnionType(keys);
    }
}
exports.TypeOperatorNodeParser = TypeOperatorNodeParser;
//# sourceMappingURL=TypeOperatorNodeParser.js.map