"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefinitionType_1 = require("./Type/DefinitionType");
const fullName_1 = require("./Utils/fullName");
class ExposeNodeParser {
    constructor(program, subNodeParser, expose) {
        this.program = program;
        this.subNodeParser = subNodeParser;
        this.expose = expose;
        this.typeChecker = program.getTypeChecker();
    }
    supportsNode(node) {
        return this.subNodeParser.supportsNode(node);
    }
    createType(node, context) {
        const baseType = this.subNodeParser.createType(node, context);
        if (!this.isExportNode(node)) {
            return baseType;
        }
        return new DefinitionType_1.DefinitionType(this.getDefinitionName(node, context), baseType);
    }
    isExportNode(node) {
        if (this.expose === "all") {
            return true;
        }
        else if (this.expose === "none") {
            return false;
        }
        const localSymbol = node.localSymbol;
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    getDefinitionName(node, context) {
        const fullName = fullName_1.getFullName(node, this.program);
        const argumentIds = context.getArguments().map((arg) => arg.getId());
        return argumentIds.length ? `${fullName}<${argumentIds.join(",")}>` : fullName;
    }
}
exports.ExposeNodeParser = ExposeNodeParser;
//# sourceMappingURL=ExposeNodeParser.js.map