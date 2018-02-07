"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicAnnotationsReader_1 = require("./BasicAnnotationsReader");
class ExtendedAnnotationsReader extends BasicAnnotationsReader_1.BasicAnnotationsReader {
    getAnnotations(node) {
        const annotations = Object.assign({}, this.getDescriptionAnnotation(node), this.getAllAnnotations(node), super.getAnnotations(node));
        return Object.keys(annotations).length ? annotations : undefined;
    }
    isNullable(node) {
        const symbol = node.symbol;
        if (!symbol) {
            return false;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return false;
        }
        const jsDocTag = jsDocTags.find((tag) => tag.name === "nullable");
        return !!jsDocTag;
    }
    getDescriptionAnnotation(node) {
        const symbol = node.symbol;
        if (!symbol) {
            return undefined;
        }
        const comments = symbol.getDocumentationComment(this.typeChecker);
        if (!comments || !comments.length) {
            return undefined;
        }
        return { description: comments.map((comment) => comment.text).join(" ") };
    }
    getAllAnnotations(node) {
        const symbol = node.symbol;
        if (symbol) {
            const jsDocTags = symbol.getJsDocTags();
            return jsDocTags.reduce((_, t) => {
                switch (t.name) {
                    case "nullable":
                        _.nullable = "";
                        break;
                    case "asType":
                    case "TJS-type":
                        _.type = t.text;
                        break;
                    case "memberOf":
                        break;
                    default:
                        _[t.name] = t.text;
                }
                return _;
            }, {});
        }
        return undefined;
    }
    getTypeAnnotation(node) {
        const symbol = node.symbol;
        if (!symbol) {
            return undefined;
        }
        const jsDocTags = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        const jsDocTag = jsDocTags.find((tag) => tag.name === "asType" || tag.name === "TJS-type");
        if (!jsDocTag || !jsDocTag.text) {
            return undefined;
        }
        return { type: jsDocTag.text };
    }
}
exports.ExtendedAnnotationsReader = ExtendedAnnotationsReader;
//# sourceMappingURL=ExtendedAnnotationsReader.js.map