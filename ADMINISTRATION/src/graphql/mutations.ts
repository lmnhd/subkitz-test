/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createSample = /* GraphQL */ `mutation CreateSample(
  $input: CreateSampleInput!
  $condition: ModelSampleConditionInput
) {
  createSample(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateSampleMutationVariables,
  APITypes.CreateSampleMutation
>;
export const updateSample = /* GraphQL */ `mutation UpdateSample(
  $input: UpdateSampleInput!
  $condition: ModelSampleConditionInput
) {
  updateSample(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateSampleMutationVariables,
  APITypes.UpdateSampleMutation
>;
export const deleteSample = /* GraphQL */ `mutation DeleteSample(
  $input: DeleteSampleInput!
  $condition: ModelSampleConditionInput
) {
  deleteSample(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteSampleMutationVariables,
  APITypes.DeleteSampleMutation
>;
