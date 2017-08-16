import * as ts from "typescript";

import { Config } from "../src/Config";
import { NodeParser } from "../src/NodeParser";
import { SchemaGenerator } from "../src/SchemaGenerator";
import { TypeFormatter } from "../src/TypeFormatter";

import { createFormatter } from "./formatter";
import { createGenerator } from "./generator";
import { createParser } from "./parser";
import { createProgram } from "./program";

export const factory = {
    createFormatter,
    createGenerator,
    createParser,
    createProgram,
};
