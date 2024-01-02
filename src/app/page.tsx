"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../public/subkitz_waves.png";
import Link from "next/link";
import { Button } from "@aws-amplify/ui-react";
import { generateClient } from "@aws-amplify/api";
import { Amplify } from "aws-amplify";

function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-8 my-8">
      <Link
      href={`/soundlibrary`}
      >
        <p className={`text-3xl text-indigo-500 animate-pulse `}>
          sound repository
        </p>
      </Link>
      <Image src={logo} alt="subkitz logo" width={500} height={300} />
      <Link href={`/kitlab`}>
        <p className={`text-3xl text-lime-500 animate-pulse`}>
          beat laboratory
        </p>
      </Link>
    </main>
  );
}
export default Home;
//export default Home;
