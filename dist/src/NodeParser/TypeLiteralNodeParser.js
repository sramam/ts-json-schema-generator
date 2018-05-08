"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const ObjectType_1 = require("../Type/ObjectType");
const isHidden_1 = require("../Utils/isHidden");
class TypeLiteralNodeParser {
    constructor(childNodeParser, visibility) {
        this.childNodeParser = childNodeParser;
        this.visibility = visibility;
    }
    supportsNode(node) {
        return node.kind === ts.SyntaxKind.TypeLiteral;
    }
    createType(node, context) {
        return new ObjectType_1.ObjectType(this.getTypeId(node, context), [], this.getProperties(node, context), this.getAdditionalProperties(node, context));
    }
    getProperties(node, context) {
        return node.members
            .filter((property) => property.kind === ts.SyntaxKind.PropertySignature)
            .reduce((result, propertyNode) => {
            const propertySymbol = propertyNode.symbol;
            if (isHidden_1.inspectAllJsDocTags(propertySymbol, this.visibility)) {
                return result;
            }
            const objectProperty = new ObjectType_1.ObjectProperty(propertySymbol.getName(), this.childNodeParser.createType(propertyNode.type, context), !propertyNode.questionToken);
            result.push(objectProperty);
            return result;
        }, []);
    }
    getAdditionalProperties(node, context) {
        const property = node.members.find((it) => it.kind === ts.SyntaxKind.IndexSignature);
        if (!property) {
            return false;
        }
        const signature = property;
        return this.childNodeParser.createType(signature.type, context);
    }
    getTypeId(node, context) {
        const fullName = `structure-${node.getFullStart()}`;
        const argumentIds = context.getArguments().map((arg) => arg.getId());
        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
exports.TypeLiteralNodeParser = TypeLiteralNodeParser;
//# sourceMappingURL=TypeLiteralNodeParser.js.map