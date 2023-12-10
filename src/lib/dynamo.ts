"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/../amplify/data/resource";
import { Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';

Amplify.configure(config);


export const dbClient = async () => {
    const client = generateClient<Schema>()
    //console.log(client.models.Sample)

// const { errors, data: newSample } = await client.models.Sample.create({
//     name: "My first sample",
//     description: "This is my first sample",
// })

    //console.log(newSample)

    const { data: samples } = await client.models.Sample.list()
    console.log(samples)
    // return client;
} // use this Data client for CRUDL requests