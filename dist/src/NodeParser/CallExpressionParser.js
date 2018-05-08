"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LiteralType_1 = require("../Type/LiteralType");
const TupleType_1 = require("../Type/TupleType");
const UnionType_1 = require("../Type/UnionType");
class CallExpressionParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.CallExpression;
    }
    createType(node, context) {
        const type = this.typeChecker.getTypeAtLocation(node);
        return new TupleType_1.TupleType([new UnionType_1.UnionType(type.typeArguments[0].types.map((t) => new LiteralType_1.LiteralType(t.value)))]);
    }
}
exports.CallExpressionParser = CallExpressionParser;
//# sourceMappingURL=CallExpressionParser.js.map