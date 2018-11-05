"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OptionalType_1 = require("../Type/OptionalType");
const RestType_1 = require("../Type/RestType");
const TupleType_1 = require("../Type/TupleType");
class TupleTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof TupleType_1.TupleType;
    }
    getDefinition(type) {
        const subTypes = type.getTypes();
        const requiredElements = subTypes.filter(t => !(t instanceof OptionalType_1.OptionalType) && !(t instanceof RestType_1.RestType));
        const optionalElements = subTypes.filter(t => t instanceof OptionalType_1.OptionalType);
        const restElements = subTypes.filter(t => t instanceof RestType_1.RestType);
        const requiredDefinitions = requiredElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const optionalDefinitions = optionalElements.map((item) => this.childTypeFormatter.getDefinition(item));
        const itemsTotal = requiredDefinitions.length + optionalDefinitions.length;
        const restType = restElements.length ? restElements[0].getType().getItem() : undefined;
        const restDefinition = restType ? this.childTypeFormatter.getDefinition(restType) : undefined;
        return Object.assign({ type: "array", minItems: requiredDefinitions.length }, (itemsTotal ? { items: requiredDefinitions.concat(optionalDefinitions) } : {}), (!itemsTotal && restDefinition ? { items: restDefinition } : {}), (!itemsTotal && !restDefinition ? { maxItems: 0 } : {}), (restDefinition && itemsTotal ? { additionalItems: restDefinition } : {}), (!restDefinition && itemsTotal ? { maxItems: itemsTotal } : {}));
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