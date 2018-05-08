"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AnyType_1 = require("../Type/AnyType");
const BaseType_1 = require("../Type/BaseType");
const ObjectType_1 = require("../Type/ObjectType");
const UndefinedType_1 = require("../Type/UndefinedType");
const UnionType_1 = require("../Type/UnionType");
const allOfDefinition_1 = require("../Utils/allOfDefinition");
class ObjectTypeFormatter {
    constructor(childTypeFormatter) {
        this.childTypeFormatter = childTypeFormatter;
    }
    supportsType(type) {
        return type instanceof ObjectType_1.ObjectType;
    }
    getDefinition(type) {
        if (type.getBaseTypes().length === 0) {
            return this.getObjectDefinition(type);
        }
        return type.getBaseTypes().reduce(allOfDefinition_1.getAllOfDefinitionReducer(this.childTypeFormatter), this.getObjectDefinition(type));
    }
    getChildren(type) {
        const properties = type.getProperties();
        const additionalProperties = type.getAdditionalProperties();
        return [
            ...type.getBaseTypes().reduce((result, baseType) => [
                ...result,
                ...this.childTypeFormatter.getChildren(baseType).slice(1),
            ], []),
            ...additionalProperties instanceof BaseType_1.BaseType ?
                this.childTypeFormatter.getChildren(additionalProperties) :
                [],
            ...properties.reduce((result, property) => [
                ...result,
                ...this.childTypeFormatter.getChildren(property.getType()),
            ], []),
        ];
    }
    getObjectDefinition(type) {
        const objectProperties = type.getProperties();
        const additionalProperties = type.getAdditionalProperties();
        const required = objectProperties
            .map((property) => this.prepareObjectProperty(property))
            .filter((property) => property.isRequired())
            .map((property) => property.getName());
        const properties = objectProperties
            .map((property) => this.prepareObjectProperty(property))
            .reduce((result, property) => (Object.assign({}, result, { [property.getName()]: this.childTypeFormatter.getDefinition(property.getType()) })), {});
        return Object.assign({ type: "object" }, (Object.keys(properties).length > 0 ? { properties } : {}), (required.length > 0 ? { required } : {}), (additionalProperties === true || additionalProperties instanceof AnyType_1.AnyType ? {} :
            { additionalProperties: additionalProperties instanceof BaseType_1.BaseType ?
                    this.childTypeFormatter.getDefinition(additionalProperties) :
                    additionalProperties }));
    }
    getAdditionalProperties(additionalProperties) {
        if (typeof additionalProperties === "boolean") {
            return additionalProperties ? {} : { additionalProperties: false };
        }
        return additionalProperties instanceof AnyType_1.AnyType
            ? {}
            : { additionalProperties: this.childTypeFormatter.getDefinition(additionalProperties) };
    }
    prepareObjectProperty(property) {
        const propType = property.getType();
        if (propType instanceof UndefinedType_1.UndefinedType) {
            return new ObjectType_1.ObjectProperty(property.getName(), new UndefinedType_1.UndefinedType(), false);
        }
        else if (!(propType instanceof UnionType_1.UnionType)) {
            return property;
        }
        const requiredTypes = propType.getTypes().filter((it) => !(it instanceof UndefinedType_1.UndefinedType));
        if (propType.getTypes().length === requiredTypes.length) {
            return property;
        }
        else if (requiredTypes.length === 0) {
            return new ObjectType_1.ObjectProperty(property.getName(), new UndefinedType_1.UndefinedType(), false);
        }
        return new ObjectType_1.ObjectProperty(property.getName(), requiredTypes.length === 1 ? requiredTypes[0] : new UnionType_1.UnionType(requiredTypes), false);
    }
}
exports.ObjectTypeFormatter = ObjectTypeFormatter;
//# sourceMappingURL=ObjectTypeFormatter.js.map