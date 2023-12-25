import { Amplify } from "aws-amplify";

export const amplifyConfigure = async () => {
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
}