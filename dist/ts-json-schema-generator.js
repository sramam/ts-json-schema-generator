"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const stringify = require("json-stable-stringify");
const generator_1 = require("./factory/generator");
const Config_1 = require("./src/Config");
const BaseError_1 = require("./src/Error/BaseError");
const formatError_1 = require("./src/Utils/formatError");
const args = commander
    .option("-p, --path <path>", "Typescript path")
    .option("-t, --type <name>", "Type name")
    .option("-e, --expose <expose>", "Type exposing", /^(all|none|export)$/, "export")
    .option("-r, --no-top-ref", "Do not create a top-level $ref definition")
    .option("-j, --jsDoc <extended>", "Read JsDoc annotations", /^(extended|none|basic)$/, "extended")
    .option("-u, --unstable", "Do not sort properties")
    .option("-s, --strictTuples", "Do not allow additional items on tuples")
    .option("-z, --visibility <tag>", "hides on `@hide` or `@visibility != <tag>`", "")
    .parse(process.argv);
const config = Object.assign({}, Config_1.DEFAULT_CONFIG, { path: args.path, type: args.type, expose: args.expose, topRef: args.topRef, jsDoc: args.jsDoc, sortProps: !args.unstable, strictTuples: args.strictTuples });
try {
    const schema = generator_1.createGenerator(config).createSchema(args.type);
    process.stdout.write(config.sortProps ?
        stringify(schema, { space: 2 }) :
        JSON.stringify(schema, null, 2));
}
catch (error) {
    if (error instanceof BaseError_1.BaseError) {
        process.stderr.write(formatError_1.formatError(error));
        process.exit(1);
    }
    else {
        throw error;
    }
}
//# sourceMappingURL=ts-json-schema-generator.js.map