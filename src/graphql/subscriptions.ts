/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateSample = /* GraphQL */ `subscription OnCreateSample($filter: ModelSubscriptionSampleFilterInput) {
  onCreateSample(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSampleSubscriptionVariables,
  APITypes.OnCreateSampleSubscription
>;
export const onUpdateSample = /* GraphQL */ `subscription OnUpdateSample($filter: ModelSubscriptionSampleFilterInput) {
  onUpdateSample(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSampleSubscriptionVariables,
  APITypes.OnUpdateSampleSubscription
>;
export const onDeleteSample = /* GraphQL */ `subscription OnDeleteSample($filter: ModelSubscriptionSampleFilterInput) {
  onDeleteSample(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSampleSubscriptionVariables,
  APITypes.OnDeleteSampleSubscription
>;
