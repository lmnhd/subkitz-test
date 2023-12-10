import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rules below
specify that owners, authenticated via your Auth resource can "create",
"read", "update", and "delete" their own records. Public users,
authenticated via an API key, can only "read" records.
=========================================================================*/

const schema = a.schema({
  
  Sample: a
    .model({
      name: a.string(),
      s3Path: a.string(),
      description: a.string(),
      Genre: a.enum([
        "hiphop",
        "trap",
        "rnb",
        "pop",
        "rock",
        "jazz",
        "soul",
        "funk",
        "electronic",
        "experimental",
        "world",
        "fx",
      ]), //hiphop, trap, rnb, pop, rock, jazz, soul, funk, electronic, experimental, world, fx
      tags: a.string().array(),
      drum: a.enum([
        "sub",
        "kick",
        "snare",
        "ohat",
        "chat",
        "cymbal",
        "tom",
        "perc",
        "shaker",
        "clave",
        "stick",
        "bell",
        "conga",
        "whistle",
        "femvox",
        "malevox",
        "clap",
        "ride",
        "rim",
        "nome",
      ]), 
      //sub, kick, snare, hat, cymbal, tom, perc
      hygiene: a.enum(["clean", "dirty"]), //clean, dirty
      length: a.enum(["short", "mid", "long"]), //short, mid, long
      pitchRange: a.enum(["low", "mid", "high"]), //low, mid, high
      //genres: a.hasMany("string"), //hiphop, trap, rnb, pop, rock, jazz, soul, funk, electronic, experimental, world, fx
      mix: a.enum(["dry", "wet"]), //dry, wet
      loudness: a.enum(["soft", "mid", "loud"]), //soft, mid, loud
      decadeStyle: a.enum([
        "fifties",
        "sixties",
        "seventies",
        "eighties",
        "nineties",
        "twothousands",
        "tens",
        "twenties",
        "thirties",
        "spaceage"
      ]), //50s, 60s, 70s, 80s, 90s, 00s, 10s, 20s
      sourceGen1: a.enum(["analog", "digital"]), //analog, digital
      sourceGen2: a.enum(["organic", "synthetic"]), // organic, synthetic
      reversed: a.boolean().default(false),
    })
    .authorization([a.allow.owner(), a.allow.public().to(["read"]),
  a.allow.public().to(["update"])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    allowListedRoleNames: ["admin", "editor", "contributor"],
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
