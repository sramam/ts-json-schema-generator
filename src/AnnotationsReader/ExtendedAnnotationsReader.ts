import * as ts from "typescript";
import { Annotations } from "../Type/AnnotatedType";
import { symbolAtNode } from "../Utils/symbolAtNode";
import { BasicAnnotationsReader } from "./BasicAnnotationsReader";

export class ExtendedAnnotationsReader extends BasicAnnotationsReader {
    constructor(protected typeChecker: ts.TypeChecker) {
        super(typeChecker);
    }

    public getAnnotations(node: ts.Node): Annotations | undefined {
        const annotations: Annotations = {
            ...this.getDescriptionAnnotation(node),
            // ...this.getTypeAnnotation(node),
            ...this.getAllAnnotations(node),
            ...super.getAnnotations(node),
        };
        return Object.keys(annotations).length ? annotations : undefined;
    }

    public isNullable(node: ts.Node): boolean {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return false;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return false;
        }

        const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find(
            (tag: ts.JSDocTagInfo) => tag.name === "nullable");
        return !!jsDocTag;
    }

    private getDescriptionAnnotation(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return undefined;
        }

        const comments: ts.SymbolDisplayPart[] = symbol.getDocumentationComment(this.typeChecker);
        if (!comments || !comments.length) {
            return undefined;
        }

        return { description: comments.map((comment) => comment.text).join(" ") };
    }

    private getAllAnnotations(node: ts.Node): Annotations | undefined {
        const symbol = (node as any).symbol;
        if (symbol) {
            const jsDocTags = symbol.getJsDocTags();
            return jsDocTags.reduce((
                _: { [key: string]: any },
                t: ts.JSDocTagInfo) => {
                    switch (t.name) {
                        case "nullable":
                            _.nullable = "";
                            break;
                        case "asType":
                        case "TJS-type":
                            _.type = t.text;
                            break;
                        case "memberOf":
                            // skip
                            break;
                        default:
                            _[t.name] = t.text;
                    }
                    return _;
                }, {});
        }
        return undefined;
    }

    private getTypeAnnotation(node: ts.Node): Annotations | undefined {
        const symbol = symbolAtNode(node);
        if (!symbol) {
            return undefined;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }

        const jsDocTag = jsDocTags.find((tag) => tag.name === "asType");
        if (!jsDocTag || !jsDocTag.text) {
            return undefined;
        }

        // strips surrounding braces added by some IDE tooling
        return {type: jsDocTag.text.replace(/{(.*)}/, "$1")};
    }
}
