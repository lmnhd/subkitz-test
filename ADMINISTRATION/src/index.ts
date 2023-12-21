import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import {
  list,
  getUrl,
  downloadData,
  uploadData,
  UploadDataInput,
  UploadDataOutput,
  remove,
  RemoveInput
} from "aws-amplify/storage";
import {
  createSample,
  deleteSample,
  updateSample,
} from "./graphql-old/mutations";
import recursive from "recursive-readdir";
import fs from "fs";
import * as SampleTypes from "./interfaces";
import { listSamples } from "./graphql-old/queries";
import path from "path";

console.log("Starting...");

const configure = () => {
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
};
const client = generateClient();

configure();

const createLocalSampleListJson = async (base:string) => {
  // const base = "C:\\Users\\Administrator\\Downloads\\Downloads\\SPECIAL KITS\\";
//const base = "F:\\FL\\Kits\\";
//const base = "C:\\Users\\Administrator\\Downloads\\Downloads\\sk2"
  // const dirs = [
  //   "F:\\FL\\Kits",
  //   //"C:\\Users\\Administrator\\Downloads\\Downloads\\SPECIAL KITS",
  //   "C:\\Users\\Administrator\\Downloads\\Downloads\\sk2"
  // ];

  let currentDirectory = base;

  recursive(currentDirectory, ["node_modules"], (err: any, files: any) => {
    
    console.log(files);
    fs.writeFileSync(
      
        "sampleList.json"
     ,
      JSON.stringify(files)
    );

    
  });
};
const deleteFromS3 = async (s3Path: string) => {
  try {
    const result = await remove({
      key: s3Path,
      options: { accessLevel: "guest"},
    });
    console.log("result", result);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
  
  
}
// const testAwait = async () => {
//   const samples: string[] = JSON.parse(
//     fs.readFileSync("sampleList.json", "utf8")
//   );
//   console.log(samples[0]);

//   const drumtype: String | undefined = await tryToDetectDrumType(samples[0]);
//   console.log("drumtype = ", drumtype);

//   const result = await uploadDataToS3(samples[0], "public/awaittest/test8.wav");
//   console.log("result2 = ", result);

//   //return result;
// };

const querySample = async (s3Path: string) => {
  const result = await client.graphql({
    query: listSamples,
    variables: {
      filter: {
        s3Path: {
          eq: s3Path,
        },
      },
    },
  });
  console.log(result.data.listSamples.items);
  return result.data.listSamples.items;
};
const queryAll = async () => {
  const result = await client.graphql({
    query: listSamples,
  });
  console.log(result.data.listSamples.items);
  return result.data.listSamples.items;
};
const deleteSelectSampleQs = async () => {
  const paths = [
    //     F:\FL\Kits\Producer Drum Kits (Selective Sync Conflict)
    // F:\FL\Kits\Producer Drum Kits
    // F:\FL\Kits\Rock Drum Kit\
    // F:\FL\Kits\Techno Sound Pack\
    // F:\FL\Kits\Swizz Beats Kit\
    // F:\FL\Kits\Extra\
    // F:\FL\Kits\Music - Zaytoven Kits and More
    "Producer Drum Kits (Selective Sync Conflict)/",
    // "Producer Drum Kits/",
    // "Rock Drum Kit/",
    // "Techno Sound Pack/",
    // "Swizz Beats Kit/",
    // "Extra/",
    // "Music - Zaytoven Kits and More/",
  ];
  for (let index = 0; index < paths.length; index++) {
    const path = paths[index];
    const ids = await client.graphql({
      query: listSamples,
      variables: {
        limit: 1000000,
        filter: {
          s3Path: {
            beginsWith: path,
          },
        },
      },
    });
    console.log(path, ids.data.listSamples.items.length);
return
    for (let index = 0; index < ids.data.listSamples.items.length; index++) {
      const item = ids.data.listSamples.items[index];
      const result = await client.graphql({
        query: deleteSample,
        variables: {
          input: { id: item.id },
        },
      });
      console.log(`Deleted => ${result.data.deleteSample.id} from database`);
    }
  }
};
const deleteAllSampleQs = async () => {
  const ids = await client.graphql({
    query: listSamples,
  });
  for (let index = 0; index < ids.data.listSamples.items.length; index++) {
    const item = ids.data.listSamples.items[index];
    const result = await client.graphql({
      query: deleteSample,
      variables: {
        input: { id: item.id },
      },
    });
    console.log(`Deleted => ${result.data.deleteSample.id} from database`);
  }

  ids.data.listSamples.items.forEach(async (item: any) => {
    const result = await client.graphql({
      query: deleteSample,
      variables: {
        input: { id: item.id },
      },
    });
    console.log(`Deleted => ${result.data.deleteSample.id} from database`);
  });
};
const uploadDataToS3 = async (filePath: string, s3Path: string, mockUploadData: boolean = false) => {
  let result: any;
  if(mockUploadData){
    new Promise((resolve) => setTimeout(resolve, 1000));
    return {result:"mock", status:200};
  }
  try {
    const res = await uploadData({
      key: s3Path,
      data: fs.readFileSync(filePath),
      options: {
        accessLevel: "guest",
        contentType: "audio/wav",
      },
    });
    
    result =  {result:await res.result, status:200};
    console.log("file uploaded to s3", result);
    
  } catch (error) {
    console.log(error);
    result = {result:error, status:500};
  }
  return result;
};
const enterSampleData = async (sampleData: SampleTypes.Sample) => {
  let stored: any;
  try {
    const result = await client.graphql({
      query: createSample,
      variables: {
        input: {
          name: sampleData.name,
          s3Path: sampleData.s3Path,
          description: sampleData.description,
          genre: sampleData.genre,
          tags: sampleData.tags,
          drum: sampleData.drum,
          hygiene: sampleData.hygiene,
          length: sampleData.length,
          pitchRange: sampleData.pitchRange,
          mix: sampleData.mix,
          loudness: sampleData.loudness,
          decadeStyle: sampleData.decadeStyle,
          sourceGen1: sampleData.sourceGen1,
          sourceGen2: sampleData.sourceGen2,
          drumMachine: sampleData.drumMachine,
          reversed: false,
          owner: sampleData.owner,
          invalid: false,
          sampleLength: 0,
        },
      },
    });
    // console.log(result);
    stored = result.data.createSample;
  } catch (error) {
    console.log(error);
  }
  return stored;
};
const listDrumMachineName = async () => {
  const location = "F:\\FL\\Kits\\Extra\\extrabeats\\Akai 32 Drum Kits";
  fs.readdir(location, (err, files) => {
    console.log(files);
  });
};
const testDrumMachineCheck = async () => {
  const location =
    "F:\\FL\\Kits\\Extra\\extrabeats\\Akai 32 Drum KitsAlesis-HR16b";
  let testSample: SampleTypes.Sample = {
    name: "test",
    s3Path: "test",
    reversed: false,
    invalid: false,
  };
  testSample = await checkForDrumMachineName(location, testSample);
  console.log(testSample);
};
const update808s = async () => {
  const list = await client.graphql({
    query: listSamples,
    variables: {
      limit: 1000000,
      filter: {
        drumMachine: {
          eq: "tr808",
        },
      },
      
    },
  });
  console.log(list.data.listSamples.items);

  for (let index = 0; index < list.data.listSamples.items.length; index++) {
    const item = list.data.listSamples.items[index];
    if(item.s3Path.toLocaleLowerCase().includes("bd") || item.s3Path.includes("kic") || item.s3Path.includes("kd")){
      item.drum = SampleTypes.Drum.kick
    }
   else if(item.s3Path.includes("sd") || item.s3Path.includes("sna") || item.s3Path.toLocaleLowerCase().includes("sn")){
      item.drum = SampleTypes.Drum.snare
    }
    else if(item.s3Path.toLocaleLowerCase().includes("ch") || item.s3Path.includes("hh") || item.s3Path.includes("hat")){
      item.drum = SampleTypes.Drum.chat
    }
    else if(item.s3Path.toLocaleLowerCase().includes("cl") || item.s3Path.includes("cv") ){
      item.drum = SampleTypes.Drum.clave
    }
    else{
      item.drum = null
    }

    const result = await client.graphql({
      query: updateSample,
      variables: {
        input: { id: item.id, drumMachine: "tr808", drum: item.drum },
      },
    });
    console.log(`updated ${result.data.updateSample.id} to tr808`);
    new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
const checkForDrumMachineName = async (
  fileName: string,
  sampleRef: SampleTypes.Sample
) => {
  const drumMachineNames = [
    "01w-drums",
    "505-707-727",
    "Alesis-HR16b",
    "Boss-DR-110-DrRhythm",
    "bossdr55",
    "CasioSK-1",
    "CasioVL-1",
    "CR68-MSXKit",
    "cr78-ma101",
    "CrashCymbals",
    "D70Drums",
    "ddd1-kpr77",
    "Dr550",
    "Drumulator",
    "emu_sp12",
    "KAWAI-R-50e",
    "korgmini",
    "kpr77-ddm",
    "kr33",
    "Kr55b",
    "linn9000",
    "oberheim",
    "OberhiemDMX- LN2-TOM",
    "R8Drums",
    "Roland-Cr-78",
    "Roland-DR55-110-220",
    "RolandDR-550mkII",
  ];
  console.log(`checking ${fileName} for drum machine name`);
  for (let index = 0; index < drumMachineNames.length; index++) {
    const name = drumMachineNames[index];
    if (fileName.includes(name)) {
      sampleRef.drumMachine = name as SampleTypes.DrumMachine;
      return sampleRef;
    } else if (fileName.includes("808")) {
      sampleRef.drumMachine = SampleTypes.DrumMachine.tr808;
      return sampleRef;
    } else if (fileName.includes("909")) {
      sampleRef.drumMachine = SampleTypes.DrumMachine.tr909;
      return sampleRef;
    } else if (fileName.includes("707")) {
      sampleRef.drumMachine = SampleTypes.DrumMachine.tr707;
      return sampleRef;
    }
  }
  return sampleRef;
};
const populateSampleFields = async (
  fileName: string,
  name: string,
  s3Path: string
) => {
  return new Promise<SampleTypes.Sample>((resolve, reject) => {
    //let type: SampleTypes.Drum | undefined = undefined;
    let newSample: SampleTypes.Sample = {
      name,
      s3Path,
      reversed: false,
      invalid: false,
    };

    const possibleDrumTypeNames = [
      "kick",
      "sub",
      "boom",
      "snare",
      "snr",
      "sd",
      "bd",
      "tom",
      "cong",
      "hat",
      "cym",
      "perc",
      "vox",
      "voc",
      "shaker",
      "clap",
      "clave",
      "clp",
      "rim",
      "ride",
      "crash",
      "crsh",
      "stick",
      "loop",
      "sample loop",
      "808",
      "909",
      "bass",
      "fx",
      "gtr",
      "clapz",
      "snz",
      "kikz",
      "kickz",
      "hatz",
      "soundz",
      "sound's",
    ];
    let done = false;
    for (let i = 0; i < possibleDrumTypeNames.length; i++) {
      if (done) {
        resolve(newSample);
      }
      const drumTypeName = possibleDrumTypeNames[i];
      //type = SampleTypes.Drum.bell
      if (fileName.toLocaleLowerCase().includes(drumTypeName)) {
        done = true;
        //console.log(drumTypeName);
        switch (drumTypeName) {
          case "kick":
            newSample.drum = SampleTypes.Drum.kick;

            break;
          case "boom":
            newSample.drum = SampleTypes.Drum.sub;

            break;
          case "bd":
            newSample.drum = SampleTypes.Drum.kick;

            break;
          case "snare":
            newSample.drum = SampleTypes.Drum.snare;

            break;
          case "snr":
            newSample.drum = SampleTypes.Drum.snare;

            break;
          case "sd":
            newSample.drum = SampleTypes.Drum.snare;

            break;
          case "tom":
            newSample.drum = SampleTypes.Drum.tom;

            break;
          case "cong":
            newSample.drum = SampleTypes.Drum.conga;

            break;
          case "hat":
            newSample.drum = SampleTypes.Drum.chat;

            break;
          case "cym":
            newSample.drum = SampleTypes.Drum.cymbal;

            break;
          case "perc":
            newSample.drum = SampleTypes.Drum.perc;

            break;
          case "vox":
            newSample.drum = SampleTypes.Drum.femvox;

            break;
          case "voc":
            newSample.drum = SampleTypes.Drum.malevox;

            break;
          case "shaker":
            newSample.drum = SampleTypes.Drum.shaker;

            break;
          case "clap":
            newSample.drum = SampleTypes.Drum.clap;

            break;
          case "clave":
            newSample.drum = SampleTypes.Drum.clave;

            break;
          case "clp":
            newSample.drum = SampleTypes.Drum.clap;

            break;
          case "rim":
            newSample.drum = SampleTypes.Drum.rim;

            break;
          case "ride":
            newSample.drum = SampleTypes.Drum.ride;

            break;
          case "crash":
            newSample.drum = SampleTypes.Drum.cymbal;

            break;
          case "crsh":
            newSample.drum = SampleTypes.Drum.cymbal;

            break;
          case "stick":
            newSample.drum = SampleTypes.Drum.stick;

            break;
          case "loop":
            newSample.drum = SampleTypes.Drum.loop;

            break;
          case "sample loop":
            newSample.drum = SampleTypes.Drum.stick;

            break;
          // case "fx":
          //   newSample.drum = SampleTypes.Drum.;

          //   break;
          // case "gtr":
          //   newSample.drum = SampleTypes.Drum.stick;

          //   break;
          case "stick":
            newSample.drum = SampleTypes.Drum.stick;

            break;
          // case "808":
          //   newSample.drum = SampleTypes.Drum.sub;
          //   //newSample.

          //   break;
          // case "909":
          //   newSample.drum = SampleTypes.Drum.kick;

          //   break;
          case "bass":
            newSample.drum = SampleTypes.Drum.sub;

            break;
          case "clapz":
            newSample.drum = SampleTypes.Drum.clap;

            break;
          case "snz":
            newSample.drum = SampleTypes.Drum.snare;

            break;
          case "kikz":
            newSample.drum = SampleTypes.Drum.kick;

            break;
          case "kickz":
            newSample.drum = SampleTypes.Drum.kick;

            break;
          case "hatz":
            newSample.drum = SampleTypes.Drum.chat;

            break;
          case "soundz":
            newSample.drum = SampleTypes.Drum.sample;

            break;
          case "sound's":
            newSample.drum = SampleTypes.Drum.sample;

            break;

          default:
            break;
        }
      }
    }
    resolve(newSample);
  });
};
const resetInvalids = async () => {
  const list = await client.graphql({
    query: listSamples,
    variables: {
      limit: 10000,
      filter: {
        invalid: {
          eq: true,
        },
      },
    },
  });
  console.log(list.data.listSamples.items);

  for (let index = 0; index < list.data.listSamples.items.length; index++) {
    const item = list.data.listSamples.items[index];
    const result = await client.graphql({
      query: updateSample,
      variables: {
        input: { id: item.id, invalid: false },
      },
    });
    console.log(`reset ${result.data.updateSample.id} to valid`);
  }
};
const s3Test = async () => {
  // const result = await list({
  //   prefix: "testfolder/",
  //   options: { accessLevel: "guest", listAll: false },
  // });
  // console.log("result", result);

  // const result = await getUrl({key: "test.wav", options: {accessLevel: "guest"}})
  // console.log(result.url.href)

  try {
    const testSample = await uploadData({
      key: `public/test${Date.now()}.wav}`,
      data: fs.readFileSync(
        "F:\\FL\\Kits\\9th Wonder Drum Kit\\Cymbals\\CL_OHH1.wav"
      ),
      options: {
        accessLevel: "guest",
        contentType: "audio/wav",
      },
    });

    console.log(await testSample.result);
  } catch (error) {
    console.log(error);
  }
};

async function processSamples() {
 // const base = "C:\\Users\\Administrator\\Downloads\\Downloads\\SPECIAL KITS\\";
//const base = "F:\\FL\\Kits\\";

const base = "C:\\Users\\Administrator\\Downloads\\Downloads\\sk2"

// createLocalSampleListJson(base);
// new Promise((resolve) => setTimeout(resolve, 3000));
// return

  const jsonFile = "sampleList.json";
  const samples: string[] = JSON.parse(
    fs.readFileSync(jsonFile, "utf8")
  );
  let newSamples: string[] = samples; //for writing new json obj

  const limit = 500;
  const mockUpload = true;

  for (let counter = 0; counter < samples.length; counter++) {
    const sample = samples[counter];
    if (counter >= limit) {
      return;
    }

    // const qcheck = await querySample(sample);
    // if(qcheck.length > 0){
    //   console.log("found in db...")
    //   //return;
    //   for (let index = 0; index < qcheck.length; index++) {
    //     const element = qcheck[index];
    //     console.log(`Deleting ${element.name} from database...`);
    //     const deleted = await client.graphql({
    //       query: deleteSample,
    //       variables: {
    //         input: { id: element.id },
    //       },
    //     });
    //     console.log(
    //       `Deleted wrong format from => ${deleted.data.deleteSample.id} from database`
    //     );

    //     try {
    //       const result = await deleteFromS3(element.s3Path);
    //       console.log(`Deleted from S3 => ${result}`);
    //     } catch (error) {
    //       console.log(error);
    //     }
       

    //     new Promise((resolve) => setTimeout(resolve, 10000));
    //   }
    // }

    console.log(`_________________Starting ${sample}_________________`);
    if(mockUpload){
      console.log("MOCK UPLOAD SET....DATA WILL NOT BE ADDED TO S3");
      console.log("MOCK UPLOAD SET....DATA WILL NOT BE ADDED TO S3");
      console.log("MOCK UPLOAD SET....DATA WILL NOT BE ADDED TO S3");
    }

    if (sample.toLowerCase().includes(".wav")) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      let s3Path = sample.replace(base, "").replace(/\\/g, "/");
       s3Path = sample.replace(base, "").replace(/\\/g, "/");
      const sampleName = sample.split("\\")[sample.split("\\").length - 1];
      console.log("s3Path = ", s3Path);

      let newSample = await populateSampleFields(sample, sampleName, s3Path);
      newSample = await checkForDrumMachineName(sample, newSample);
      console.log("newSample = ", newSample);
    
       //return

      const check = await querySample(s3Path);
      if (check.length > 0) {
        for (let index = 0; index < check.length; index++) {
          const element = check[index];
          console.log(`Deleting ${element.name} from database...`);
          const deleted = await client.graphql({
            query: deleteSample,
            variables: {
              input: { id: element.id },
            },
          });
          console.log(
            `Deleted => ${deleted.data.deleteSample.id} from database`
          );
          new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }

      console.log("drumtype = ", newSample.drum);

      try {
        const finished = await uploadDataToS3(sample, s3Path, mockUpload);
        if(finished?.status === 200){
          console.log(`Uploaded => ${finished} to S3`);

        const result = await enterSampleData(newSample);
        console.log(`Added => ${result.name} to database`);
        }else{
          console.log(`Error uploading ${sample} to S3`);
          fs.appendFile('missing.txt', sample,{encoding:'utf8'}, function (err) {});
        }
        
      } catch (error) {
        console.log(error);
      }
    }

    console.log("counter = ", counter);
    console.log(`Deleting ${sample} from ${jsonFile}...`);
    newSamples.splice(counter, 1);
    fs.writeFileSync(jsonFile, JSON.stringify(newSamples));
    console.log(`Ending Loop ${counter}...`);
  }
}

//createTestSample()
//s3Test()

//uploadDataToS3("F:\\FL\\Kits\\ultimate_producers_drum_kits\\Pack 5\\P5Audio Kit\\DnB Kit 1\\kickldk04.wav", "ultimate_producers_drum_kits/Pack 5/P5Audio Kit/DnB Kit 1/kickldk04.wav")

//deleteSelectSampleQs()
//processSamples();
update808s();

//resetInvalids();

//testDrumMachineCheck()
//listDrumMachineName()

//querySample("9th Wonder Kit/kick3.wav");
//queryAll()
//deleteAllSampleQs()
//queryAll()
//createLocalSampleListJson();
