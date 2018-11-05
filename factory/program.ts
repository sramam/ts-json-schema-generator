import * as glob from "glob";
import * as path from "path";
import * as ts from "typescript";

import { Config } from "../src/Config";
import { DiagnosticError } from "../src/Error/DiagnosticError";
import { LogicError } from "../src/Error/LogicError";

function createProgramFromConfig(configFile: string): ts.Program {
    const config = ts.parseConfigFileTextToJson(
        configFile,
        ts.sys.readFile(configFile)!,
    );
    if (config.error) {
        throw new DiagnosticError([config.error]);
    } else if (!config.config) {
        throw new LogicError(`Invalid parsed config file "${configFile}"`);
    }

    const parseResult = ts.parseJsonConfigFileContent(
        config.config,
        ts.sys,
        path.dirname(configFile),
        {},
        configFile,
    );
    parseResult.options.noEmit = true;
    delete parseResult.options.out;
    delete parseResult.options.outDir;
    delete parseResult.options.outFile;
    delete parseResult.options.declaration;

    return ts.createProgram(
        parseResult.fileNames,
        parseResult.options,
    );
}


function approxRootDir(fileGlob: string): string {
    const g = new glob.Glob(fileGlob);
    const set = g.minimatch.set;
    const rootDir = g.minimatch.set[0].reduce((
        _: { parts: string[], active: boolean },
        el: string | object,
    ) => {
        if (_.active) {
            if (typeof el === "string") {
                _.parts.push(el);
            } else {
                _.active = false;
                _.parts.push("noname.txt");
            }
        }
        return _;
    }, { parts: [], active: true });
    rootDir.parts.pop();
    return rootDir.parts.join(path.sep);
}

function createProgramFromGlob(fileGlob: string): ts.Program {
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

export function createProgram(config: Config): ts.Program {
    const program: ts.Program = path.extname(config.path) === ".json" ?
        createProgramFromConfig(config.path) :
        createProgramFromGlob(config.path);

    if (!config.skipTypeCheck) {
        const diagnostics = ts.getPreEmitDiagnostics(program);
        if (diagnostics.length) {
            throw new DiagnosticError(diagnostics);
        }
    }

    return program;
}
