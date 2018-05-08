"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LogicError_1 = require("../Error/LogicError");
const LiteralType_1 = require("../Type/LiteralType");
const typeKeys_1 = require("../Utils/typeKeys");
class IndexedAccessTypeNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }
    createType(node, context) {
        const indexType = this.childNodeParser.createType(node.indexType, context);
        if (!(indexType instanceof LiteralType_1.LiteralType)) {
            throw new LogicError_1.LogicError(`Unexpected type "${indexType.getId()}" (expected "LiteralType")`);
        }
        const objectType = this.childNodeParser.createType(node.objectType, context);
        const propertyType = typeKeys_1.getTypeByKey(objectType, indexType);
        if (!propertyType) {
            throw new LogicError_1.LogicError(`Invalid index "${indexType.getValue()}" in type "${objectType.getId()}"`);
        }
        return propertyType;
    }
}
exports.IndexedAccessTypeNodeParser = IndexedAccessTypeNodeParser;
//# sourceMappingURL=IndexedAccessTypeNodeParser.js.map