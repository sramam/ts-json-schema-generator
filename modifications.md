# ts-json-schema-generator

This repo is a fork of (vega/ts-json-schema-generator)[https://github.com/vega/ts-json-schema-generator].
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
The upstream implementation stripped filenames from the typeName. When a type definition had layered
implementations with the same TypeName, discriminated by thier filename, this clobbering created
an ambiguity. Worse, the schema generator resulted in output that only reliably kept the last Type of
the same name found. We now use file-names in the typeName embedded in the schema, preventing ambiguity
and ensuring correct behavior.

### 3. Selective field hiding
Tufan components operate on external APIs - currently, only the aws-sdk, but really any sdk will work.
They marshal data between the user of a component and the SDK. One way to
