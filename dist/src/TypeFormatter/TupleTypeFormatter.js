"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TupleType_1 = require("../Type/TupleType");
class TupleTypeFormatter {
    constructor(childTypeFormatter, config) {
        this.childTypeFormatter = childTypeFormatter;
        this.config = config;
    }
    supportsType(type) {
        return type instanceof TupleType_1.TupleType;
    }
    getDefinition(type) {
        const tupleDefinitions = type.getTypes().map((item) => this.childTypeFormatter.getDefinition(item));
        const addAdditionalItems = tupleDefinitions.length > 1 && !this.config.strictTuples;
        const additionalItems = { additionalItems: { anyOf: tupleDefinitions } };
        return Object.assign({ type: "array", items: tupleDefinitions, minItems: tupleDefinitions.length }, (addAdditionalItems ? additionalItems : { maxItems: tupleDefinitions.length }));
    }
    getChildren(type) {
        return type.getTypes().reduce((result, item) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
exports.TupleTypeFormatter = TupleTypeFormatter;
//# sourceMappingURL=TupleTypeFormatter.js.map