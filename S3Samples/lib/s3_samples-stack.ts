import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class S3SamplesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new s3.Bucket(this, 'subrepo-samples-bucket', {
      bucketName: 'subrepo-samples-bucket',
      //accessControl: s3.BucketAccessControl.PUBLIC_READ_WRITE,
      //objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,

      //blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      //cors:
//       [
//     {
//       "AllowedHeaders": [
//           "*"
//       ],
//       "AllowedMethods": [
//           "GET",
//           "HEAD",
//           "PUT",
//           "POST",
//           "DELETE"
//       ],
//       "AllowedOrigins": [
//           "*"
//       ],
//       "ExposeHeaders": [
//           "x-amz-server-side-encryption",
//           "x-amz-request-id",
//           "x-amz-id-2",
//           "ETag"
//       ],
//       "MaxAgeSeconds": 3000
//   }
// ]
      publicReadAccess: true,
      //removalPolicy: cdk.RemovalPolicy.DESTROY,
      
      
      
    })
    // example resource
    // const queue = new sqs.Queue(this, 'S3SamplesQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
