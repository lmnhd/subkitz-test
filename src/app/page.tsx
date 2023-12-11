"use client"
import React, { useEffect, useState } from "react";
import * as cdk from '@aws-cdk/core'
import { list } from "aws-amplify/storage";
import Image from 'next/image'
//import { dbClient } from "@/lib/dynamo";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@aws-amplify/ui-react";
import { Inter } from 'next/font/google'
import * as Tone from "tone";
import { Howl, Howler } from "howler";
import { downloadToMemory, getList, getS3URL } from "@/lib/s3";




//Amplify.configure(config)
function Home() {
  const [soundList, setSoundList] = useState<any>(null);
  const [audio, setAudio] = useState<any>(null);
  const [player1, setPlayer1] = useState<Tone.Player>(
    new Tone.Player().toDestination()
  );
  //const dynamo = dbClient();
  

  useEffect(() => {
    const load = async () => {
     const res = await getList();
      setSoundList(res);
      console.log("res", res);

      // const data = dynamo
      // console.log("data", data);
    };
    load();
    
    
  }, []);

  const Start_Audio = async () => {
    if (Tone.context.state !== "running") {
      Tone.context.resume();
    } else {
      Tone.start();
    }
  };
  const loadSound = async (s3Path: string) => {
    const url = await getS3URL(s3Path);
    console.log("url", url);
    const player = new Tone.Player(url).toDestination();
    setPlayer1(player);
    console.log("loaded", player);
  };
  const getSoundFile = async (s3Path: string) => {
    const blob: any = await downloadToMemory("");
    setAudio(blob);
    console.log("blob", blob);

    const player = new Tone.Player(blob, () => {}).toDestination();
    setPlayer1(player);
    return blob;
  };

  const previewSound = async (s3Path: string) => {
    //const sound:any = await getSoundFile("");
    if (true) {
      const url = await getS3URL(s3Path);
      console.log("playing");
      const sound = new Howl({
        src: url,
      });
      sound.play();
      //Start_Audio();
      //player1.start();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center text-amber-500">
        SUBKITZ...
      </h1>
      <p className="w-2/3 ml-auto mr-10 text-right">
        rhythm composition repository by lmnhd
      </p>
      <Button
        content="Click Me"
        className="w-1/2"
        onClick={() => loadSound("9th Wonder Kit/hat1.wav")}
      >
        load
      </Button>
      <Button
        content="Click Me"
        className="w-1/2"
        onClick={() => previewSound(audio)}
      >
        play
      </Button>
      {/* <input
     type='file'
    
     onChange={check}
     /> */}

     {soundList && soundList.map((sound:any) => {
        return <Button
        key={sound}
        className="w-1/2 text-lg text-white"
        onClick={() => previewSound(sound)}>
          {sound}
        </Button>
     })}
    </main>
  )
}
export default Home
//export default Home;
