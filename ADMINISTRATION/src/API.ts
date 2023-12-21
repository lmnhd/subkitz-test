/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateSampleInput = {
  id?: string | null,
  name: string,
  s3Path: string,
  description?: string | null,
  genre?: string | null,
  tags?: Array< string | null > | null,
  drum?: string | null,
  hygiene?: string | null,
  length?: string | null,
  pitchRange?: string | null,
  mix?: string | null,
  loudness?: string | null,
  decadeStyle?: string | null,
  sourceGen1?: string | null,
  sourceGen2?: string | null,
  drumMachine?: string | null,
  reversed: boolean,
  invalid: boolean,
  sampleLength: number,
  owner?: string | null,
};

export type ModelSampleConditionInput = {
  name?: ModelStringInput | null,
  s3Path?: ModelStringInput | null,
  description?: ModelStringInput | null,
  genre?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  drum?: ModelStringInput | null,
  hygiene?: ModelStringInput | null,
  length?: ModelStringInput | null,
  pitchRange?: ModelStringInput | null,
  mix?: ModelStringInput | null,
  loudness?: ModelStringInput | null,
  decadeStyle?: ModelStringInput | null,
  sourceGen1?: ModelStringInput | null,
  sourceGen2?: ModelStringInput | null,
  drumMachine?: ModelStringInput | null,
  reversed?: ModelBooleanInput | null,
  invalid?: ModelBooleanInput | null,
  sampleLength?: ModelIntInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelSampleConditionInput | null > | null,
  or?: Array< ModelSampleConditionInput | null > | null,
  not?: ModelSampleConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Sample = {
  __typename: "Sample",
  id: string,
  name: string,
  s3Path: string,
  description?: string | null,
  genre?: string | null,
  tags?: Array< string | null > | null,
  drum?: string | null,
  hygiene?: string | null,
  length?: string | null,
  pitchRange?: string | null,
  mix?: string | null,
  loudness?: string | null,
  decadeStyle?: string | null,
  sourceGen1?: string | null,
  sourceGen2?: string | null,
  drumMachine?: string | null,
  reversed: boolean,
  invalid: boolean,
  sampleLength: number,
  owner?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateSampleInput = {
  id: string,
  name?: string | null,
  s3Path?: string | null,
  description?: string | null,
  genre?: string | null,
  tags?: Array< string | null > | null,
  drum?: string | null,
  hygiene?: string | null,
  length?: string | null,
  pitchRange?: string | null,
  mix?: string | null,
  loudness?: string | null,
  decadeStyle?: string | null,
  sourceGen1?: string | null,
  sourceGen2?: string | null,
  drumMachine?: string | null,
  reversed?: boolean | null,
  invalid?: boolean | null,
  sampleLength?: number | null,
  owner?: string | null,
};

export type DeleteSampleInput = {
  id: string,
};

export type ModelSampleFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  s3Path?: ModelStringInput | null,
  description?: ModelStringInput | null,
  genre?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  drum?: ModelStringInput | null,
  hygiene?: ModelStringInput | null,
  length?: ModelStringInput | null,
  pitchRange?: ModelStringInput | null,
  mix?: ModelStringInput | null,
  loudness?: ModelStringInput | null,
  decadeStyle?: ModelStringInput | null,
  sourceGen1?: ModelStringInput | null,
  sourceGen2?: ModelStringInput | null,
  drumMachine?: ModelStringInput | null,
  reversed?: ModelBooleanInput | null,
  invalid?: ModelBooleanInput | null,
  sampleLength?: ModelIntInput | null,
  owner?: ModelStringInput | null,
  and?: Array< ModelSampleFilterInput | null > | null,
  or?: Array< ModelSampleFilterInput | null > | null,
  not?: ModelSampleFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSampleConnection = {
  __typename: "ModelSampleConnection",
  items:  Array<Sample | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionSampleFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  s3Path?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  genre?: ModelSubscriptionStringInput | null,
  tags?: ModelSubscriptionStringInput | null,
  drum?: ModelSubscriptionStringInput | null,
  hygiene?: ModelSubscriptionStringInput | null,
  length?: ModelSubscriptionStringInput | null,
  pitchRange?: ModelSubscriptionStringInput | null,
  mix?: ModelSubscriptionStringInput | null,
  loudness?: ModelSubscriptionStringInput | null,
  decadeStyle?: ModelSubscriptionStringInput | null,
  sourceGen1?: ModelSubscriptionStringInput | null,
  sourceGen2?: ModelSubscriptionStringInput | null,
  drumMachine?: ModelSubscriptionStringInput | null,
  reversed?: ModelSubscriptionBooleanInput | null,
  invalid?: ModelSubscriptionBooleanInput | null,
  sampleLength?: ModelSubscriptionIntInput | null,
  owner?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionSampleFilterInput | null > | null,
  or?: Array< ModelSubscriptionSampleFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type CreateSampleMutationVariables = {
  input: CreateSampleInput,
  condition?: ModelSampleConditionInput | null,
};

export type CreateSampleMutation = {
  createSample?:  {
    __typename: "Sample",
    id: string,
    name: string,
    s3Path: string,
    description?: string | null,
    genre?: string | null,
    tags?: Array< string | null > | null,
    drum?: string | null,
    hygiene?: string | null,
    length?: string | null,
    pitchRange?: string | null,
    mix?: string | null,
    loudness?: string | null,
    decadeStyle?: string | null,
    sourceGen1?: string | null,
    sourceGen2?: string | null,
    drumMachine?: string | null,
    reversed: boolean,
    invalid: boolean,
    sampleLength: number,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateSampleMutationVariables = {
  input: UpdateSampleInput,
  condition?: ModelSampleConditionInput | null,
};

export type UpdateSampleMutation = {
  updateSample?:  {
    __typename: "Sample",
    id: string,
    name: string,
    s3Path: string,
    description?: string | null,
    genre?: string | null,
    tags?: Array< string | null > | null,
    drum?: string | null,
    hygiene?: string | null,
    length?: string | null,
    pitchRange?: string | null,
    mix?: string | null,
    loudness?: string | null,
    decadeStyle?: string | null,
    sourceGen1?: string | null,
    sourceGen2?: string | null,
    drumMachine?: string | null,
    reversed: boolean,
    invalid: boolean,
    sampleLength: number,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteSampleMutationVariables = {
  input: DeleteSampleInput,
  condition?: ModelSampleConditionInput | null,
};

export type DeleteSampleMutation = {
  deleteSample?:  {
    __typename: "Sample",
    id: string,
    name: string,
    s3Path: string,
    description?: string | null,
    genre?: string | null,
    tags?: Array< string | null > | null,
    drum?: string | null,
    hygiene?: string | null,
    length?: string | null,
    pitchRange?: string | null,
    mix?: string | null,
    loudness?: string | null,
    decadeStyle?: string | null,
    sourceGen1?: string | null,
    sourceGen2?: string | null,
    drumMachine?: string | null,
    reversed: boolean,
    invalid: boolean,
    sampleLength: number,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetSampleQueryVariables = {
  id: string,
};

export type GetSampleQuery = {
  getSample?:  {
    __typename: "Sample",
    id: string,
    name: string,
    s3Path: string,
    description?: string | null,
    genre?: string | null,
    tags?: Array< string | null > | null,
    drum?: string | null,
    hygiene?: string | null,
    length?: string | null,
    pitchRange?: string | null,
    mix?: string | null,
    loudness?: string | null,
    decadeStyle?: string | null,
    sourceGen1?: string | null,
    sourceGen2?: string | null,
    drumMachine?: string | null,
    reversed: boolean,
    invalid: boolean,
    sampleLength: number,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSamplesQueryVariables = {
  filter?: ModelSampleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSamplesQuery = {
  listSamples?:  {
    __typename: "ModelSampleConnection",
    items:  Array< {
      __typename: "Sample",
      id: string,
      name: string,
      s3Path: string,
      description?: string | null,
      genre?: string | null,
      tags?: Array< string | null > | null,
      drum?: string | null,
      hygiene?: string | null,
      length?: string | null,
      pitchRange?: string | null,
      mix?: string | null,
      loudness?: string | null,
      decadeStyle?: string | null,
      sourceGen1?: string | null,
      sourceGen2?: string | null,
      drumMachine?: string | null,
      reversed: boolean,
      invalid: boolean,
      sampleLength: number,
      owner?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateSampleSubscriptionVariables = {
  filter?: ModelSubscriptionSampleFilterInput | null,
};

export type OnCreateSampleSubscription = {
  onCreateSample?:  {
    __typename: "Sample",
    id: string,
    name: string,
    s3Path: string,
    description?: string | null,
    genre?: string | null,
    tags?: Array< string | null > | null,
    drum?: string | null,
    hygiene?: string | null,
    length?: string | null,
    pitchRange?: string | null,
    mix?: string | null,
    loudness?: string | null,
    decadeStyle?: string | null,
    sourceGen1?: string | null,
    sourceGen2?: string | null,
    drumMachine?: string | null,
    reversed: boolean,
    invalid: boolean,
    sampleLength: number,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSampleSubscriptionVariables = {
  filter?: ModelSubscriptionSampleFilterInput | null,
};

export type OnUpdateSampleSubscription = {
  onUpdateSample?:  {
    __typename: "Sample",
    id: string,
    name: string,
    s3Path: string,
    description?: string | null,
    genre?: string | null,
    tags?: Array< string | null > | null,
    drum?: string | null,
    hygiene?: string | null,
    length?: string | null,
    pitchRange?: string | null,
    mix?: string | null,
    loudness?: string | null,
    decadeStyle?: string | null,
    sourceGen1?: string | null,
    sourceGen2?: string | null,
    drumMachine?: string | null,
    reversed: boolean,
    invalid: boolean,
    sampleLength: number,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSampleSubscriptionVariables = {
  filter?: ModelSubscriptionSampleFilterInput | null,
};

export type OnDeleteSampleSubscription = {
  onDeleteSample?:  {
    __typename: "Sample",
    id: string,
    name: string,
    s3Path: string,
    description?: string | null,
    genre?: string | null,
    tags?: Array< string | null > | null,
    drum?: string | null,
    hygiene?: string | null,
    length?: string | null,
    pitchRange?: string | null,
    mix?: string | null,
    loudness?: string | null,
    decadeStyle?: string | null,
    sourceGen1?: string | null,
    sourceGen2?: string | null,
    drumMachine?: string | null,
    reversed: boolean,
    invalid: boolean,
    sampleLength: number,
    owner?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
