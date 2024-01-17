"use client";
import React, { use, useEffect, useState } from "react";
import DrumSelect from "../drumselect";
import { Sample } from "@/API";
import * as Tone from "tone";
import { SampleType } from "../../../ADMINISTRATION/src/interfaces";
import { getS3URL } from "@/lib/s3";
import { getDrumColor } from "@/lib/utils";
import { VerticalRangeSlider } from "vertical-slider";
import { Button } from "../ui/button";
import { SampleID, SequenceGroup, Step } from "./sequencertypes";
import { clear } from "console";

export type SampleLoaderProps = {
  index: number;
  sampleBank: Sample[];
  player: Tone.Player | undefined | null;
  _setVolume: any;
  sampleIDs: SampleID[];

  setSampleID: any;
  _drumType: string;
  _setDrumType: any;
  numRows: number;
  sampleIdsToLoadOnCreate?: string[];
  sequences: SequenceGroup[];
  currentSequence: number;
  numSteps: number;
  pattern: number;
  players: Tone.Player[];
  isPlaying: boolean;
};
export default function SampleLoader({
  index,
  sampleBank,
  player,
  _drumType,
  _setDrumType,
  _setVolume,
  sampleIDs,

  setSampleID,
  sampleIdsToLoadOnCreate,
  sequences,
  currentSequence,
  numSteps,
  numRows,
  pattern,
  players,
  isPlaying,
}: SampleLoaderProps) {
  const [drumIndex, setDrumIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(100);

  const [drumType, setDrumType] = useState<string>(_drumType);
  const [sample, setSample] = useState<Sample | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [drumReady, setDrumReady] = useState<boolean>(false);
  const [numTimeOuts, setNumTimeOuts] = useState<number>(5);
  const [tryLoadingCount, setTryLoadingCount] = useState<number>(0);
  const [localSampleID, setLocalSampleID] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [drumColor, setDrumColor] = useState<string>(getDrumColor(drumType));

  let index1 = 0;
  let step = 0;

  //sequencePattern()

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

    setSampleID(sample.id, index);

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
  //let wait: any;
  const handleGenerateRandomSample = async () => {
    //setLoading(true)
    let wait1;
    try {
      if (tryLoadingCount > numTimeOuts) {
        return;
      }
      console.log("handleGenerateRandomSample");
      const samples = sampleBank.filter((sample) => {
        return sample.drum === drumType;
      });
      const sample = samples[Math.floor(Math.random() * samples.length)];

      wait1 = setTimeout(() => {
        console.log(`Timed out - trying again...`);
        setTryLoadingCount(tryLoadingCount + 1);
        handleGenerateRandomSample();
      }, 10000);
      const result = await loadSample(sample.id);
      if (result) {
        clearTimeout(wait1);
        setTryLoadingCount(0);
        console.log(`Done generating sample row  ${index}`);
        setLoading(false);
      }
    } catch (error) {
      clearTimeout(wait1);
      setLoading(false);
      console.log("ERROR GENERATING SAMPLE", error);
    }
  };

  const loadSample = async (id: string, foundSample?: Sample) => {
    console.log("loadSample", id);
    setLoading(true);
    let sample;
    try {
      if (foundSample) {
        console.log("foundSample", foundSample);
        setSample(foundSample);
        sample = foundSample;
      } else {
        sample = sampleBank.find((sample) => {
          return sample.id === id;
        });
      }

      if (!sample) {
        setLoading(false);
        return;
      }
      console.log("sample", sample);
      if (player?.loaded) {
        await player?.stop();
      }
      const url = await getS3URL(sample?.s3Path as string);
      console.log("url", url);
      player = await player?.load(url!);
      if (player) {
        player.connect(Tone.Destination);
        setLoaded(true);
        setSample(sample);

        setSampleID(sample.id, index);
        setLocalSampleID(sample.id);
        setDrumColor(getDrumColor(sample.drum as string));

        console.log("done loading sample");
        console.log("SampleID for sampleloader...", sampleIDs[index]);
        setLoading(false);
        return true;
      } else {
        console.log("player not loaded");
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.log("error loading sample...", error);
    }
    setLoading(false);
  };

  async function sequencePattern() {
    index1 = 0;

    Tone.Transport.scheduleRepeat(repeat, `${numSteps}n`);
    Tone.Transport.start();
  }

  function repeat(time: any) {
    // console.log("Playing Sequence ", currentSequence)
    //console.log("keypads length", keypads )
    //console.log("Sample Loader Counter Step - ", currentStep);

    step = index1 % numSteps;

    setCurrentStep(step);

    for (let row = 0; row < sequences[pattern].length; row++) {
      //let note = notes[row];

      let samplePlayer: Tone.Player = players[row];
      if (!samplePlayer) {
        return;
      }
      let pad: Step = sequences[pattern][row][step];

      if (pad.selected) {
        // setCurrentStep(step);
        pad.isPlaying = true;
        //console.log("roll => ", pad.roll);
        //console.log(keypads[row][step]);
      }
      if (pad.isPlaying) {
        pad.isPlaying = false;
        //setCurrentStep(currentStep + 1);
      }
    }

    index1++;
  }

  useEffect(() => {
    let counter = 0;
    const loadStartUpDrum = async (sample: Sample) => {
      setDrumType(sample.drum as string);
      console.log("firstID", sample.id);
      const result = await loadSample(sample.id);

      if (result) {
        setSampleID(sample.id, index);
        setLocalSampleID(sample.id);

        _setDrumType(sample.drum, index);

        setDrumReady(true);
        return true;
      }
      return false;
    };
    const loadOnCreate = async () => {
      let wait2: any;
      try {
        if (!sampleIdsToLoadOnCreate) {
          return;
        }

        // console.log
        //   `Starting round ${counter} loading sample ${sampleIdsToLoadOnCreate[counter]}`
        // );

        const sampleIdToLoadOnCreate = sampleIdsToLoadOnCreate[counter++];

        const sample: Sample = sampleBank.find((sample) => {
          return sample.id === sampleIdToLoadOnCreate;
        }) as Sample;

        if (!sample) {
          if (counter < sampleIdsToLoadOnCreate.length) {
            console.log(
              `WHOOPS no sample found in db for ${sampleIdToLoadOnCreate}`
            );
            loadOnCreate();
          }
        }
        let wait2 = setTimeout(() => {
          if (counter < sampleIdsToLoadOnCreate.length) {
            console.log(`Timed out - trying again...`);
            loadOnCreate();
          } else {
            clearTimeout(wait2);
            console.log(`problem loading ${counter} samples`);
          }
        }, 10000);
        const result = await loadStartUpDrum(sample!);
        if (result) {
          clearTimeout(wait2);
        }
        console.log(`All Done loading sample row ${counter}`);
      } catch (error) {
        clearTimeout(wait2);
        console.log("ERROR LOADING SAMPLES", error);
      }
    };
    loadOnCreate();
  }, []);

  useEffect(() => {
    sequencePattern();
  }, [isPlaying]);
  const renderIndexOptions = () => {
    return sampleBank
      .filter((sample) => {
        return sample.drum == drumType;
      })
      .map((sample, index) => {
        return (
          <option
            value={sample.id}
            selected={sample.id == localSampleID}
            className="text-black bg-slate-700"
            key={`${drumType}-${index}`}
          >
            {drumType}-{index + 1}
          </option>
        );
      });
  };
  return (
    <div
      key={`loader-wrapper-${index}`}
      className={`p-1 rounded-xl transition-all duration-75 ease-out ${
        sequences[currentSequence][index][currentStep].selected
          ? "bg-lime-500"
          : drumColor
      } `}
    >
      <div
        className={`flex h-fit w-60 py-1  flex-wrap border-[1px] border-indigo-900 rounded-xl bg-gradient-to-br from-gray-900/90 via-slate-900/80 to-gray-950/90 items-center justify-center transition-all ease-in-out duration-300 ${
          loading &&
          " blur-md opacity-30 shadow-xl shadow-lime-300/30 animate-ping"
        }`}
      >
        <div className="flex flex-col text-left">
          <label htmlFor="mixer">level</label>
          <input
            type="range"
            min="75"
            max="110"
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
          <label>sample-row-{index + 1}</label>
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
          {true && (
            <Button
              className="bg-violet-900/30 my-3 h-4 border-[1px] rounded-2xl border-violet-900 text-white-600"
              onClick={handleGenerateRandomSample}
              disabled={loading}
            >
              generate
            </Button>
          )}
        </div>
      </div>
      {isPlaying && (
        <div className="flex flex-row items-center justify-center">
          {isPlaying}
        </div>
      )}
    </div>
  );
}
