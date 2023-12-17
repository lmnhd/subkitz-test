import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import {
  list,
  getUrl,
  downloadData,
  uploadData,
  UploadDataInput,
  UploadDataOutput,
} from "aws-amplify/storage";
import { createSample, deleteSample, updateSample } from "./graphql-old/mutations";
import recursive from "recursive-readdir";
import fs from "fs";
import * as SampleTypes from "./interfaces";
import { listSamples } from "./graphql-old/queries";

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

const createLocalSampleListJson = async () => {
  recursive("F:/FL/Kits", ["node_modules"], (err: any, files: any) => {
    console.log(files);
    fs.writeFileSync("sampleList.json", JSON.stringify(files));
  });
};

const testAwait = async () => {
  const samples: string[] = JSON.parse(
    fs.readFileSync("sampleList.json", "utf8")
  );
  console.log(samples[0]);

  const drumtype: String | undefined = await tryToDetectDrumType(samples[0]);
  console.log("drumtype = ", drumtype);

  const result = await uploadDataToS3(samples[0], "public/awaittest/test8.wav");
  console.log("result2 = ", result);

  //return result;
};

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
const uploadDataToS3 = async (filePath: string, s3Path: string) => {
  let result: any;
  try {
    const res = await uploadData({
      key: s3Path,
      data: fs.readFileSync(filePath),
      options: {
        accessLevel: "guest",
        contentType: "audio/wav",
      },
    });

    result = await res.result;
    console.log("file uploaded to s3", result);
  } catch (error) {
    console.log(error);
    return error;
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
const tryToDetectDrumType = async (fileName: string) => {
  return new Promise<String | undefined>((resolve, reject) => {
    let type: SampleTypes.Drum | undefined = undefined;

    const possibleDrumTypeNames = [
      "kick",
      "sub",
      "boom",
      "snare",
      "snr",
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
    ];
    let done = false;
    for (let i = 0; i < possibleDrumTypeNames.length; i++) {
      if (done) {
        resolve(type);
      }
      const drumTypeName = possibleDrumTypeNames[i];
      //type = SampleTypes.Drum.bell
      if (fileName.toLocaleLowerCase().includes(drumTypeName)) {
        done = true;
        //console.log(drumTypeName);
        switch (drumTypeName) {
          case "kick":
            type = SampleTypes.Drum.kick;

            break;
          case "boom":
            type = SampleTypes.Drum.sub;

            break;
          case "snare":
            type = SampleTypes.Drum.snare;

            break;
          case "snr":
            type = SampleTypes.Drum.snare;

            break;
          case "tom":
            type = SampleTypes.Drum.tom;

            break;
          case "cong":
            type = SampleTypes.Drum.conga;

            break;
          case "hat":
            type = SampleTypes.Drum.chat;

            break;
          case "cym":
            type = SampleTypes.Drum.cymbal;

            break;
          case "perc":
            type = SampleTypes.Drum.perc;

            break;
          case "vox":
            type = SampleTypes.Drum.femvox;

            break;
          case "voc":
            type = SampleTypes.Drum.malevox;

            break;
          case "shaker":
            type = SampleTypes.Drum.shaker;

            break;
          case "clap":
            type = SampleTypes.Drum.clap;

            break;
          case "clave":
            type = SampleTypes.Drum.clave;

            break;
          case "clp":
            type = SampleTypes.Drum.clap;

            break;
          case "rim":
            type = SampleTypes.Drum.rim;

            break;
          case "ride":
            type = SampleTypes.Drum.ride;

            break;
          case "crash":
            type = SampleTypes.Drum.cymbal;

            break;
          case "crsh":
            type = SampleTypes.Drum.cymbal;

            break;
          case "stick":
            type = SampleTypes.Drum.stick;

            break;

          default:
            break;
        }
      }
    }
    resolve(type);
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
  const samples: string[] = JSON.parse(
    fs.readFileSync("sampleList.json", "utf8")
  );
  let newSamples: string[] = samples;

  const limit = 1000;
  for (let counter = 0; counter < samples.length; counter++) {
    const sample = samples[counter];
    if (counter >= limit) {
      return;
    }
    console.log(`_________________Starting ${sample}_________________`);

    if (sample.toLowerCase().includes(".wav")) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const s3Path = sample.replace("F:\\FL\\Kits\\", "").replace(/\\/g, "/");

      console.log("s3Path = ", s3Path);
      //return
      const check = await querySample(s3Path);
      if (check.length > 0) {
        console.log("sample already exists");
        // newSamples.splice(counter, 1);
        // fs.writeFileSync("sampleList.json", JSON.stringify(newSamples));
      } else {
        const drumtype: String | undefined = await tryToDetectDrumType(sample);
        console.log("drumtype = ", drumtype);
        const data: SampleTypes.Sample = {
          name: sample.split("\\")[sample.split("\\").length - 1],
          s3Path,
          drum: drumtype as SampleTypes.Drum,
          reversed: false,
          invalid: false,
        };
        try {
          const finished = await uploadDataToS3(sample, s3Path);
          console.log(`Uploaded => ${finished} to S3`);
          const result = await enterSampleData(data);
          console.log(`Added => ${result.name} to database`);
        } catch (error) {
          console.log(error);
        }
      }
    }
    console.log("counter = ", counter);
    console.log(`Deleting ${sample} from sampleList.json...`);
    newSamples.splice(counter, 1);
    fs.writeFileSync("sampleList.json", JSON.stringify(newSamples));
    console.log(`Ending Loop ${counter}...`);
  }
}

//createTestSample()
//s3Test()

//uploadDataToS3("F:\\FL\\Kits\\ultimate_producers_drum_kits\\Pack 5\\P5Audio Kit\\DnB Kit 1\\kickldk04.wav", "ultimate_producers_drum_kits/Pack 5/P5Audio Kit/DnB Kit 1/kickldk04.wav")

processSamples();
//resetInvalids();

//querySample("9th Wonder Kit/kick3.wav");
//queryAll()
//deleteAllSampleQs()
//queryAll()
//createLocalSampleListJson();
