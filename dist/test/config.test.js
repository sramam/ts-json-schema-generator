"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = require("ajv");
const chai_1 = require("chai");
const fs = require("fs");
const path_1 = require("path");
const formatter_1 = require("../factory/formatter");
const parser_1 = require("../factory/parser");
const program_1 = require("../factory/program");
const Config_1 = require("../src/Config");
const SchemaGenerator_1 = require("../src/SchemaGenerator");
const validator = new Ajv();
const metaSchema = require("ajv/lib/refs/json-schema-draft-04.json");
validator.addMetaSchema(metaSchema, "http://json-schema.org/draft-04/schema#");
const basePath = "test/config";
function assertSchema(name, partialConfig, only = false) {
    const run = only ? it.only : it;
    run(name, () => {
        const config = Object.assign({}, Config_1.DEFAULT_CONFIG, partialConfig, { path: path_1.resolve(`${basePath}/${name}/*.ts`) });
        const program = program_1.createProgram(config);
        const generator = new SchemaGenerator_1.SchemaGenerator(program, parser_1.createParser(program, config), formatter_1.createFormatter(config));
        const expected = JSON.parse(fs.readFileSync(path_1.resolve(`${basePath}/${name}/schema.json`), "utf8"));
        const actual = JSON.parse(JSON.stringify(generator.createSchema(config.type)));
        fs.writeFileSync(path_1.resolve(`${basePath}/${name}/schema.json`), JSON.stringify(actual, null, 4), "utf8");
        chai_1.assert.isObject(actual);
        chai_1.assert.deepEqual(actual, expected);
        validator.validateSchema(actual);
        chai_1.assert.equal(validator.errors, null);
    });
}
describe("config", () => {
    const visibility = "hide";
    assertSchema("expose-all-topref-true", { type: "MyObject", expose: "all", topRef: true, jsDoc: "none", visibility });
    assertSchema("expose-all-topref-false", { type: "MyObject", expose: "all", topRef: false, jsDoc: "none", visibility });
    assertSchema("expose-none-topref-true", { type: "MyObject", expose: "none", topRef: true, jsDoc: "none", visibility });
    assertSchema("expose-none-topref-false", { type: "MyObject", expose: "none", topRef: false, jsDoc: "none", visibility });
    assertSchema("expose-export-topref-true", { type: "MyObject", expose: "export", topRef: true, jsDoc: "none", visibility });
    assertSchema("expose-export-topref-false", { type: "MyObject", expose: "export", topRef: false, jsDoc: "none", visibility });
    assertSchema("jsdoc-complex-none", { type: "MyObject", expose: "export", topRef: true, jsDoc: "none", visibility });
    assertSchema("jsdoc-complex-basic", { type: "MyObject", expose: "export", topRef: true, jsDoc: "basic", visibility });
    assertSchema("jsdoc-complex-extended", { type: "MyObject", expose: "export", topRef: true, jsDoc: "extended", visibility });
    assertSchema("jsdoc-description-only", { type: "MyObject", expose: "export", topRef: true, jsDoc: "extended", visibility });
    assertSchema("jsdoc-hide", { type: "MyObject", expose: "export", topRef: true, jsDoc: "extended", visibility });
    assertSchema("jsdoc-inheritance", { type: "MyObject", expose: "export", topRef: true, jsDoc: "extended", visibility });
    assertSchema("jsdoc-visible", { type: "MyObject", expose: "export", topRef: true, jsDoc: "extended", visibility: "status" });
});
//# sourceMappingURL=config.test.js.map