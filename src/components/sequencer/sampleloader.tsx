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
import { SequenceGroup, Step } from "./sequencertypes";

export type SampleLoaderProps = {
  index: number;
  sampleBank: Sample[];
  player: Tone.Player | undefined | null;
  _setVolume: any;

  _drumType: string;
  _setDrumType: any;
  sampleIdsToLoadOnCreate?: string[];
  sequences: SequenceGroup[];
  currentSequence: number;
  numSteps: number;
  pattern: number;
  players: Tone.Player[];
  isPlaying:boolean;

};
export default function SampleLoader({
  index,
  sampleBank,
  player,
  _drumType,
  _setDrumType,
  _setVolume,
  sampleIdsToLoadOnCreate,
  sequences,
  currentSequence,
  numSteps,
  pattern,
  players,
  isPlaying
}: SampleLoaderProps) {
  const [drumIndex, setDrumIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(100);
  const [sampleID, setSampleID] = useState<string>("");
  const [drumType, setDrumType] = useState<string>(_drumType);
  const [sample, setSample] = useState<Sample | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [drumReady, setDrumReady] = useState<boolean>(false);
  const [numTimeOuts, setNumTimeOuts] = useState<number>(5);
  const [tryLoadingCount, setTryLoadingCount] = useState<number>(0);

  const [currentStep, setCurrentStep] = useState<number>(0);

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
  const handleGenerateRandomSample = async () => {
    try {
      if (tryLoadingCount > numTimeOuts) {
        return;
      }
      console.log("handleGenerateRandomSample");
      const samples = sampleBank.filter((sample) => {
        return sample.drum === drumType;
      });
      const sample = samples[Math.floor(Math.random() * samples.length)];

      const wait = setTimeout(() => {
        console.log(`Timed out - trying again...`);
        setTryLoadingCount(tryLoadingCount + 1);
        handleGenerateRandomSample();
      }, 10000);
      const result = await loadSample(sample.id);
      if (result) {
        clearTimeout(wait);
        setTryLoadingCount(0);
        console.log(`Done generating sample row  ${index}`);
      }
    } catch (error) {
      console.log("ERROR GENERATING SAMPLE", error);
    }
  };

  const loadSample = async (id: string, foundSample?: Sample) => {
    console.log("loadSample", id);
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
  
        setSampleID(sample.id);
        setDrumColor(getDrumColor(sample.drum as string));
  
        console.log("done loading sample");
        return true;
      } else {
        console.log("player not loaded");
        return false;
      }
    } catch (error) {
      console.log("error loading sample...",error)
    }
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
        setSampleID(sample.id);
  
        _setDrumType(sample.drum, index);
  
        setDrumReady(true);
        return true;
      }
      return false;
    };
    const loadOnCreate = async () => {
      try {
        if (!sampleIdsToLoadOnCreate) {
          return;
        }

        // console.log(
        //   `Starting round ${counter} loading sample ${sampleIdsToLoadOnCreate[counter]}`
        // );

        const sampleIdToLoadOnCreate = sampleIdsToLoadOnCreate[counter++];

        const sample = sampleBank.find((sample) => {
          return sample.id === sampleIdToLoadOnCreate;
        });

        if (!sample) {
          if (counter < sampleIdsToLoadOnCreate.length) {
            console.log(
              `WHOOPS no sample found in db for ${sampleIdToLoadOnCreate}`
            );
            loadOnCreate();
          }
        }
        const wait = setTimeout(() => {
          if (counter < sampleIdsToLoadOnCreate.length) {
            console.log(`Timed out - trying again...`);
            loadOnCreate();
          } else {
            clearTimeout(wait);
            console.log(`problem loading ${counter} samples`);
          }
        }, 10000);
        const result = await loadStartUpDrum(sample!);
        if (result) {
          clearTimeout(wait);
        }
        console.log(`All Done loading sample row ${counter}`);
      } catch (error) {
        console.log("ERROR LOADING SAMPLES", error);
      }
    };
    loadOnCreate();
  }, [ sampleBank, sampleIdsToLoadOnCreate]);

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
            selected={sample.id == sampleID}
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
      }`}
    >
      <div className="flex h-fit w-60 py-1  flex-wrap border-[1px] border-indigo-900 rounded-xl bg-gradient-to-br from-gray-900/90 via-slate-900/80 to-gray-950/90 items-center justify-center">
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
          <Button
            className="bg-violet-900/30 my-3 h-4 border-[1px] rounded-2xl border-violet-900 text-white-600"
            onClick={handleGenerateRandomSample}
          >
            generate
          </Button>
        </div>
      </div>
      {isPlaying && <div className="flex flex-row items-center justify-center">{isPlaying}</div>}
    </div>
  );
}
