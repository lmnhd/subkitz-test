#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MultistackStack } from '../lib/multistack-stack';

const app = new cdk.App();
new MultistackStack(app, 'MyWestCdkStack', {
  env: { region: 'us-west-1'},
  encryptBucket: true
});

new MultistackStack(app, 'MyEastCdkStack', {
  env: { region: 'us-east-1'},
  encryptBucket: false
});

app.synth();