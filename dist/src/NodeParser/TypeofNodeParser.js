"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LogicError_1 = require("../Error/LogicError");
class TypeofNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TypeQuery;
    }
    createType(node, context) {
        const symbol = this.typeChecker.getSymbolAtLocation(node.exprName);
        const valueDec = symbol.valueDeclaration;
        if (valueDec.type) {
            return this.childNodeParser.createType(valueDec.type, context);
        }
        else if (valueDec.initializer) {
            return this.childNodeParser.createType(valueDec.initializer, context);
        }
        else {
            throw new LogicError_1.LogicError(`Invalid type query "${valueDec.getFullText()}"`);
        }
    }
}
exports.TypeofNodeParser = TypeofNodeParser;
//# sourceMappingURL=TypeofNodeParser.js.map