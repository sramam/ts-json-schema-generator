"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AliasType_1 = require("../Type/AliasType");
const AnnotatedType_1 = require("../Type/AnnotatedType");
const DefinitionType_1 = require("../Type/DefinitionType");
const ReferenceType_1 = require("../Type/ReferenceType");
function derefType(type) {
    if (type instanceof ReferenceType_1.ReferenceType ||
        type instanceof DefinitionType_1.DefinitionType ||
        type instanceof AliasType_1.AliasType ||
        type instanceof AnnotatedType_1.AnnotatedType) {
        return derefType(type.getType());
    }
    return type;
}
exports.derefType = derefType;
//# sourceMappingURL=derefType.js.map