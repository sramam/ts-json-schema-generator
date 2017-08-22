
import * as path from "path";
import * as ts from "typescript";

export function getFullName(node: ts.Node, program: ts.Program): string {
    const typeChecker = program.getTypeChecker();
    const symbol: ts.Symbol = (node as any).symbol;
    const rootDir = program.getCompilerOptions().rootDir || process.cwd();
    const fqName = ((s: ts.Symbol) => {
        const name = typeChecker.getFullyQualifiedName(s);
        const re = name.match(/("(.*)")\.?(.*)/);
        if (re) {
            // const fpath = re[2].replace(rootDir, "").split("/").join(".");
            const fpath = path.relative(rootDir, re[2]).replace(new RegExp(path.sep, "g"), ":");
            return `${fpath}.${re[3]}`;
        } else {
            return name;
        }
    })(symbol);
    return fqName.replace(/".*"\./, "");
}
