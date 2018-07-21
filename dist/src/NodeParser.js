"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogicError_1 = require("./Error/LogicError");
class Context {
    constructor(reference) {
        this.arguments = [];
        this.parameters = [];
        this.defaultArgument = new Map();
        this.reference = reference;
    }
    pushArgument(argumentType) {
        this.arguments.push(argumentType);
    }
    pushParameter(parameterName) {
        this.parameters.push(parameterName);
    }
    setDefault(parameterName, argumentType) {
        this.defaultArgument.set(parameterName, argumentType);
    }
    getArgument(parameterName) {
        const index = this.parameters.indexOf(parameterName);
        if (index < 0 || !this.arguments[index]) {
            if (this.defaultArgument.has(parameterName)) {
                return this.defaultArgument.get(parameterName);
            }
            throw new LogicError_1.LogicError(`Could not find type parameter "${parameterName}"`);
        }
        return this.arguments[index];
    }
    getParameters() {
        return this.parameters;
    }
    getArguments() {
        return this.arguments;
    }
    getReference() {
        return this.reference;
    }
}
exports.Context = Context;
//# sourceMappingURL=NodeParser.js.map