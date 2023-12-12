import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AmplifyGraphqlApi, AmplifyGraphqlDefinition } from '@aws-amplify/graphql-api-construct';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class GqlStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const amplifyApi = new AmplifyGraphqlApi(this, 'KitzGQLAPI', {
      definition: AmplifyGraphqlDefinition.fromFiles(
        path.join(__dirname, 'schema.graphql')),
        authorizationModes: {
          defaultAuthorizationMode: 'API_KEY',
          apiKeyConfig: {
            expires: cdk.Duration.days(30)
          }
        }
      
    })
    // example resource
    // const queue = new sqs.Queue(this, 'GqlQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
