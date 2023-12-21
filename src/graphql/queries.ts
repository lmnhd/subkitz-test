/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getSample = /* GraphQL */ `query GetSample($id: ID!) {
  getSample(id: $id) {
    id
    name
    s3Path
    description
    genre
    tags
    drum
    hygiene
    length
    pitchRange
    mix
    loudness
    decadeStyle
    sourceGen1
    sourceGen2
    drumMachine
    reversed
    invalid
    sampleLength
    owner
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetSampleQueryVariables, APITypes.GetSampleQuery>;
export const listSamples = /* GraphQL */ `query ListSamples(
  $filter: ModelSampleFilterInput
  $limit: Int
  $nextToken: String
) {
  listSamples(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      s3Path
      description
      genre
      tags
      drum
      hygiene
      length
      pitchRange
      mix
      loudness
      decadeStyle
      sourceGen1
      sourceGen2
      drumMachine
      reversed
      invalid
      sampleLength
      owner
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSamplesQueryVariables,
  APITypes.ListSamplesQuery
>;
