"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const path = require("path");
const ts = require("typescript");
const DiagnosticError_1 = require("../src/Error/DiagnosticError");
const LogicError_1 = require("../src/Error/LogicError");
function createProgramFromConfig(configFile) {
    const config = ts.parseConfigFileTextToJson(configFile, ts.sys.readFile(configFile));
    if (config.error) {
        throw new DiagnosticError_1.DiagnosticError([config.error]);
    }
    else if (!config.config) {
        throw new LogicError_1.LogicError(`Invalid parsed config file "${configFile}"`);
    }
    const parseResult = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configFile), {}, configFile);
    parseResult.options.noEmit = true;
    delete parseResult.options.out;
    delete parseResult.options.outDir;
    delete parseResult.options.outFile;
    delete parseResult.options.declaration;
    return ts.createProgram(parseResult.fileNames, parseResult.options);
}
function approxRootDir(fileGlob) {
    const g = new glob.Glob(fileGlob);
    const set = g.minimatch.set;
    const rootDir = g.minimatch.set[0].reduce((_, el) => {
        if (_.active) {
            if (typeof el === "string") {
                _.parts.push(el);
            }
            else {
                _.active = false;
                _.parts.push("noname.txt");
            }
        }
        return _;
    }, { parts: [], active: true });
    rootDir.parts.pop();
    return rootDir.parts.join(path.sep);
}
function createProgramFromGlob(fileGlob) {
    const rootDir = approxRootDir(fileGlob);
    return ts.createProgram(glob.sync(path.resolve(fileGlob)), {
        noEmit: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        strictNullChecks: false,
        rootDir: rootDir,
    });
}
function createProgram(config) {
    const program = path.extname(config.path) === ".json" ?
        createProgramFromConfig(config.path) :
        createProgramFromGlob(config.path);
    if (!config.skipTypeCheck) {
        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length) {
            throw new DiagnosticError_1.DiagnosticError(diagnostics);
        }
    }
    return program;
}
exports.createProgram = createProgram;
//# sourceMappingURL=program.js.map