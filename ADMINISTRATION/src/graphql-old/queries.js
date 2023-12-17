"use strict";
/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSamples = exports.getSample = void 0;
exports.getSample = "query GetSample($id: ID!) {\n  getSample(id: $id) {\n    id\n    name\n    s3Path\n    description\n    genre\n    tags\n    drum\n    hygiene\n    length\n    pitchRange\n    mix\n    loudness\n    decadeStyle\n    sourceGen1\n    sourceGen2\n    reversed\n    owner\n    createdAt\n    updatedAt\n    __typename\n  }\n}\n";
exports.listSamples = "query ListSamples(\n  $filter: ModelSampleFilterInput\n  $limit: Int\n  $nextToken: String\n) {\n  listSamples(filter: $filter, limit: $limit, nextToken: $nextToken) {\n    items {\n      id\n      name\n      s3Path\n      description\n      genre\n      tags\n      drum\n      hygiene\n      length\n      pitchRange\n      mix\n      loudness\n      decadeStyle\n      sourceGen1\n      sourceGen2\n      reversed\n      owner\n      createdAt\n      updatedAt\n      __typename\n    }\n    nextToken\n    __typename\n  }\n}\n";
