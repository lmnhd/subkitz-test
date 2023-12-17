"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@aws-amplify/ui-react";
import { generateClient } from "@aws-amplify/api";
import * as subscriptions from "@/graphql/subscriptions";
import { createSample, deleteSample, updateSample } from "@/graphql/mutations";
import { Amplify } from "aws-amplify";
import { listSamples } from "@/graphql/queries";
import {
  downloadToMemory,
  getList,
  getS3URL,
  listSamplesS3FolderContents,
  getSampleByID,
  getSampleFromS3,
  updateSampleData,
} from "@/lib/s3";

import Image from "next/image";
//import { dbClient } from "@/lib/dynamo";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Inter } from "next/font/google";
import * as Tone from "tone";
import { Howl, Howler } from "howler";
import { Sample } from "@/API";
import * as SampleTypes from "../../ADMINISTRATION/src/interfaces";
import SampleProperties from "@/components/sampleitem/sampleproperties";
import { get } from "http";
import DrumSelect from "@/components/drumselect";
type soundlistProps = {
  items: Sample[];
  drumType: SampleTypes.Drum | undefined;
};
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_Kp6ZfnG0v",
      allowGuestAccess: true,
      identityPoolId: "us-east-1:54569dbe-1dcf-4deb-a6d3-d5b799ecc637",
      userPoolClientId: "7dcgmdsj20jgfdhuk3egso5huo",
      loginWith: { username: true, email: true },
    },
  },
  API: {
    GraphQL: {
      endpoint:
        "https://m27uptzxtzav7cooltu26qfdpa.appsync-api.us-east-1.amazonaws.com/graphql",
      region: "us-east-1",
      defaultAuthMode: "apiKey",
      apiKey: "da2-x5h2lmi54jbnfk6znwohqweqou",
    },
  },
  Storage: {
    S3: {
      bucket: "subrepo-samples-bucket",
      region: "us-east-1",
      //dangerouslyConnectToHttpEndpointForTesting: 'true',
    },
  },
});
function Home() {
  const [soundList, setSoundList] = useState<soundlistProps>({
    items: [],
    drumType: undefined,
  });
  const [currentSoundListIndex, setCurrentSoundListIndex] = useState<number>(0);
  const [audio, setAudio] = useState<Sample>();
  const [player1, setPlayer1] = useState<Tone.Player>();
  const [drumType, setDrumType] = useState<SampleTypes.Drum>(
    SampleTypes.Drum.kick
  );
  const [badFileArray, setBadFileArray] = useState<Sample[]>([]);
  // new Tone.Player().toDestination()
  //const dynamo = dbClient();

  const client = generateClient();

  useEffect(() => {
    const load = async () => {
      const sampleList: soundlistProps = await getList(drumType);
      setSoundList(sampleList);
      console.log("sampleList", sampleList);
      const url = await getS3URL(sampleList.items[0].s3Path) as string;
      setAudio(sampleList.items[0]);
      setPlayer1(new Tone.Player(url).toDestination());
      updateSub;
      // const data = dynamo
      // console.log("data", data);
    };
    load();
  }, [drumType,]);
  const changeDrumList = async (drum: SampleTypes.Drum) => {
    const sampleList: soundlistProps = await getList(drum);
    setSoundList(sampleList);
    setDrumType(drum);
    setAudio(sampleList.items[0]);
    console.log("sampleList", sampleList);
  };
  const updateSub = client
    .graphql({
      query: subscriptions.onUpdateSample,
    })
    .subscribe({
      next: ({ data }) => console.log("subscription data", data),
      error: (err) => console.log("subscription error", err),
    });

  const Start_Audio = async () => {
    if (Tone.context.state !== "running") {
      Tone.context.resume();
    } else {
      Tone.start();
    }
  };

  // const loadSound = async (s3Path: string) => {
  //   const url = await getS3URL(s3Path);
  //   console.log("url", url);
  //   const player = new Tone.Player(url,() => {}).toDestination();
  //   setPlayer1(player);
  //   console.log("loaded", player);
  // };
  // const getSoundFile = async (s3Path: string) => {
  //   const blob: any = await downloadToMemory("");
  //   setAudio(blob);
  //   console.log("blob", blob);

  //   const player = new Tone.Player(blob, () => {}).toDestination();
  //   setPlayer1(player);
  //   return blob;
  // };

  const listAllBucketFiles = async () => {
    const list = await getList(SampleTypes.Drum.snare);
    console.log("list", list);
  };

  const previewSound = async (sample: Sample, sampleIndex: number) => {
    //const sound:any = await getSoundFile("");
    // if (badFileArray.length > 0) {
    //   console.log(`found ${badFileArray.length} bad files`);
    //   for (let i = 0; i < badFileArray.length; i++) {
    //     const badFile = badFileArray[i];
    //     const res = await updateSampleData({
    //       ...badFile,
    //       invalid: true,
    //     });
    //     console.log(`marked ${badFile} as invalid`);
    //     setBadFileArray([]);
    //   }
    // }
    Start_Audio();

    if (sampleIndex !== currentSoundListIndex) {
      const check = await getSampleFromS3(sample.s3Path);
      if (check.length === 0) {
        console.log("sample not found in S3");
        return;
      }
      const url = await getS3URL(sample.s3Path) as string;

      const sound = new Howl({
        src: url,
      });
      console.log("trying to play...");
      console.log("url", url);

      // const player = new Tone.Player(url, () => {
      //   console.log("loaded!!");
      // }).toDestination();

      setBadFileArray([...badFileArray, sample]);
      const player = new Tone.Player(url, () => {
        console.log("loaded!!");
        setBadFileArray(badFileArray.filter((item) => item.id !== sample.id));
        if (!player?.loaded) {
          console.log("Error loading sample!");
          // const newList = soundList;
          // newList.items.splice(sampleIndex, 1);
          // setSoundList(newList);

          // const update = {...sample, invalid: true};
          // const updatedSampleID = await updateSampleData(update);
          // console.log("marked as invalid => ", updatedSampleID);
          return;
        } else {
          sound.play();
          setAudio(sample);
          setCurrentSoundListIndex(sampleIndex);

          console.log("sampledrum is ", sample.drum);
          setPlayer1(player);
          console.log("badFileArray =>", badFileArray);
        }
      }).toDestination();
    } else {
      if (player1?.loaded) {
        samplePlayCurrentSound();
      }
    }
  };

  const samplePlayCurrentSound = async () => {
    console.log(`now playing ${audio?.name} - ${audio?.id}`);
    Start_Audio();
    if (player1) {
      try {
        player1.start();
      } catch (error) {
        console.log("buffer is either not set or not loaded");
      }
    }
  };

  const updateSampleEntry = async (value: string, prop: string) => {
    console.log("updateSampleEntry", value, prop)
    if (audio) {
      const sample = soundList.items[currentSoundListIndex];  
      if (!sample) {
        return;
      }
      console.log("found sample => ", sample);
      const update = { ...sample!, [prop]: value };
      console.log("update check =>", update);
      //return;

      let newList = soundList;
      newList.items.splice(currentSoundListIndex, 1, update);
      setSoundList(newList);
      setAudio(update);
      //console.log("updated sample => ", update);
      //console.log("sample in list => ", soundList.items[currentSoundListIndex]);

      const updatedSampleID = await updateSampleData(update);
      console.log("updatedSampleID", updatedSampleID);

      await new Promise((resolve) => setTimeout(resolve, 5000));
      const check = await getSampleByID(updatedSampleID);
      console.log("check => ", check);
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
      <div className="flex flex-col gap-4 justify-center items-center my-6">
        <DrumSelect updateValue={changeDrumList} defaultDrum={drumType} />
        <Button
          content="Click Me"
          className="w-full bg-violet-800 text-white"
          onClick={() => samplePlayCurrentSound()}
        >
          {`Play ${audio?.name}`}
        </Button>
      </div>
      <div className="m-8 border-[1px] border-lime-300 p-5 rounded-sm">
        <SampleProperties sample={audio!} updateValue={updateSampleEntry} />
      </div>

      {/* <Button
        content="Click Me"
        className="w-1/2"
        onClick={() => createSampleEntry()}
      >
        Create Sample Record
      </Button> */}
      {/* <input
     type='file'
    
     onChange={check}
     /> */}

      <h1 className="text-4xl font-bold">{soundList.drumType}</h1>
      <div className="flex flex-wrap gap-1 items-center justify-between  text-sm">
        {soundList &&
          soundList.items.map((sound: Sample, index: number) => {
            return (
              <div key={sound.id} className="p-1 flex items-center justify-center">
                <Button
                  key={sound.id}
                  className={`text-lime-400 w-32 font-extralight hover:text-pink-500 hover:bg-gradient-to-bl hover:from-slate-900  hover:to-gray-800 ${
                    currentSoundListIndex === index
                      ? "bg-gradient-to-bl from-red-900 to-purple-800"
                      : ""
                  }`}
                  onClick={() => previewSound(sound, index)}
                >
                  {`${soundList.drumType} ${index + 1}`}
                  {/* {sound.name.split(".")[0]} */}
                </Button>
              </div>
            );
          })}
      </div>
    </main>
  );
}
export default Home;
//export default Home;
