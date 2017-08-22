"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
function getFullName(node, program) {
    const typeChecker = program.getTypeChecker();
    const symbol = node.symbol;
    const rootDir = program.getCompilerOptions().rootDir || process.cwd();
    const fqName = ((s) => {
        const name = typeChecker.getFullyQualifiedName(s);
        const re = name.match(/("(.*)")\.?(.*)/);
        if (re) {
            const fpath = path.relative(rootDir, re[2]).replace(new RegExp(path.sep, "g"), ":");
            return `${fpath}.${re[3]}`;
        }
        else {
            return name;
        }
    })(symbol);
    return fqName.replace(/".*"\./, "");
}
exports.getFullName = getFullName;
//# sourceMappingURL=fullName.js.map