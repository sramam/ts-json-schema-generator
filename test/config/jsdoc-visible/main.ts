// You can hide enum entries and object proeprties by annotating them with @hide.

export enum Enum {
    /**
     * Hidden. Comments for enum values are ignored.
     *
     * @hide
     */
    X = "x",
    Y = "y",
}

/**
 * @visibility hidden
 */
export type Hidden = "hidden";

export type Options = Hidden | "up" | "down";

export interface MyObject {
    /**
     * This property should appear.
     */
    foo: number;

    /**
     * This property should not appear.
     *
     * @visibility some-other
     */
    hidden: number;

    /**
     * This property should appear
     *
     * @visibility status
     */
    visibleToStatus: boolean;

    /**
     * This property should appear
     *
     * @visibility some-other,status
     */
    visibileOnMultiple: number;

    bar: Enum;

    options: Options;
}
