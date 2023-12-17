'use server'

import { createSample, deleteSample, updateSample } from '../../graphql/mutations.js';
import {Amplify} from "aws-amplify";
import { listSamples } from "../../graphql/queries.js";
import { downloadToMemory, getList, getS3URL } from "../../lib/s3.js";


export const test = async () => {
    console.log('test')
}
