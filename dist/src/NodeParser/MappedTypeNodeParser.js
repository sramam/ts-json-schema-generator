"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const LogicError_1 = require("../Error/LogicError");
const NodeParser_1 = require("../NodeParser");
const ObjectType_1 = require("../Type/ObjectType");
const UnionType_1 = require("../Type/UnionType");
const derefType_1 = require("../Utils/derefType");
class MappedTypeNodeParser {
    constructor(typeChecker, childNodeParser) {
        this.typeChecker = typeChecker;
        this.childNodeParser = childNodeParser;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.MappedType;
    }
    createType(node, context) {
        return new ObjectType_1.ObjectType(`indexed-type-${node.getFullStart()}`, [], this.getProperties(node, context), false);
    }
    getProperties(node, context) {
        const constraintType = this.childNodeParser.createType(node.typeParameter.constraint, context);
        const keyListType = derefType_1.derefType(constraintType);
        if (!(keyListType instanceof UnionType_1.UnionType)) {
            throw new LogicError_1.LogicError(`Unexpected type "${constraintType.getId()}" (expected "UnionType")`);
        }
        return keyListType.getTypes().reduce((result, key) => {
            const objectProperty = new ObjectType_1.ObjectProperty(key.getValue(), this.childNodeParser.createType(node.type, this.createSubContext(node, key, context)), !node.questionToken);
            result.push(objectProperty);
            return result;
        }, []);
    }
    createSubContext(node, key, parentContext) {
        const subContext = new NodeParser_1.Context(node);
        parentContext.getParameters().forEach((parentParameter) => {
            subContext.pushParameter(parentParameter);
            subContext.pushArgument(parentContext.getArgument(parentParameter));
        });
        subContext.pushParameter(node.typeParameter.name.text);
        subContext.pushArgument(key);
        return subContext;
    }
}
exports.MappedTypeNodeParser = MappedTypeNodeParser;
//# sourceMappingURL=MappedTypeNodeParser.js.map