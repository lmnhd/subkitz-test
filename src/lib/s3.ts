"use server"
import { Amplify } from 'aws-amplify'

import { list, getUrl, downloadData, uploadData } from "aws-amplify/storage";
import { generateClient } from 'aws-amplify/api';
import { getSample, listSamples } from '@/graphql/queries';
import { SampleType } from '../../ADMINISTRATION/src/interfaces';
import { updateSample } from '@/graphql/mutations';
import * as SampleTypes from '../../ADMINISTRATION/src/interfaces'
import { Sample } from '@/API';
import fs from 'fs';

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

  const client = generateClient();
export const listSamplesS3FolderContents = async (folderPath: string) => {
    const result = await list({
      prefix: folderPath, //"Base/Classic Kits/",
      options: { accessLevel: "guest",listAll: true },

    });
    console.log("result", result);
    return result.items.map((item) => {
      return item.key;
    });
}
export const getSampleFromS3 = async (s3Path: string) => {
    const result = await list({
      prefix: s3Path, //"Base/Classic Kits/",
      options: { accessLevel: "guest",listAll: true },

    });
    console.log("result", result);
    if(result.items.length == 0 ){
        fs.appendFile('missing.wav', result.items[0].key,{encoding:'utf8'}, function (err) {});
    }
     
    return result.items.map((item) => {
      return item.key;
    });
}
export const getList = async (drumType: SampleTypes.Drum = SampleTypes.Drum.snare, limit:number = 100000) => {

    //const client = generateClient();
    const results = await client.graphql({
        query: listSamples,

        variables: { 
            limit:limit ,
            filter: {
                drum: {
                    eq: drumType
                }
            }
        },
        authMode: "apiKey",
        
    
    })
    console.log(results.data.listSamples.items);
    return {items:results.data.listSamples.items, drumType:drumType};
    
  };

export const getSampleByID = async (id: string) => {
    //const client = generateClient();
    const results = await client.graphql({
        query: getSample,

        variables: { 
            id: id,
            
        },
        authMode: "apiKey",
        
    
    })
    console.log(results.data.getSample?.name);
    return results.data.getSample;
    
  };
  export const getSamplesByName = async (name: string) => {
    //const client = generateClient();
    const results = await client.graphql({
        query: listSamples,

        variables: { 
            filter: {
                name: {
                    eq: name
                }
            },
            
        },
        authMode: "apiKey",
        
    
    })
    console.log(results.data.listSamples?.items[0]?.name);
    return results.data.listSamples?.items;
  }

  export async function updateSampleData(sample:Sample){
    console.log(`attempting to update => ${sample.drum} `)
    
    const results = await client.graphql({

        query: updateSample,
        
        variables: {

            input:{
                id: sample.id,
                name: sample.name,
                description: sample.description,
                genre: sample.genre,
                tags: sample.tags,
                drum: sample.drum,
                hygiene: sample.hygiene,
                length: sample.length,
                pitchRange: sample.pitchRange,
                mix: sample.mix,
                loudness: sample.loudness,
                decadeStyle: sample.decadeStyle,
                sourceGen1: sample.sourceGen1,
                sourceGen2: sample.sourceGen2,
                reversed: sample.reversed,
                invalid: sample.invalid,
                sampleLength: sample.sampleLength,
                owner: sample.owner,
                //createdAt: sample.createdAt,
                //updatedAt: sample.updatedAt,
            }


        },
        authMode: "apiKey",
        
    
    })
    console.log(results.data.updateSample.id);
    return results.data.updateSample.id;
  }
  export async function downloadToMemory(s3Path: string){
    const { body, eTag } = await downloadData({
        key: '9th Wonder Kit/hat1.wav',
        options: {
            accessLevel: 'guest',
        },
    }).result;

    
    return (await body.blob()).arrayBuffer();
    
    
}

export async function getS3URL(s3Path: string){
   try {
    const { url } = await getUrl({
        key: s3Path,
        options: {
            accessLevel: 'guest',
            validateObjectExistence: true
        }
    })
    return url.href;
   } catch (error) {
    return null;
   }
}

export async function check( ){
    
    // const _list = await list({
    //     prefix: '9th Wonder Kit/',
    
    //     options: {accessLevel: 'guest', listAll: true},
    // });
    // console.log(_list);

    //return


    const path = 'public/606cymb.wav'
    const path2 = '9th Wonder Kit/hat1.wav'

    const getUrlResult = await getUrl({
        key: path2,
        options: {
            accessLevel: 'guest',
            validateObjectExistence: true
        }
    })
    console.log(getUrlResult);

    // try {
    //     const result = await uploadData({
    //         key: '606cymb.wav',
    //         data: path,
    //         options: {
    //             accessLevel: 'guest',
    //         }
    //     }).result;
    //     console.log(result);
    // } catch (error) {
    //     console.log(error);
    // }
    // console.log("Server");
}
export const uploadDataInBrowser = async (event:any) => {
    console.log("event =", event)
    try {
        if (event?.target?.files) {
            const file = event.target.files[0];
            uploadData({
              key: 'test.wav',
              data: file
            });
            console.log("file uploaded")
          }
    } catch (error) {
        console.log(error);
    }
}