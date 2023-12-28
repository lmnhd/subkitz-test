"use client";
import React, { use, useEffect, useState } from "react";
import DrumSelect from "../drumselect";
import { Sample } from "@/API";
import * as Tone from "tone";
import { SampleType } from "../../../ADMINISTRATION/src/interfaces";
import { getS3URL } from "@/lib/s3";
import { getDrumColor } from "@/lib/utils";
import { VerticalRangeSlider } from "vertical-slider";

export type SampleLoaderProps = {
  index: number;
  sampleBank: Sample[];
  player: Tone.Player | null;
  _setVolume: any;

  _drumType: string;
  _setDrumType: any;
};
export default function SampleLoader({
  index,
  sampleBank,
  player,
  _drumType,
  _setDrumType,
  _setVolume,
}: SampleLoaderProps) {
  const [drumIndex, setDrumIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(100);
  const [sampleID, setSampleID] = useState<string>("");
  const [drumType, setDrumType] = useState<string>(_drumType);
  const [sample, setSample] = useState<Sample | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [drumReady, setDrumReady] = useState<boolean>(false);

  useEffect(() => {
    const loadSampleBank = async () => {
      const sample = sampleBank[0];
      if (!sample) {
        return;
      }
      //loadSample(sample.id);
    };
    loadSampleBank();
  });

  const renderIndexOptions = () => {
    return sampleBank
      .filter((sample) => {
        return sample.drum == drumType;
      })
      .map((sample, index) => {
        return (
          <option
            value={sample.id}
            className="text-black bg-slate-700"
            key={`${drumType}-${index}`}
          >
            {drumType}-{index + 1}
          </option>
        );
      });
  };
  const drumSelected = async (drum: string) => {
    //setDrumType("none")

    if (sampleBank.length === 0) {
      console.log("no sample bank");
      return;
    }
    //Mail fail first time if context is not loaded
    const sample = sampleBank.filter((sample) => {
      return sample.drum === drum;
    })[0];

    if (!sample) {
      console.log("no sample found");
      return;
    }
    setDrumType(drum);
    console.log("firstID", sample.id);
    await loadSample(sample.id);

    setSampleID(sample.id);

    _setDrumType(drum, index);

    setDrumReady(true);
  };
  const handleVolumeChanged = (value: number) => {
    console.log("handleVolumeChanged", value);
    console.log("volume", volume);

    //console.log("newVolume", volume);
    setVolume(value);
    _setVolume((100 - volume) * -1, index);
  };

  const indexSelected = async (id: string) => {
    console.log("indexSelected", id);
    //setDrumIndex(e.target.value);
    setSampleID(id);
    await loadSample(id);
  };

  const loadSample = async (id: string) => {
    console.log("loadSample", id);

    const sample = sampleBank.find((sample) => {
      return sample.id === id;
    });
    if (!sample) {
      return;
    }
    console.log("sample", sample);
    if (player?.loaded) {
      await player?.stop();
    }
    const url = await getS3URL(sample?.s3Path as string);
    console.log("url", url);
    await player?.load(url!);

    setLoaded(true);
    setSample(sample);
    console.log("done loading sample");
  };

  return (
    <div className="flex h-28 w-60 py-1  flex-wrap border-[1px] border-indigo-900 rounded-xl bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 items-center justify-center">
      <div className="flex flex-col text-left">
        <label htmlFor="mixer">level</label>
        <input
          type="range"
          min="85"
          max="105"
          //step={1}
          title="volume"
          color="red"
          value={volume}
          //defaultValue={volume}
          onChange={(e) => {
            handleVolumeChanged(Number(e.target.value));
          }}
          className="-rotate-90 w-20 h-6 text-red-900 ml-2 mt-2 mb-1 -m-1"
        />
        <p className="text-md ">{(100 - volume) * -1}</p>
      </div>

      <div key={index} className="flex flex-col">
        <label>sequence-row-{index + 1}</label>
        <DrumSelect
          updateValue={drumSelected}
          defaultDrum={drumType}
          color={`${
            loaded ? getDrumColor(drumType) : "bg-red-600"
          } border-[1px] border-lime-600`}
          textColor="white"
        />
        {drumReady && (
          <select
            name="drumIndex"
            id="drumIndex"
            title="drumIndex"
            onChange={(e) => {
              indexSelected(e.target.value);
            }}
            className="text-pink-300 bg-gray-900 rounded-md text-sm text-center w-18 mt-2"
          >
            {renderIndexOptions()}
          </select>
        )}
      </div>
    </div>
  );
}
