"use strict";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSample = exports.updateSample = exports.createSample = void 0;
exports.createSample = "mutation CreateSample(\n  $input: CreateSampleInput!\n  $condition: ModelSampleConditionInput\n) {\n  createSample(input: $input, condition: $condition) {\n    id\n    name\n    s3Path\n    description\n    genre\n    tags\n    drum\n    hygiene\n    length\n    pitchRange\n    mix\n    loudness\n    decadeStyle\n    sourceGen1\n    sourceGen2\n    reversed\n    owner\n    createdAt\n    updatedAt\n    __typename\n  }\n}\n";
exports.updateSample = "mutation UpdateSample(\n  $input: UpdateSampleInput!\n  $condition: ModelSampleConditionInput\n) {\n  updateSample(input: $input, condition: $condition) {\n    id\n    name\n    s3Path\n    description\n    genre\n    tags\n    drum\n    hygiene\n    length\n    pitchRange\n    mix\n    loudness\n    decadeStyle\n    sourceGen1\n    sourceGen2\n    reversed\n    owner\n    createdAt\n    updatedAt\n    __typename\n  }\n}\n";
exports.deleteSample = "mutation DeleteSample(\n  $input: DeleteSampleInput!\n  $condition: ModelSampleConditionInput\n) {\n  deleteSample(input: $input, condition: $condition) {\n    id\n    name\n    s3Path\n    description\n    genre\n    tags\n    drum\n    hygiene\n    length\n    pitchRange\n    mix\n    loudness\n    decadeStyle\n    sourceGen1\n    sourceGen2\n    reversed\n    owner\n    createdAt\n    updatedAt\n    __typename\n  }\n}\n";
