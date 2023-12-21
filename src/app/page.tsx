"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@aws-amplify/ui-react";
import { generateClient } from "@aws-amplify/api";
import { Amplify } from "aws-amplify";

import {
  downloadToMemory,
  getList,
  getS3URL,
  listSamplesS3FolderContents,
  getSampleByID,
  getSampleFromS3,
  updateSampleData,
  getUnCategorizedList,
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
export type soundlistProps = {
  items: Sample[];
  drumType?: SampleTypes.Drum | undefined;
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
  const [badFileArray, setBadFileArray] = useState<{sample:Sample,indexInList:number}[]>();
  // new Tone.Player().toDestination()
  //const dynamo = dbClient();

  const client = generateClient();

  useEffect(() => {
    const load = async () => {
      const sampleList: soundlistProps = await getUnCategorizedList(1000);
      setSoundList(sampleList);
      console.log("sampleList", sampleList);

      const url = (await getS3URL(sampleList.items[0].s3Path)) as string;
      setAudio(sampleList.items[0]);
      setPlayer1(new Tone.Player(url).toDestination());

      //updateSub;
      // const data = dynamo
      // console.log("data", data);
    };
    load();
  }, []);
  const changeDrumList = async (drum: SampleTypes.Drum) => {
    const sampleList: soundlistProps = await getList(drum);
    setSoundList(sampleList);
    setDrumType(drum);
    setAudio(sampleList.items[0]);
    console.log("sampleList", sampleList);
  };
  // const updateSub = client
  //   .graphql({
  //     query: subscriptions.onUpdateSample,
  //   })
  //   .subscribe({
  //     next: ({ data }) => console.log("subscription data", data),
  //     error: (err) => console.log("subscription error", err),
  //   });

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

  const addSampleToBadArray = async (sample: Sample,sampleIndex:number) => {
    //check if sample is already in badFileArray
    const check = badFileArray?.find((item) => item.sample.id === sample.id);
    if (check) {
      console.log("sample already in badFileArray");
      return;
    }
    const tempList = badFileArray ? [...badFileArray] : [];
    setBadFileArray([...tempList, {sample, indexInList: sampleIndex }]);
    console.log(tempList);
  };
  const removeBadSamplesFromList = async (
    badSamples = badFileArray
  ) => {
    if (!badFileArray || badFileArray!.length === 0) {
      return;
    }
    let newList: Sample[] = [];
    for (let i = 0; i < badSamples!.length; i++) {
      const sample = badSamples![i].sample;
      newList = soundList.items.filter((item) => item.id !== sample.id);
    }
    setSoundList({ ...soundList, items: newList });
    return newList;
  };
  const markInvalidToDb = async () => {
    if (!badFileArray || badFileArray!.length === 0) {
      return;
    }
    for (let i = 0; i < badFileArray.length; i++) {
      const sample = badFileArray[i];
      const res = await updateSampleData({
        ...sample.sample,
        invalid: true,
      });
      console.log(`marked ${sample.sample.id} as invalid`);
    }
  };

  const updateInvalidSamples = async () => {
    await markInvalidToDb();
    const newList = await removeBadSamplesFromList();
    setBadFileArray([]);
    console.log("newList", newList);
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
      console.log(sample.s3Path);
      const check = await getSampleFromS3(sample.s3Path);

      if (check.length === 0) {
        console.log("sample not found in S3");
        return;
      }

      const url = (await getS3URL(sample.s3Path)) as string;

      console.log("trying to play...", sample.id, sample.name, sample.s3Path);

      console.log("url", url);

      try {
        let timeOut = setTimeout(async () => {
          console.log("timeout");
          addSampleToBadArray(sample,sampleIndex);
          clearTimeout(timeOut);
        }, 5000);
        const player = new Tone.Player(url, () => {
          console.log("loaded!!");
          clearTimeout(timeOut);
          setPlayer1(player);
        }).toDestination();
      } catch (error) {
        console.log("error loading sample", error);
        return;
      }

      const sound = new Howl({
        src: url,
      });

      setAudio(sample);
      setCurrentSoundListIndex(sampleIndex);
      sound.play();
      console.log("sampledrum is ", sample.drum);
    } else {
      if (player1?.loaded) {
        samplePlayCurrentSound();
      }
    }
  };

  const samplePlayCurrentSound = async () => {
    //  const url = "http://localhost:3000/Dj_Premier_kick_04.wav"
    //  console.log("url", url);
    // const player = new Tone.Player(url, () => {
    //   console.log("loaded!!");
    //   player.start();

    // }).toDestination()

    //  console.log("url", url);
    //   let player = new Howl({
    //     src: url,
    //   });
    //   player.play();

    //return;

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
    console.log("updateSampleEntry", value, prop);
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
  // if(window){
  //   window.addEventListener("keydown", (e) => {
  //     e.preventDefault();
  //     if (e.key === " ") {
  //       console.log(`badFileArray = `, badFileArray);
  //     }
  //   });
  // }
 

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-8">
      <h1 className="text-4xl font-bold text-center text-amber-500">
        SUBKITZ...
      </h1>
      <p className="w-2/3 ml-auto mr-10 text-right">
        rhythm composition repository by lmnhd
      </p>
      <div className="flex gap-4 justify-center items-center my-6">
        <DrumSelect updateValue={changeDrumList} defaultDrum={drumType} />
        <Button
          content="Click Me"
          className="w-28 h-28 text-center text-lg bg-gradient-to-br from-violet-900 via-purple-950 to-violet-500 text-lime-300 hover:from-red-900 hover:via-fuchsia-800 hover:to-red-500"
          onClick={() => samplePlayCurrentSound()}
        >
          {`${audio?.name}`}
        </Button>
      </div>
      <div className="m-8 border-[1px] border-lime-300 p-5 rounded-sm">
        <SampleProperties sample={audio!} updateValue={updateSampleEntry} />
      </div>

      {badFileArray && badFileArray!.length > 0 && (
        
        <div className="bg-slate-100 pb-1  h-24  overflow-y-auto relative">
          <p className="text-lg text-center font-bold text-slate-300 z-10 sticky top-0 bg-slate-800 ">
          {badFileArray!.length} Bad Samples!</p>
          <div className="bg-slate-800 ">
           
            {badFileArray!.map((sample) => {
              return (
                <div key={sample.indexInList} className="flex flex-col text-sm text-red-600 border-[1px] border-violet-400 p-2 text-center rounded-lg">
                  <p className="text-lg">{`Drum Pad ${sample.indexInList + 1}`}</p>
                  <p>{sample.sample.name}</p>
                  <p>{sample.sample.id}</p>
                  <p>{sample.sample.drum}</p>
                  <p>{sample.sample.s3Path}</p>
                </div>
              );
            })}
          </div>
          <button
          title="remove bad samples from list"
          onClick={() => updateInvalidSamples()}
          className="absolute bottom-0 right-0 bg-gradient-to-br from-red-900 via-fuchsia-800 to-red-500 text-lime-300 hover:from-red-900 hover:via-fuchsia-800 hover:to-red-500"
          >Remove</button>
        </div>
      )}

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
      <div className="flex flex-wrap gap-1 h-96 overflow-auto items-center justify-between  text-sm">
        {soundList &&
          soundList.items.map((sound: Sample, index: number) => {
            return (
              <div
                key={sound.id}
                className="p-1 flex items-center justify-center"
              >
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
