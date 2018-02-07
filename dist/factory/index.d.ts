import { createFormatter } from "./formatter";
import { createGenerator } from "./generator";
import { createParser } from "./parser";
import { createProgram } from "./program";
export declare const factory: {
    createFormatter: typeof createFormatter;
    createGenerator: typeof createGenerator;
    createParser: typeof createParser;
    createProgram: typeof createProgram;
};
