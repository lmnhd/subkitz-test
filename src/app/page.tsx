"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../public/subkitz_waves.png";
import Link from "next/link";
import { Button } from "@aws-amplify/ui-react";
import { generateClient } from "@aws-amplify/api";
import { Amplify } from "aws-amplify";
import SampleLoader from "@/components/sequencer/sampleloader";
import { landingPageHeaders } from "@/lib/utils";
// import drumMachineSVG from '../../public/SVG/Asset 2.svg'
import DrumMachineSVG from "@/components/svg/drumMachineSVG";
import MixerSVG from "@/components/svg/mixerSVG";
function Home() {
  return (
    <main className="overflow-hidden">
      
      <div className="absolute? fixed h-[1200px] w-[1800px]? h-full? w-full -z-[50]? -left-[500px]? -top-[400px]? opacity-60? animate-bounce? overflow-hidden border-pink-500 border-[1px] ">
        <div className="absolute w-full h-full bg-gradient-to-r from-slate-900 via-slate-900/70 to-slate-900 "></div>
        <div className="scale-150? -z-[50]">
          <DrumMachineSVG />
        </div>
      </div>
      
      <div className="relative flex flex-col items-center justify-center min-h-screen w-5/6 py-8 my-20 mx-auto border-[1px] shadow-sm border-lime-500 bg-white/10 ">
     
        <h1 className={`text-4xl mb-24 mt-6`}>
          Construct the perfect kit for your next track!
        </h1>
        
        <div className="relative flex flex-wrap items-center justify-around w-full h-full">
          <div
          className="absolute -z-[1]? opacity-50 -top-48 blur-sm"
          ><Image src={logo} alt="subkitz logo" width={500} height={300} /></div>
          <div>
          <MixerSVG/>
            <div className="mt-6 bg-black/40">
              <div className="relative w-56 h-56 border-[1px] rounded-md border-indigo-500 text-center text-xl flex items-center">{landingPageHeaders[1].text}</div>
            </div>
            
            <Link href={`/soundlibrary`}>
              <p className={`text-4xl text-center text-indigo-500 animate-pulse `}>
                sound repository
              </p>
            </Link>
            <MixerSVG/>
          </div>
          <div>
          <MixerSVG/>
            <div className="mt-6 bg-black/40">
              <div className="relative w-56 h-56 border-[1px] rounded-md border-indigo-500 text-center text-xl flex items-center">{landingPageHeaders[2].text}</div>
            </div>
            <Link href={`/kitlab`}>
              <p className={`text-4xl text-center text-lime-500 animate-pulse`}>
                beat laboratory
              </p>
            </Link>
            <MixerSVG/>
          </div>
        </div>
       
      </div>
      <Image className="mx-auto md:relative" src={logo} alt="subkitz logo" width={500} height={300} />
    </main>
  );
}
export default Home;
//export default Home;
