"use client"
import React from "react";
import { getDrumColor, landingPageHeaders, DrumColorArray } from "@/lib/utils";
import wave from '../../../../public/subkitz_waves.png'
import * as SampleTypes from "../../../../ADMINISTRATION/src/interfaces";
import Image from "next/image";
import LedStrip from "../../../components/sequencer/ledstrip";
import WaveDraw from "@/components/sampleitem/wavedraw";
import WaveDraw2 from "@/components/sampleitem/wavedraw2";
import WaveDraw3 from "@/components/sampleitem/wavedraw3";
const drums = [
  "kick",
  "snare",
  "cl-hat",
  "op-hat",
  "clap",
  "tom",
  "ride",
  "crash",
  "perc",
  "shaker",
  "snap",
  "fx",
];
const template = (key: string, content: string, bgColor: string) => {
  return (
    <div>
       
        <div
          className={`flex flex-col items-center justify-center text-center h-72 w-72 rounded-xl text-xl p-4 border-[1px] border-lime-500 bg-black ${bgColor} `}
          key={key}
        >
             <Image src={wave} alt="waves" width={200} height={200} 
        />
          {content}
        </div>
    </div>
  );
};
const generateBlocks = () => {
    const count = landingPageHeaders.length - 1;
    let counter = 0;

  const blocks = [];
  for (let i = 0; i < 20; i++) {
    if(counter > count){counter = 0;}
    const bgColor =
      DrumColorArray[Math.floor(Math.random() * DrumColorArray.length - 1)];
    if (i % Math.floor(Math.random() * 8) === 0) {
      blocks.push(<div
      className="flex items-center justify-center text-center h-72 w-72 border-[1px] rounded-xl text-3xl p-6 font-extra-light "
      >{landingPageHeaders[counter++].text}</div>);
    } else {
      blocks.push(
        template(
          i.toString(),
          drums[Math.floor(Math.random() * drums.length)] +
            " " +
            Math.floor(Math.random() * 1000),
          bgColor
        )
      );
    }

    
     
  }
  return blocks;
};

export default function BackStage() {
  console.log(
    Math.floor(Math.random() * Object.keys(SampleTypes.Drum).length - 1)
  );
  return (
    <div className="my-24">
       {/* <LedStrip  start={true} numSteps={16} isBacklitBar={false} bgColorTW="bg-slate-900 " /> */}
        {/* <div className="flex flex-wrap mx-auto gap-8 items-center justify-around">
            {generateBlocks()}
        </div> */}
       <WaveDraw3/>
    </div>
  );
}
