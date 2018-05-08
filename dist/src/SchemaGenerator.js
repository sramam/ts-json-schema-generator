"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const NoRootTypeError_1 = require("./Error/NoRootTypeError");
const NodeParser_1 = require("./NodeParser");
const DefinitionType_1 = require("./Type/DefinitionType");
const fullName_1 = require("./Utils/fullName");
const symbolAtNode_1 = require("./Utils/symbolAtNode");
class SchemaGenerator {
    constructor(program, nodeParser, typeFormatter) {
        this.program = program;
        this.nodeParser = nodeParser;
        this.typeFormatter = typeFormatter;
        const rootDir = this.program.getCompilerOptions().rootDir;
        if (!rootDir) {
            console.warn(`WARN: 'rootDir' compiler option is not specified. Will use cwd: '${process.cwd()}'`);
        }
    }
    createSchema(fullName) {
        const rootNode = this.findRootNode(fullName);
        const rootType = this.nodeParser.createType(rootNode, new NodeParser_1.Context());
        return Object.assign({ $schema: "http://json-schema.org/draft-06/schema#", definitions: this.getRootChildDefinitions(rootType) }, this.getRootTypeDefinition(rootType));
    }
    findRootNode(fullName) {
        const typeChecker = this.program.getTypeChecker();
        const allTypes = new Map();
        this.program.getSourceFiles().forEach((sourceFile) => this.inspectNode(sourceFile, typeChecker, allTypes));
        if (allTypes.has(fullName)) {
            return allTypes.get(fullName);
        }
        const re = new RegExp(`.*${fullName}`);
        const matches = [];
        for (const k of allTypes.keys()) {
            if (k.match(re)) {
                matches.push(k);
            }
        }
        switch (matches.length) {
            case 1:
                const node = allTypes.get(matches[0]);
                return node;
            case 0: {
                const all = [];
                allTypes.forEach((val, key) => all.push(key));
                console.warn(`No types matching ${fullName} found.`);
                throw new NoRootTypeError_1.NoRootTypeError(fullName);
            }
            default: {
                const all = matches.map((key) => key);
                console.warn(`Multiple types match '${fullName}'. Please pick one: ${JSON.stringify(all, null, 2)}`);
                throw new NoRootTypeError_1.NoRootTypeError(fullName);
            }
        }
    }
    inspectNode(node, typeChecker, allTypes) {
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration ||
            node.kind === ts.SyntaxKind.EnumDeclaration ||
            node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
            if (!this.isExportType(node)) {
                return;
            }
            else if (this.isGenericType(node)) {
                return;
            }
            allTypes.set(fullName_1.getFullName(node, this.program), node);
        }
        else {
            ts.forEachChild(node, (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
        }
    }
    isExportType(node) {
        const localSymbol = symbolAtNode_1.localSymbolAtNode(node);
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    isGenericType(node) {
        return !!(node.typeParameters &&
            node.typeParameters.length > 0);
    }
    getRootTypeDefinition(rootType) {
        return this.typeFormatter.getDefinition(rootType);
    }
    getRootChildDefinitions(rootType) {
        return this.typeFormatter.getChildren(rootType)
            .filter((child) => child instanceof DefinitionType_1.DefinitionType)
            .reduce((result, child) => (Object.assign({}, result, { [child.getId()]: this.typeFormatter.getDefinition(child.getType()) })), {});
    }
}
exports.SchemaGenerator = SchemaGenerator;
//# sourceMappingURL=SchemaGenerator.js.map