import * as ts from "typescript";
import { Annotations } from "../Type/AnnotatedType";
import { BasicAnnotationsReader } from "./BasicAnnotationsReader";
export declare class ExtendedAnnotationsReader extends BasicAnnotationsReader {
    protected typeChecker: ts.TypeChecker;
    constructor(typeChecker: ts.TypeChecker);
    getAnnotations(node: ts.Node): Annotations | undefined;
    isNullable(node: ts.Node): boolean;
    private getDescriptionAnnotation;
    private getAllAnnotations;
    private getTypeAnnotation;
}
