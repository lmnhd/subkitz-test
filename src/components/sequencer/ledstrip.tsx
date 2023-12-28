"use client";
import React, { useEffect, useState } from "react";
import * as Tone from "tone";
export default function LedStrip({ start, numSteps }: { start: boolean, numSteps: number }) {
    const [ledStep, setLedStep] = useState<number>(0);
useEffect(() => {
    const ledRun = async () => {
        console.log('ledRun');
        Tone.Transport.scheduleRepeat(repeat, `${numSteps}n`);
        Tone.Transport.start();
    }
    function repeat(time: any) {
        console.log('repeat');
        setLedStep((ledStep) => {
            if (ledStep == numSteps - 1) {
                return 0;
            } else {
                return ledStep + 1;
            }
        })
      }
    if (start) {
        ledRun();
    } else {
        Tone.Transport.stop();
        Tone.Transport.cancel();
        setLedStep(0);
    }
    // if (start) {
    //   await sequencePattern();
    // }else{
    //     Tone.Transport.stop();
    //     Tone.Transport.cancel();
    //     setLedStep(0);
    // }
}, [start, numSteps]);
  
  
  return (
    <div className="flex md:flex-row flex-wrap? items-center justify-center m-1 w-fit md:w-full ">
      {Array(numSteps).fill(0).map((num, ledIndex) => {
        return (
          <p
          key={`led-${ledIndex}`}
            className={`w-6 md:w-12 h-3 mx-1 text-xs rounded-3xl text-center align-text-top transition-opacity? duration-300 ease-out ${
              ledIndex == ledStep ? "bg-blue-500 opacity-100" : "bg-black opacity-0"
            } `}
          ></p>
        );
      })}
    </div>
  );
}
