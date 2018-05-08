import { Definition } from "../Schema/Definition";
import { SubTypeFormatter } from "../SubTypeFormatter";
import { BaseType } from "../Type/BaseType";
import { EnumType, EnumValue } from "../Type/EnumType";
import { uniqueArray } from "../Utils/uniqueArray";

export class EnumTypeFormatter implements SubTypeFormatter {
    public supportsType(type: EnumType): boolean {
        return type instanceof EnumType;
    }
    public getDefinition(type: EnumType): Definition {
        const values = uniqueArray(type.getValues());
        const types = uniqueArray(values.map((value) => this.getValueType(value)));

        return {
            type: types.length === 1 ? types[0] : types,
            enum: values,
        };
    }
    public getChildren(type: EnumType): BaseType[] {
        return [];
    }

    private getValueType(value: EnumValue): string {
        return value === null ? "null" : typeof value;
    }
}
