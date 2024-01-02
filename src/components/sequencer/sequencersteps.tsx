"use client";
import { cn, getDrumColor } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
import { Step, SequenceGroup, SequenceRow } from "./sequencertypes";
import { Button } from "../ui/button";
import Clock from "@/components/sequencer/clock";
import { ClockContext } from "./clockcontext";

import LedStrip from "./ledstrip";

export default function SequencerSteps({
  numSequences,
  sequences,
  pattern,
  updatePad,
  drumTypes,
  numRows,
  numSteps,
  players,
  setPlayers,
  setKeyPads,
  setMixerVolumes,
  setDrumTypes,
  bpm,
  playMode,
  actionButtonHandler,
  _currentStep,
  isPlaying,
}: {
  numSequences: number;
  sequences: SequenceGroup[];
  pattern: number;
  updatePad: any;
  drumTypes: string[];
  numRows: number;
  numSteps: number;
  players: Tone.Player[];
  setPlayers: any;
  setKeyPads: any;
  setMixerVolumes: any;
  setDrumTypes: any;
  bpm: number;
  playMode: number;
  actionButtonHandler: any;
  _currentStep: number;
  isPlaying: boolean;
}) {
  const [currentPattern, setCurrentPattern] = useState<number>(pattern);
  const {
    currentStep,
    setCurrentStep,
    sequencePattern,
    handleStepChanged,
    setHandleStepChanged,
    step,
  }: {
    currentStep: number;
    setCurrentStep: any;
    sequencePattern: any;
    handleStepChanged: any;
    step: number;
    setHandleStepChanged: any;
  } = React.useContext(ClockContext);
  // const handleStepChange = (step: number) => {
  //   console.log("step changed", step);
  // };
  useEffect(() => {
    const stepChanged: any = (step: number) => {
      console.log("step changed.....", step);
    };
   
    
  }, []);

  const KeyPad = ({
    rowNum,
    stepNum,
    roll,
    selected,
    onPadClicked,
    selectedColor = "bg-indigo-300",
    isPlaying,
    handleStepChanged,
  }: Step) => {
    const [isActive, setIsActive] = useState(selected);
    const [rollActive, setRollActive] = useState(roll);

    const updateThisPad = () => {
      setIsActive(!isActive);
      onPadClicked(rowNum, stepNum, "selected");
      selected = !selected;
    };
    const doublClicked = () => {
      setRollActive(!rollActive);
      onPadClicked(rowNum, stepNum, "roll");
      roll = !roll;
    };
    return (
      <div
        className={cn(
          `flex items-center justify-center w-6 h-20 md:w-12 md:h-20 md:p-2 mx-1 text-white border-[1px] border-pink-300 rounded-xl hover:bg-lime-800 cursor-pointer `,
          isActive && selectedColor,
          rollActive && "border-4"
        )}
        onClick={updateThisPad}
        onDoubleClick={doublClicked}
      >
        <span>{stepNum + 1}</span>
        {/* <span>{currentStep + 1}</span> */}
      </div>
    );
  };
  //console.log("currentBPM", bpm);
  //console.log("currentPattern", pattern);

  

  const ActionButton = ({
    actionName,
    actionHandler,
    currentRow,
  }: {
    actionName: string;
    actionHandler?: any;
    currentRow: number;
  }) => {
    return (
      <Button
        className="w-12 border-[1px] border-black h-full shadow-sm bg-black/20 text-violet-300/30 rounded-lg hover:text-white"
        onClick={() => actionButtonHandler(actionName, currentRow)}
      >
        {actionName}
      </Button>
    );
  };
  const rowActions = [
    { name: "clear", handler: () => {} },
    { name: "copy", handler: () => {} },
    { name: "paste", handler: () => {} },
    { name: "step1", handler: () => {} },
    { name: "step2", handler: () => {} },
    { name: "step4", handler: () => {} },
    { name: "step8", handler: () => {} },
  ];
  const renderSequencerSteps = async () => {
    console.log("rendering sequencer steps for pattern - ", pattern);
    console.log("sequences length", sequences.length);
    //if(sequences.length === 0) return <></>
    if (sequences.length > 0 && sequences[0].length > 0) {
      console.log("sequences set", sequences);
      console.log("pattern", pattern);
      //console.log('currentPattern', currentPattern)
      const new_Sequences = sequences;
      setKeyPads(new_Sequences);
      return;
    }
    //const renderActionButtons = () => {};

    const new_sequences = Array(numSequences).fill(0);
    const rows = Array(numRows).fill(0);
    const steps = Array(numSteps).fill(0);
    const curSequenceArray = new_sequences.map((sequence, sequenceNum) => {
      return rows.map((row, rowNum) => {
        return steps.map((step, stepNum) => {
          return {
            rowNum,
            stepNum,
            selected: false,
            roll: false,
          };
        });
      });
    });
    const _players = rows.map((row, rowNum) => {
      return new Tone.Player().toDestination();
    });
    const _volumes = rows.map((row, rowNum) => {
      return 0;
    });
    const _drumTypes = rows.map((row, rowNum) => {
      return "none";
    });

    setKeyPads(curSequenceArray);
    setPlayers(_players);
    setMixerVolumes(_volumes);
    setDrumTypes(_drumTypes);

    console.log("new sequences", curSequenceArray);
  };
  useEffect(() => {
    renderSequencerSteps();
    //sequencePattern();
  }, [pattern, currentPattern, bpm, playMode, renderSequencerSteps]);

  return (
    // <Clock
    //   isPlaying={isPlaying}
    //   numSteps={numSteps}
    //   players={players}
    //   pattern={pattern}
    //   sequences={sequences}
    //   handleStepChanged={handleStepChange}
    // >
    <div>
      <div className="flex rounded-xl flex-col p-3 bg-gradient-to-r from-violet-800/10 via-indigo-700/10 to-purple-500/10 min-w-full w-fit ">
        {sequences[0]! &&
          sequences[pattern].map((row, index: number) => {
            return (
              <div
                key={`row-${index}`}
                className="flex flex-col justify-center items-center"
              >
                {drumTypes[index]} {`Pattern ${pattern + 1}`}
                <div>
                  <div className="relative">
                    <div
                      key={`row-${index}`}
                      className={`absolute flex flex-wrap? md:flex-nowrap items-center justify-center z-40 opacity-80 mx-auto md:flex-row m-4 `}
                    >
                      {row.map((keypad, stepNum: number) => {
                        return (
                          <>
                            {/* <div>{keypad.selected ? "selected" : "not selected"}</div> */}
                            <KeyPad
                              key={`step-${stepNum}`}
                              {...keypad}
                              onPadClicked={updatePad}
                              selected={keypad.selected}
                              selectedColor={getDrumColor(drumTypes[index])}
                              roll={keypad.roll}
                              currentStep={-1}
                              //isPlaying={stepNum === step}
                              isPlaying={false}
                            />
                          </>
                        );
                      })}
                    </div>
                    <div className="-z-0">
                      <LedStrip
                        start={isPlaying}
                        numSteps={numSteps}
                        isBacklitBar={true}
                        bgColorTW={getDrumColor(drumTypes[index])}
                      />
                    </div>
                  </div>
                  <div className="w-full flex justify-around gap-2 p-1  items-center bg-black/50 h-8 rounded-xl">
                    {rowActions.map((action) => {
                      return (
                        <ActionButton
                          key={`action-${action.name}`}
                          actionName={action.name}
                          currentRow={index}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
    // </Clock>
  );
}
