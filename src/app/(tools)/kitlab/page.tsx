"use client";
import React, { useContext, useEffect, useState } from "react";
import * as Tone from "tone";
import { Howl, Howler } from "howler";
import { Sample } from "@/API";
import * as SampleTypes from "../../../../ADMINISTRATION/src/interfaces";
import SampleProperties from "@/components/sampleitem/sampleproperties";

import DrumSelect from "@/components/drumselect";
import { cn, getDrumColor } from "@/lib/utils";
import LedStrip from "@/components/sequencer/ledstrip";
import { KitzContext, KitzProvider } from "@/lib/kitzcontext";
import { getS3URL } from "@/lib/s3";
import SampleLoader from "@/components/sequencer/sampleloader";
import { SoundListProps } from "@/app/page";
import { Button } from "@aws-amplify/ui-react";
import TempoControl from "@/components/sequencer/tempocontrol";
import useSmoothHorizontalScroll from 'use-smooth-horizontal-scroll';

type KeyPadType = {
  rowNum: number;
  stepNum: number;
  selected: boolean;
  onPadClicked: any;
  selectedColor: string;
};

const KeyPad = ({ rowNum, stepNum, selected, onPadClicked, selectedColor = "bg-indigo-300" }: KeyPadType) => {
  const [isActive, setIsActive] = useState(false);

  const updateThisPad = () => {
    setIsActive(!isActive);
    onPadClicked(rowNum, stepNum);
    selected = !selected;
  };
  return (
    <div
      className={cn(
        `flex items-center justify-center w-6 h-6 md:w-12 md:h-6 md:p-2 mx-1 text-white border-[1px] border-pink-300 rounded-xl hover:bg-lime-800 cursor-pointer`,
        isActive && selectedColor
      )}
      onClick={updateThisPad}
    >
      <span>{stepNum + 1}</span>
    </div>
  );
};

export default function KitLab() {
  const [numRows, setNumRows] = useState<number>(1);
  const [numSteps, setNumSteps] = useState<number>(16);
  const {
    soundList,
    setSoundList,
  }: { soundList: SoundListProps; setSoundList: any } = useContext(KitzContext);
  const [keypads, setKeypads] = useState<any[]>([]);
  const [players, setPlayers] = useState<Tone.Player[]>([]);
  const [mixerVolumes, setMixerVolumes] = useState<number[]>([]);
  const [drumTypes, setDrumTypes] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);
  const { scrollContainerRef, handleScroll, scrollTo, isAtStart, isAtEnd } = useSmoothHorizontalScroll();
  let index1 = 0;
  let step = 0;
  //let isPlaying = false;
  useEffect(() => {
    Tone.Transport.bpm.value = 120;
    renderSteps();
    soundList.items.forEach((sample) => {
      console.log("sample", sample);
    })
  }, []);
  //const [notes, setNotes] = useState(["C2", "E3", "G3", "B3"]);
  const updateNumRows = async (num: number) => {
    if (num < 1) {
      return;
    } else if (num > 12) {
      return;
    }
    let rowsToAdd = 0;
    let rowsToRemove = 0;
    if (num > numRows) {
      rowsToAdd = num - numRows;
      for (let i = 0; i < rowsToAdd; i++) {
        const steps = Array(numSteps ? numSteps : 16).fill(0);
        const rowNum = numRows + i;
        const newKeypads = keypads;
        newKeypads.push(
          steps.map((step, stepNum) => {
            return {
              rowNum,
              stepNum,
              selected: false,
            };
          })
        );
        setKeypads(newKeypads);

        const newPlayers = players;
        newPlayers.push(new Tone.Player().toDestination());
        setPlayers(newPlayers);

        const newMixerVolumes = mixerVolumes; 
        newMixerVolumes.push(0);
        setMixerVolumes(newMixerVolumes);

        const newDrumTypes = drumTypes;
        newDrumTypes.push("none");
        setDrumTypes(newDrumTypes);
       
      }
    }
    if (num < numRows) {
      rowsToRemove = numRows - num;
      const pads = keypads;
      const tempPlayers = players;
      for (let i = 0; i < rowsToRemove; i++) {
        pads.pop();
        tempPlayers.pop();
      }
      setKeypads(keypads);
    setPlayers(tempPlayers);
    }
    
    setNumRows(num);
  };

  const updateNumSteps = async (num: number) => {
    if (num < 1) {
      return;
    } else if (num > 32) {
      return;
    }
    setNumSteps(num);
    await renderSteps(numRows, num);
  };
  const renderSteps = async (
    _rows: number = numRows,
    _steps: number = numSteps
  ) => {
    const rows = Array(_rows ? _rows : numRows).fill(0);
    const steps = Array(_steps ? _steps : numSteps).fill(0);
    const keypads = rows.map((row, rowNum) => {
      return steps.map((step, stepNum) => {
        return {
          rowNum,
          stepNum,
          selected: false,
        };
      });
    });
    const _players = rows.map((row, rowNum) => {
      return new Tone.Player().toDestination();
    });
    const _volumes = rows.map((row, rowNum) => {
      return 0;
    })
    const _drumTypes = rows.map((row, rowNum) => {
      return "none";
    })

    setKeypads(keypads);
    setPlayers(_players);
    setMixerVolumes(_volumes);
    setDrumTypes(_drumTypes);
    

    console.log("drumTypes", _drumTypes)

  };

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
  const tempoChanged = (bpm: number) => {
    console.log("tempoChanged", bpm);
    Tone.Transport.bpm.value = bpm;
  };

  function repeat(time: any) {
    step = index1 % numSteps;
    for (let row = 0; row < keypads.length; row++) {
      //let note = notes[row];

      let samplePlayer: Tone.Player = players[row];
      if (!samplePlayer) {
        return;
      }
      let pad = keypads[row][step];
      console.log(
        `row ${row} step ${step} index ${index1} selected ${pad.selected} time ${time}`
      );
      // console.log(pad);
      // console.log(time);
      // console.log(index);
      if (pad.selected) {
        console.log(keypads[row][step]);
        if (samplePlayer.loaded) {
          // samplePlayer.volume.value = 0;
          samplePlayer.start(time);
        }
      }
    }
    index1++;
    if(scroll){
      scrollTo(step < Math.floor(numSteps / 1.1) ? step * 5 : -1000)
    }
    
    // if(step === numSteps - 1){
    //   scrollTo(0)
    // }else{
     
    //   scrollTo(step *5)
    // }
   
  }

  async function play() {
    //  if(samples.length === 0) {return}
    //scrollTo(0)
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
const setDrumType = (drum:string, index:number) => {
  console.log("setDrumType", drum, index)
    let _drumTypes = drumTypes;
    _drumTypes[index] = drum;
    setDrumTypes(_drumTypes);
    console.log("drumTypes", _drumTypes)
}
const setVolume = (_volume:number, index:number) => {
    const _volumes = mixerVolumes;
    //const newVolume = (100 - _volume) * -1;
    _volumes[index] = _volume;
    setMixerVolumes(_volumes);
    console.log("player vol = ", players[index].volume.value)
    players[index].volume.value = _volume ;
    // console.log("volumes", _volume )
    // console.log("players", players)
}
  return (
    <main className="flex flex-col items-center justify-between min-h-screen py-4 md:p-24  text-white">
      <h1>KITZ-LAB</h1>
      <div className="flex my-8 flex-wrap items-center justify-between gap-2 text-lime-500 border-[1px] border-indigo-900 rounded-xl bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 p-4">
        <Button
          className="bg-gray-900 text-lime-500 w-24 "
          onClick={() => updateNumRows(numRows + 1)}
        >
          + Row
        </Button>
        <Button
          className="bg-gray-900 text-lime-500 w-24 "
          onClick={() => updateNumRows(numRows - 1)}
        >
          - Row
        </Button>
        <TempoControl
          tempoChanged={tempoChanged}
          startingTempo={Tone.Transport?.bpm?.value}
        />
        <Button
          className="bg-gray-900 text-lime-500 w-24 "
          onClick={() => updateNumSteps(numSteps + 4)}
        >
          + 4 Steps
        </Button>
        <Button
          className="bg-gray-900 text-lime-500 w-24 "
          onClick={() => updateNumSteps(numSteps - 4)}
        >
          - 4 Steps
        </Button>
       
      </div>
      <div className="flex gap-2 items-center justify-center flex-wrap">
        {Array(numRows)
          .fill(0)
          .map((sample, index) => {
            return (
              <SampleLoader
                index={index}
                sampleBank={soundList.items}
                key={`loader-${index}`}
                player={players[index]}
                _drumType={drumTypes[index]}
                _setDrumType={setDrumType}
                _setVolume={setVolume}
              />
            );
          })}
      </div>
      <div className="md:hidden my-3">
        <Button
          className="bg-gray-900 text-lime-500 text-sm w-24 h-6 "
          onClick={() => setScroll(!scroll)}
        >
          {scroll ? 'Stop-scroll' : 'Scroll'}
        </Button>
      </div>
      <div 
      ref={scrollContainerRef as any}
      className="w-screen md:max-w-screen-xl? border-[1px] border-indigo-900 rounded-xl bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 p-5 md:my-7 overflow-x-auto"
      
      
      >
        <LedStrip start={isPlaying} numSteps={numSteps} />
        <div className="flex rounded-xl flex-col p-3 bg-gradient-to-r from-violet-800 via-indigo-700 to-purple-500 min-w-full w-fit ">
          {keypads.map((row, rowNum) => {
            return (
              <div
                key={`row-${rowNum}`}
                className="flex flex-wrap? md:flex-nowrap items-center justify-center mx-auto md:flex-row m-4 "
              >
                {row.map((keypad: any, stepNum: any) => {
                  return (
                    <KeyPad
                      key={`step-${stepNum}`}
                      {...keypad}
                      onPadClicked={updatePad}
                      selectedColor={getDrumColor(drumTypes[rowNum])}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {/* <button onClick={setUpSamples}>Set up</button> */}
      <button onClick={play}>Play</button>
    </main>
  );
}
