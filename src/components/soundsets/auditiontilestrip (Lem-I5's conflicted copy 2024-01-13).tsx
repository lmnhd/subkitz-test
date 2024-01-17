import { Sample } from "@/API";
import React, { useEffect, useState } from "react";
import SampleAuditionTile from "../sampleitem/sampleauditiontile";
import * as Tone from "tone";
import { Button } from "../ui/button";

export default function AuditionTileStrip({
  sampleArray,
  tileHeight = 200,
  silentTime = false,
  handleBadSample,
  forceReload = false,
  setForceReload,
  loadNextStripRow
}: {
  sampleArray: Sample[];
    tileHeight?: number;
    silentTime?: boolean;
    handleBadSample?:any;
    forceReload?:boolean;
    setForceReload?:any;
    loadNextStripRow?:any;
}) {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [playNow, setPlayNow] = useState({index:"-1",time:"0"});

  const MAX_SAMPLES = 10

  let index = 0;

  const playShortSequence = async () => {
    await Tone.start();
    Tone.Transport.bpm.value = 80;
    index = 0;
    Tone.Transport.scheduleRepeat(repeatAction, "8n");
    Tone.Transport.start();
  };
  const repeatAction = (time: any) => {
   // if(setSilentTime){
      //setSilentTime(false);
   // }
    console.log("repeatAction", `Time: ${time} Index: ${index}`)
    setPlayNow({index:String(index),time:time});
    index++;

    if(index > samples.length){
        
        Tone.Transport.stop();
    index = 0;
    setPlayNow({index:String(-1),time:time});
    }
  };
  useEffect(() => {
    console.log("AuditionTileStrip useEffect",`ForceReload: ${forceReload} samples length = ${sampleArray.length}`);
    console.log("SampleArray",sampleArray)
    if (sampleArray.length <= MAX_SAMPLES || forceReload) {
      setSamples([...sampleArray]);
      setForceReload(false)
      

    }
  }, [sampleArray]);
  return (
    <div className="flex flex-col">
        <Button onClick={playShortSequence}>Play Short Sequence</Button>
      <div className="flex flex-row flex-wrap items-center justify-center gap-3">
        {samples &&
          samples.map((sample, index) => {
            return (
              <SampleAuditionTile
                playNow={{index:playNow.index,time:playNow.time}}
                sampleIndex={String(index)}
                sample={sample}
                height={tileHeight}
                key={`auditionTile-${index}`}
                handleBadSample={handleBadSample}
                loadNextStripRow={loadNextStripRow}
              />
            );

          })}
          <div
          className={`flex items-center relative text-xl rounded-lg justify-center my-1 w-[${tileHeight}px] p-2 h-[${tileHeight}px] bg-gradient-to-tr from-pink-600 to-slate-950 border-[1px] border-indigo-500 cursor-pointer hover:border-[1px] hover:border-pink-700`}
          onClick={loadNextStripRow}

          >NEXT</div>
      </div>
    </div>
  );
}
