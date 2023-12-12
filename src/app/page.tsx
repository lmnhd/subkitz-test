"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { createSample, deleteSample, updateSample } from "@/graphql/mutations";
import {Amplify} from "aws-amplify";
import { listSamples } from "@/graphql/queries";
import * as cdk from "@aws-cdk/core";
import { list } from "aws-amplify/storage";
import Image from "next/image";
//import { dbClient } from "@/lib/dynamo";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Inter } from "next/font/google";
import * as Tone from "tone";
import { Howl, Howler } from "howler";
import { downloadToMemory, getList, getS3URL } from "@/lib/s3";

Amplify.configure({
  API: {
    GraphQL: {
      endpoint:
        "https://m27uptzxtzav7cooltu26qfdpa.appsync-api.us-east-1.amazonaws.com/graphql",
      region: "us-east-1",
      defaultAuthMode: "apiKey",
      apiKey: "da2-x5h2lmi54jbnfk6znwohqweqou",
    },
  },
});
function Home() {
  const [soundList, setSoundList] = useState<any>(null);
  const [audio, setAudio] = useState<any>(null);
  const [player1, setPlayer1] = useState<Tone.Player>();
  // new Tone.Player().toDestination()
  //const dynamo = dbClient();

  useEffect(() => {
    const load = async () => {
      const res = await getList();
      setSoundList(res);
      console.log("res", res);
      setPlayer1(new Tone.Player().toDestination());
      // const data = dynamo
      // console.log("data", data);
    };
    load();
  }, []);

  const createSampleEntry = async () => {
    const client = await generateClient();
    const result = await client.graphql({
      query: createSample,
      variables: {
        input: {
          name: `test-${Date.now()}`,
          description: "test",
          s3Path: "test",
          reversed: false,
          drum: "snare",
          hygiene: "test",
          sourceGen1: "organic",
          genre: "test",
          tags: ["test"],
        },
      },
    });
    console.log("saved to db", result);
  };
  const listAllSamples = async () => {
    const client = await generateClient();
    const result = await client.graphql({
      query: listSamples ,
    });
    console.log("result", result.data.listSamples.items);
  };
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
        onClick={() => listAllSamples()}
      >
        List Samples
      </Button>
      <Button
        content="Click Me"
        className="w-1/2"
        onClick={() => createSampleEntry()}
      >
        Create Sample Record
      </Button>
      {/* <input
     type='file'
    
     onChange={check}
     /> */}

      {soundList &&
        soundList.map((sound: any) => {
          return (
            <Button
              key={sound}
              className="w-1/2 text-lg text-white"
              onClick={() => previewSound(sound)}
            >
              {sound}
            </Button>
          );
        })}
    </main>
  );
}
export default Home;
//export default Home;
