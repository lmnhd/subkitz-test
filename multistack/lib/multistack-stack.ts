import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
interface MultistackStackProps extends cdk.StackProps {
  encryptBucket?: boolean;
}

export class MultistackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: MultistackStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    if (props && props.encryptBucket) {
      new s3.Bucket(this, 'SamplesBucket', {
        encryption: s3.BucketEncryption.KMS_MANAGED,
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });
    } else {
      new s3.Bucket(this, 'SamplesBucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY
      });
    }
    // example resource
    // const queue = new sqs.Queue(this, 'MultistackQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
