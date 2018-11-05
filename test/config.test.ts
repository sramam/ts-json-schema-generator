import * as Ajv from "ajv";
import { assert } from "chai";
import * as fs from "fs";
import { resolve } from "path";
import * as ts from "typescript";

import { createFormatter } from "../factory/formatter";
import { createParser } from "../factory/parser";
import { createProgram } from "../factory/program";
import { Config, DEFAULT_CONFIG, PartialConfig } from "../src/Config";
import { SchemaGenerator } from "../src/SchemaGenerator";
import { Run } from "./valid-data.test";

const validator = new Ajv();
const metaSchema: object = require("ajv/lib/refs/json-schema-draft-06.json");
validator.addMetaSchema(metaSchema);

const basePath = "test/config";

function assertSchema(name: string, partialConfig: PartialConfig & { type: string }, only: Boolean = false): void {
    const run: Run = only ? it.only : it;
    run(name, () => {
        const config: Config = {
            ...DEFAULT_CONFIG,
            ...partialConfig,
            path: resolve(`${basePath}/${name}/*.ts`),
        };

        const program: ts.Program = createProgram(config);
        const generator: SchemaGenerator = new SchemaGenerator(
            program,
            createParser(program, config),
            createFormatter(config),
        );
        const expected: any = JSON.parse(fs.readFileSync(resolve(`${basePath}/${name}/schema.json`), "utf8"));
        const actual: any = JSON.parse(JSON.stringify(generator.createSchema(config.type)));
        // uncomment this line to update expected output automatically.
        fs.writeFileSync(resolve(`${basePath}/${name}/schema.json`), JSON.stringify(actual, null, 4), "utf8");

        assert.isObject(actual);
        assert.deepEqual(actual, expected, JSON.stringify({actual, expected}));

        validator.validateSchema(actual);
        assert.isNull(validator.errors);
    });
}

describe("config", () => {
    const visibility = "hide";
    assertSchema("expose-all-topref-true",
        { type: "MyObject", expose: "all", topRef: true, jsDoc: "none", visibility });
    assertSchema("expose-all-topref-false",
        { type: "MyObject", expose: "all", topRef: false, jsDoc: "none", visibility });

    assertSchema("expose-none-topref-true",
        { type: "MyObject", expose: "none", topRef: true, jsDoc: "none", visibility });
    assertSchema("expose-none-topref-false",
        { type: "MyObject", expose: "none", topRef: false, jsDoc: "none", visibility });

    assertSchema("expose-export-topref-true",
        { type: "MyObject", expose: "export", topRef: true, jsDoc: "none", visibility });
    assertSchema("expose-export-topref-false",
        { type: "MyObject", expose: "export", topRef: false, jsDoc: "none", visibility });

    assertSchema("jsdoc-complex-none",
        { type: "MyObject", expose: "export", topRef: true, jsDoc: "none", visibility });
    assertSchema("jsdoc-complex-basic",
        { type: "MyObject", expose: "export", topRef: true, jsDoc: "basic", visibility });
    assertSchema("jsdoc-complex-extended",
        { type: "MyObject", expose: "export", topRef: true, jsDoc: "extended", visibility });
    assertSchema("jsdoc-description-only",
        { type: "MyObject", expose: "export", topRef: true, jsDoc: "extended", visibility });

    assertSchema("jsdoc-hide",
        {type: "MyObject", expose: "export", topRef: true, jsDoc: "extended", visibility });
    assertSchema("jsdoc-inheritance",
        {type: "MyObject", expose: "export", topRef: true, jsDoc: "extended", visibility });
    // assertSchema("strict-tuples-true", {
    //     type: "MyObject",
    //     expose: "export",
    //     topRef: true,
    //     jsDoc: "none",
    //     strictTuples: true,
    //     visibility,
    // });
    // assertSchema("strict-tuples-false", {
    //     type: "MyObject",
    //     expose: "export",
    //     topRef: true,
    //     jsDoc: "none",
    //     strictTuples: false,
    //     visibility,
    // });
    // ensure that skipping type checking doesn't alter the JSON schema output
    assertSchema("jsdoc-complex-extended", {
        type: "MyObject",
        expose: "export",
        topRef: true,
        jsDoc: "extended",
        skipTypeCheck: true,
        visibility,
    });
    assertSchema("jsdoc-visible",
        { type: "MyObject", expose: "export", topRef: true, jsDoc: "extended", visibility: "status" });
});
