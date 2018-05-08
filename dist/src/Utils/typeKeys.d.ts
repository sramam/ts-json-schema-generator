import { BaseType } from "../Type/BaseType";
import { LiteralType } from "../Type/LiteralType";
export declare function getTypeKeys(type: BaseType): LiteralType[];
export declare function getTypeByKey(type: BaseType, index: LiteralType): BaseType | undefined;
