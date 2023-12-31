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
  getSampleByIDWithDynamo,
  getListFromDynamo,
  getListFromDynamoByDrumValue,
  dynamoQueryScanProps,
  SetSamplesCache,
  GetSamplesCache,
} from "@/lib/s3";

import Image from "next/image";
//import { dbClient } from "@/lib/dynamo";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { Inter } from "next/font/google";
import * as Tone from "tone";
import { Howl, Howler } from "howler";
import { Sample } from "@/API";
import * as SampleTypes from "../../../../ADMINISTRATION/src/interfaces";
import SampleProperties from "@/components/sampleitem/sampleproperties";
import { get } from "http";
import DrumSelect from "@/components/drumselect";
import { amplifyConfigure } from "@/lib/amplifyconfigure";
import { getDrumColor } from "@/lib/utils";


//amplifyConfigure()
export type SoundListProps = {
  items: Sample[];
  drumType?: SampleTypes.Drum | undefined;
  lastEvaluatedKey?: string;
};
function Home() {
  const [soundList, setSoundList] = useState<SoundListProps>({
    items: [],
    drumType: undefined,
  });
  const [currentSoundID, setCurrentSoundID] = useState<string>();
  const [currentSoundIndex, setCurrentSoundIndex] = useState<number>(-1);
  const [audio, setAudio] = useState<Sample>();
  const [player1, setPlayer1] = useState<Tone.Player>();
  const [drumType, setDrumType] = useState<string>("any");
  const [badFileArray, setBadFileArray] =
    useState<{ sample: Sample; indexInList: number }[]>();
  const [listLength, setListLength] = useState<number>(50);
  const listLengthOptions = [10, 20, 50, 100, 200, 500, 1000];

 
  //const client = generateClient();

  useEffect(() => {
    const load = async () => {
      // const sampleList: SoundListProps = await getUnCategorizedList(50);
      const props: dynamoQueryScanProps = {
        drumType: SampleTypes.Drum.kick,
        //limit: 50,
      };

      const sampleList: SoundListProps = await getListFromDynamo();
      // while (sampleList.lastEvaluatedKey) {
      //   const nextList = await getListFromDynamo(
      //     sampleList.lastEvaluatedKey
      //   );
      //   sampleList.items = [...sampleList.items, ...nextList.items];
      //   sampleList.lastEvaluatedKey = nextList.lastEvaluatedKey;
      // }

      setSoundList(sampleList);
      // SetSamplesCache(sampleList.items);

      console.log("sampleList", sampleList);

      if (sampleList.items.length === 0) {
        return;
      }
      //const url = (await getS3URL(sampleList.items[0].s3Path)) as string;
      //setAudio(sampleList.items[0]);
      //setPlayer1(new Tone.Player(url).toDestination());

      //updateSub;
      // const data = dynamo
      // console.log("data", data);
    };
    load();
  }, []);

  //console.log("SamplesCache => ", GetSamplesCache())

  const changeDrumList = async (drum: any) => {
    // const sampleList: SoundListProps = await getList(drum);
    // setSoundList(sampleList);
    setDrumType(drum);
    //setAudio(sampleList.items[0]);
    //console.log("sampleList", sampleList);
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

  const addSampleToBadArray = async (sample: Sample, sampleIndex: number) => {
    //check if sample is already in badFileArray
    const check = badFileArray?.find((item) => item.sample.id === sample.id);
    if (check) {
      console.log("sample already in badFileArray");
      return;
    }
    const tempList = badFileArray ? [...badFileArray] : [];
    setBadFileArray([...tempList, { sample, indexInList: sampleIndex }]);
    console.log(tempList);
  };
  const removeBadSamplesFromList = async (badSamples = badFileArray) => {
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

  const previewSound = async (sampleID: string) => {
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
    const sample = soundList.items.find((sound) => {
      return sound.id === sampleID;
    });
    const sampleIndex = soundList.items.findIndex((sound) => {
      return sound.id === sampleID;
    });
    setCurrentSoundIndex(sampleIndex);

    if (sampleID !== currentSoundID) {
      console.log(sample?.s3Path);
      // const check = await getSampleFromS3(sample.s3Path);

      // if (check.length === 0) {
      //   console.log("sample not found in S3");
      //   addSampleToBadArray(sample, sampleIndex);
      //   return;
      // }

      const url = (await getS3URL(sample!.s3Path)) as string;

      console.log(
        "trying to play...",
        sample?.id,
        sample?.name,
        sample!.s3Path
      );

      console.log("url", url);

      try {
        let timeOut = setTimeout(async () => {
          console.log("timeout");
          addSampleToBadArray(sample!, sampleIndex);
          clearTimeout(timeOut);
        }, 10000);
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
      // const sampleWithAllFields = (await getSampleByIDWithDynamo(sample.id)) as Sample;
      setAudio(sample);
      console.log("sample", sample);
      // const newSoundList = soundList;
      // newSoundList.items.splice(sampleIndex, 1, sample);
      // setSoundList(newSoundList);
      setCurrentSoundID(sampleID);
      sound.play();
      console.log("sample drum is ", sample!.drum);
      console.log("sampleWithFields check...", sample?.sourceGen1);
    } else {
      if (player1?.loaded) {
        samplePlayCurrentSound();
      }
    }
  };

  const samplePlayCurrentSound = async () => {
    if (player1) {
      // console.log(`now playing `, audio);
      // Start_Audio();
      try {
        player1.start();
      } catch (error) {
        console.log("buffer is either not set or not loaded");
      }
    } else {
      previewSound(currentSoundID!);
    }
  };

  const updateSampleEntry = async (value: string, prop: string, id: string) => {
    console.log("updateSampleEntry", value, prop, id);
    if (audio) {
      const sample = soundList.items.find((item) => item.id === id);
      if (!sample) {
        return;
      }
      console.log("found sample => ", sample);
      const update = { ...sample!, [prop]: value };
      console.log("update check =>", update);
      //return;

      let newList = soundList;
      newList.items.splice(currentSoundIndex, 1, update);
      setSoundList(newList);
      setAudio(update);
      //console.log("updated sample => ", update);
      //console.log("sample in list => ", soundList.items[currentSoundID]);

      const updatedSampleID = await updateSampleData(update);
      console.log("updatedSampleID", updatedSampleID);

      // await new Promise((resolve) => setTimeout(resolve, 5000));
      // const check = await getSampleByIDWithDynamo(updatedSampleID);
      // console.log("check => ", check);
    }
  };
  // if(window){
  // window.addEventListener("keydown", (e) => {
  //   e.preventDefault();
  //   if (e.key === " ") {
  //     console.log(`AUDIO = `, audio);
  //   }
  // });
  //}
  
  return (
    <main className="flex flex-col items-center justify-between min-h-screen py-20">
      {/* <h1 className="text-4xl font-bold text-center text-amber-500">
        SUBKITZ...
      </h1> */}
      <p className="w-2/3 ml-auto mr-10 text-right">
        rhythm composition repository by lmnhd
      </p>
      <div className="flex flex-col flex-wrap items-center justify-around gap-2 my-6 md:flex-row">
        <div className="flex flex-col items-center justify-center w-48 text-center border-[1px] border-lime-800 rounded-xl py-4">
          <p className="w-48 text-md text-amber-600">Select Drum Type</p>
          <DrumSelect updateValue={changeDrumList} defaultDrum={drumType} />

          <p className="w-48 text-md text-amber-300">limit</p>
          <select
            name="listLength"
            id="listLength"
            title="listLength"
            value={listLength}
            onChange={(e) => setListLength(Number(e.target.value))}
            className="h-6 text-center text-slate-600 bg-lime-400 w-28 "
          >
            {listLengthOptions.map((num) => {
              return <option key={num}>{num}</option>;
            })}
          </select>
        </div>
        <div className="md:w-1/2 border-[1px] border-lime-900 p-1 rounded-sm">
          <SampleProperties sample={audio!} updateValue={updateSampleEntry} />
        </div>
        <div>
          <Button
            content="Click Me"
            className="p-1 text-sm text-center w-28 h-28 rounded-2xl bg-gradient-to-br from-violet-900 via-purple-950 to-violet-500 text-lime-300 hover:from-red-900 hover:via-fuchsia-800 hover:to-red-500"
            onClick={() => samplePlayCurrentSound()}
          >
            {`${audio?.name.trim().split(".")[0].substring(0, 7)}...`} <br />
            {currentSoundIndex !== -1 && currentSoundIndex + 1}
          </Button>
        </div>
      </div>

      {badFileArray && badFileArray!.length > 0 && (
        <div className="relative h-24 pb-1 overflow-y-auto bg-slate-100">
          <p className="sticky top-0 z-10 text-lg font-bold text-center text-slate-300 bg-slate-800 ">
            {badFileArray!.length} Bad Samples!
          </p>
          <div className="bg-slate-800 ">
            {badFileArray!.map((sample) => {
              return (
                <div
                  key={sample.indexInList}
                  className="flex flex-col text-sm text-red-600 border-[1px] border-violet-400 p-2 text-center rounded-lg"
                >
                  <p className="text-lg">{`Drum Pad ${
                    sample.indexInList + 1
                  }`}</p>
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
          >
            Remove
          </button>
        </div>
      )}

      <h1 className="text-4xl font-bold">{soundList.drumType}</h1>
      <div className="flex flex-wrap items-center justify-between gap-1 overflow-auto text-sm h-96">
        {soundList &&
          soundList.items
            .filter((sound) => {
              if (drumType === "any") return true;
              return sound.drum === drumType;
            })
            .slice(0, listLength)
            .map((sound: Sample, index: number) => {
              return (
                <div
                  key={sound.id}
                  className="flex items-center justify-center p-1"
                >
                  <Button
                    key={sound.id}
                    className={`text-lime-400 w-28 h-20 text-sm text- font-extralight hover:text-pink-500 hover:bg-gradient-to-bl hover:from-slate-900  hover:to-gray-800 ${
                      currentSoundID === sound.id
                        ? "bg-gradient-to-bl border-spacing-2 border-2  border-red-600 text-xl from-lime-500 to-lime-600 font-bold text-violet-500"
                        : getDrumColor(sound.drum!)
                    }`}
                    onClick={() => previewSound(sound.id)}
                  >
                    {`${sound.drum ? sound.drum : "sound"} ${index + 1}`}
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
