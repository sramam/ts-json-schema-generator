import * as ts from "typescript";
import { Annotations } from "../Type/AnnotatedType";
import { BasicAnnotationsReader } from "./BasicAnnotationsReader";

export class ExtendedAnnotationsReader extends BasicAnnotationsReader {
    public getAnnotations(node: ts.Node): Annotations | undefined {
        const annotations: Annotations = {
            ...this.getDescriptionAnnotation(node),
            ...this.getAllAnnotations(node),
            ...super.getAnnotations(node),
        };
        return Object.keys(annotations).length ? annotations : undefined;
    }

    private getDescriptionAnnotation(node: ts.Node): Annotations | undefined {
        const symbol: ts.Symbol = (node as any).symbol;
        if (!symbol) {
            return undefined;
        }

        const comments: ts.SymbolDisplayPart[] = symbol.getDocumentationComment();
        if (!comments || !comments.length) {
            return undefined;
        }

        return { description: comments.map((comment: ts.SymbolDisplayPart) => comment.text).join(" ") };
    }

    private getAllAnnotations(node: ts.Node): Annotations | undefined {
        const symbol = (node as any).symbol;
        if (symbol) {
            const jsDocTags = symbol.getJsDocTags();
            return jsDocTags.reduce((
                _: { [key: string]: any },
                t: ts.JSDocTagInfo) => {
                // we skip the memberOf tag that VSCode
                // seems to insert automatically
                if (t.name !== "memberOf") {
                    _[t.name] = t.text;
                }
                return _;
            }, {});
        }
        return undefined;
    }
    private getTypeAnnotation(node: ts.Node): Annotations | undefined {
        const symbol: ts.Symbol = (node as any).symbol;
        if (!symbol) {
            return undefined;
        }

        const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
        if (!jsDocTags || !jsDocTags.length) {
            return undefined;
        }
        console.log(JSON.stringify(jsDocTags, null, 2));

        const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find(
            (tag: ts.JSDocTagInfo) => tag.name === "asType" || tag.name === "TJS-type");
        if (!jsDocTag || !jsDocTag.text) {
            return undefined;
        }

        return { type: jsDocTag.text };
    }

    public isNullable(node: ts.Node): boolean {
        const symbol: ts.Symbol = (node as any).symbol;
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
}
