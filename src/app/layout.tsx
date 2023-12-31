import type { Metadata } from "next";
import Navbar from "@/components/navbar";

import { KitzContext, KitzProvider } from "@/lib/kitzcontext";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { Dhurjati } from "next/font/google";
import "./globals.css";
import { ClockProvider } from "@/components/sequencer/clockcontext";

// Amplify.configure({
//   Auth: {
//     Cognito: {
//       userPoolId: "us-east-1_Kp6ZfnG0v",
//       allowGuestAccess: true,
//       identityPoolId: "us-east-1:54569dbe-1dcf-4deb-a6d3-d5b799ecc637",
//       userPoolClientId: "7dcgmdsj20jgfdhuk3egso5huo",
//       loginWith: { username: true, email: true },
//     },
//   },
//   API: {
//     GraphQL: {
//       endpoint:

//         "https://m27uptzxtzav7cooltu26qfdpa.appsync-api.us-east-1.amazonaws.com/graphql",
//       region: "us-east-1",
//       defaultAuthMode: "apiKey",
//       apiKey: "da2-x5h2lmi54jbnfk6znwohqweqou",
//     },
//   },
//   Storage: {
//     S3: {
//       bucket: "subrepo-samples-bucket",
//       region: "us-east-1",
//       //dangerouslyConnectToHttpEndpointForTesting: 'true',
//     },
//   },
// });
const dhurjati = Dhurjati({ subsets: ["latin"], weight: ["400"] });
//const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Subkitz",
  description: "organize your noise!",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ClockProvider>
        <KitzProvider>
          <body
            className={`bg-gradient-to-b from-slate-950 to-slate-800 ${dhurjati.className}`}
          >
            <Navbar />
            {children}
          </body>
        </KitzProvider>
      </ClockProvider>
    </html>
  );
}

export default RootLayout;
