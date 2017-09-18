# ts-json-schema-generator

This repo is a fork of [vega/ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator).
This document lists the reasons we are maintaining a fork.

## Goal

`ts-json-schema-generator` is being used to generate schemas for tufan.io components,
which are likely to be numerous and the automation helps tame the insanity.

## Purpose

The purpose of the fork to discover and stabilize the modifications needed to achieve this goal.
Once achieved, upstream negotiations to accept pull requests can begin.

## Modifications/Enhancements

1. Arbitrary jsDoc tags
2. File-names in schema types
3. Selective field hiding

### 1. Arbitrary jsDoc tags

Adapted `ExtendedAnnotationsReader` to add all jsDoc tags attached to a type specification.
This allows much flexibility in carrying validation/operational criteria into the schema.

### 2. File-names in schema types

The upstream implementation stripped filenames from the typeName. When a type definition
had layered implementations with the same TypeName, discriminated by thier filename, this
clobbering creates ambiguity. Worse, the schema generator resulted in output that only
reliably kept the last Type of the same name found. We now use file-names in the typeName
embedded in the schema, preventing ambiguity and ensuring correct behavior.

### 3. Selective field hiding

This requires a little background.

#### Background

Tufan components operate on external APIs - currently, only the aws-sdk,
but really any sdk will work. They marshal data between the user of a
component and the SDK. Importantly, the components also maintain a local cache.

The local cache is also the "system-of-record" for tufan tooling, making
data-integrity very important. json-schema is an excellent way of
specifying constraints on both the shape and value of the data.

The figures below illustrate the point.

```bash
  +------+                  +----------------+
  | user +------------------> SDK/API input  +----------------+
  +---^--+                  |  * create      |                |
      |                     |  * update      |           +----v----+
      |                     |  * delete      |           | SDK/API |
      |                     +----------------+           +---------+
      |                                                       |
      |                     +----------------+                |
      |                     | SDK/API output |                |
      +---------------------+  * read        <----------------+
                            +----------------+
```

```bash
  +------+                  +----------------+
  | user +------------------> input-schema   +----------------+
  +---^--+                  +----------------+                |
      |                                                  +----v----+
      |                                                  | SDK/API |
      |                                                  +---------+
      |                     +----------------+                |
      |                     | input-schema   |                |
      +---------------------+      +         <----------------+
                            | output-schema  |
                            +----------------+
```

These data structures are complex beasts and in many cases not owned or
controlled by tufan, modifications outside the tool chain is possible.
While our goal is correctness with an eye on security of the underlying
system, we also want to provide a good developer-experience. To that end,
we want to minimize the necessary annotations for maximal impact.

#### Implementation

By default, all fields in the type being exported are part of the schema.
It is possible to selectively hide specific fields. While the case above
only refers to two schemas being necessary - it is conceivable that there
could be other cases for which multiple schemas are needed.

ts-json-schema-generator supports the @hide tag. We add a @visibility tag like so:

```typescript

export interface DataShape {
  /**
   * @visibility filter1
   */
  field1: any;

  /**
   * @visibility filter1,filter2
   */
  field12: any;
}
```

On the command line

```bash
$ ./ts-json-schema-generator
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "additionalProperties": false,
  "definitions": {
  },
  "type": "object"
}
```

```bash
$ ./ts-json-schema-generator --visibility filter1
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "additionalProperties": false,
  "definitions": {
  },
  "properties": {
    "field1": {
      "visibility": "filter1"
    },
    "field12": {
      "visibility": "filter1,filter2"
    }
  },
  "required": [
    "field1",
    "field12"
  ],
  "type": "object"
}
```

```bash
$ ./ts-json-schema-generator --visibility filter2
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "additionalProperties": false,
  "definitions": {
  },
  "properties": {
    "field12": {
      "visibility": "filter1,filter2"
    }
  },
  "required": [
    "field12"
  ],
  "type": "object"
}
```
