"use client";

import React from "react";
import * as SampleTypes from "../../../ADMINISTRATION/src/interfaces";
import { Sample } from "@/API";

const SamplePropFieldSelect = ({
  fieldName,
  propName,
  fieldOBJ,
  updateFunc,
  value,
}: {
  fieldName: string;
  propName: string;
  fieldOBJ: object;
  updateFunc: any;
  value: any;
}) => {
  return (
    <div className="">
      <div className="flex gap-6">
        <label htmlFor="" className="w-24">
          {fieldName}
        </label>
        <select
          name={fieldName}
          id={fieldName}
          title={fieldName}
          //value={value}
          //defaultValue={value}
          className="text-black w-24"
          onChange={(e) => {
            updateFunc(e.target.value, propName);
          }}
        >
          {Object.keys(fieldOBJ).map((key) => {
            return <option key={key}>{key}</option>;
          })}
        </select>
      </div>
    </div>
  );
};
export default function SampleProperties({
  sample,
  updateValue,
  currentValue
}: {
  sample: Sample;
  updateValue: any;
    currentValue?: any;
}) {
  console.log("sample drum = ", sample?.drum!);
  const propertyTypes = [
    { name: "decade", prop: SampleTypes.DecadeStyle, key: "decadeStyle" },
    { name: "drum", prop: SampleTypes.Drum, key: "drum" },

    { name: "Genre", prop: SampleTypes.Genre, key: "genre" },
    { name: "Hygiene", prop: SampleTypes.Hygiene, key: "hygiene" },
    { name: "Length", prop: SampleTypes.Length, key: "length" },
    { name: "Loudness", prop: SampleTypes.Loudness, key: "loudness" },
    { name: "Mix", prop: SampleTypes.Mix, key: "mix" },
    { name: "Pitch Range", prop: SampleTypes.PitchRange, key: "pitchRange" },
    { name: "Source Gen 1", prop: SampleTypes.SourceGen1, key: "sourceGen1" },
    { name: "Source Gen 2", prop: SampleTypes.SourceGen2, key: "sourceGen2" },
  ];
  return (
    <div>
      <h1 className="font-extralight text-lime-400">edit sample properties</h1>
      <div className="flex flex-row flex-wrap gap-2 justify-center items-center w-full">
        {propertyTypes.map(({ name, prop, key }) => {
          return (
            <SamplePropFieldSelect
            key={key}
              fieldName={name}
              propName={key}
              fieldOBJ={prop}
              updateFunc={updateValue}
              value={currentValue}
            />
          );
        })}
      </div>
    </div>
  );
}
