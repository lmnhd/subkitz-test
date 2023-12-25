"use client";
import React, { useContext, useEffect, useState } from "react";
import * as Tone from "tone";
import { Howl, Howler } from "howler";
import { Sample } from "@/API";
import * as SampleTypes from "../../../../ADMINISTRATION/src/interfaces";
import SampleProperties from "@/components/sampleitem/sampleproperties";

import DrumSelect from "@/components/drumselect";
import { cn } from "@/lib/utils";
import LedStrip from "@/components/sequencer/ledstrip";
import { KitzContext, KitzProvider } from "@/lib/kitzcontext";
import { getS3URL } from "@/lib/s3";

type KeyPadType = {
  rowNum: number;
  stepNum: number;
  selected: boolean;
  onPadClicked: any;
};

const KeyPad = ({ rowNum, stepNum, selected, onPadClicked }: KeyPadType) => {
  const [isActive, setIsActive] = useState(false);

  const updateThisPad = () => {
    setIsActive(!isActive);
    onPadClicked(rowNum, stepNum);
    selected = !selected;
  };
  return (
    <div
      className={cn(
        `flex items-center justify-center w-6 h-6 md:w-12 md:h-12 md:p-2 mx-1 text-white border-2 border-black cursor-pointer`,
        isActive && `bg-red-900`
      )}
      onClick={updateThisPad}
    >
      <span>{stepNum + 1}</span>
    </div>
  );
};

export default function KitLab() {
  let index1 = 0;
  let step = 0;
  const numRows = 4;
  const numSteps = 16;
  const { soundList, setSoundList } = useContext(KitzContext);
  const [keypads, setKeypads] = useState<any[]>([]);
 
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  //let isPlaying = false;
  useEffect(() => {
    const renderSteps = async () => {
      const rows = Array(numRows).fill(0);
      const steps = Array(numSteps).fill(0);
      const keypads = rows.map((row, rowNum) => {
        return steps.map((step, stepNum) => {
          return {
            rowNum,
            stepNum,
            selected: false,
          };
        });
      });

      setKeypads(keypads);
      
    };
    renderSteps();
  }, []);
  const [index, setIndex] = useState(0);
 
  const [samples, setSamples] = useState<Tone.Player[]>([]);
  const [notes, setNotes] = useState(["C2", "E3", "G3", "B3"]);

  const updatePad = (rowNum: number, stepNum: number) => {
    console.log(rowNum, stepNum);
    //console.log(keypads);
    const pad = keypads[rowNum][stepNum];
    pad.selected = !pad.selected;
    const row = keypads[rowNum];
    row[stepNum] = pad;
    keypads[rowNum] = row;
    setKeypads(keypads);
    console.log(pad);
  };
  async function sequencePattern() {
    index1 = 0;
    
    Tone.Transport.scheduleRepeat(repeat, `${numSteps}n`);
    Tone.Transport.start();
  }
const setUpSamples = async () => {
    console.log("check ----", soundList.items.filter((item: SampleTypes.Sample) => {
       return item.drum === SampleTypes.Drum.kick;
      })
      )
      const sampleURLS = [
        await getS3URL(
          soundList.items.filter((item: SampleTypes.Sample) => {
           return item.drum === SampleTypes.Drum.kick;
          })[0].s3Path
        ),
        await getS3URL(
          soundList.items.filter((item: SampleTypes.Sample) => {
            return item.drum === SampleTypes.Drum.snare;
          })[0].s3Path
        ),
        await getS3URL(
          soundList.items.filter((item: SampleTypes.Sample) => {
            return item.drum === SampleTypes.Drum.chat;
          })[0].s3Path
        ),
        await getS3URL(
          soundList.items.filter((item: SampleTypes.Sample) => {
            return item.drum === SampleTypes.Drum.clap;
          })[0].s3Path
        ),
      ];

      const samples = [];
      for (let i = 0; i < sampleURLS.length; i++) {
        samples.push(new Tone.Player(sampleURLS[i] as string).toDestination());
      }
      setSamples(samples);
}
  function repeat(time: any) {
    step = index1 % numSteps;
    for (let i = 0; i < keypads.length; i++) {
      let note = notes[i];

      let synth: Tone.Player = samples[i];
      let pad = keypads[i][step];
      console.log(
        `row ${i} step ${step} index ${index1} selected ${pad.selected} time ${time}`
      );
      // console.log(pad);
      // console.log(time);
      // console.log(index);
      if (pad.selected) {
        console.log(keypads[i][step]);
        synth.start(time);
      }
    }
    index1++;
  }

  async function play() {
   if(samples.length === 0) {return}
    console.log(Tone.Transport.state);
    if (Tone.Transport.state === "stopped") {
      Tone.context.resume();
    } else {
      //Tone.start();
    }

    if (Tone.Transport.state === "stopped") {
      await sequencePattern();
      setIsPlaying(true);
    } else {
      await Tone.Transport.stop();
      await Tone.Transport.cancel();
      
      setIsPlaying(false);
    }
  }

  async function sequence() {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    const notes = ["C4", "E4", "G4", "A4"];
    const synthPart = new Tone.Sequence(
      function (time, note) {
        synth.triggerAttackRelease(note, "10hz", time);
      },
      notes,
      "4n"
    ).start(now);
    await Tone.Transport.start();
  }
  return (
    <main className="flex flex-col items-center justify-between min-h-screen py-12 md:p-24 text-white">
      <h1>beat box</h1>
      <div className="w-fit ">
         <LedStrip start={isPlaying} numSteps={numSteps} />
        <div className="flex  flex-col p-3 bg-red-400">
          {keypads.map((row, rowNum) => {
            return (
              <div key={`row-${rowNum}`} className="flex flex-wrap md:flex-nowrap items-center justify-center mx-auto md:flex-row m-1">
                {row.map((keypad: any, stepNum: any) => {
                  return <KeyPad key={`step-${stepNum}`} {...keypad} onPadClicked={updatePad} />;
                })}
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={setUpSamples}>Set up</button>
      <button onClick={play}>Play</button>
    </main>
  );
}
