"use client";
import { Context, createContext, useEffect, useState } from "react";
import { Sample } from "@/API";
import * as SampleTypes from "../../ADMINISTRATION/src/interfaces";
import SampleProperties from "@/components/sampleitem/sampleproperties";
import { dynamoQueryScanProps, getListFromDynamo } from "@/lib/s3";

export const KitzContext:Context<SoundListProps | any> = createContext({items:[],drumType: undefined,lastEvaluatedKey:undefined});
export type SoundListProps = {
  items: Sample[];
  drumType?: SampleTypes.Drum | undefined;
  lastEvaluatedKey?: string;
};
export const KitzProvider = ({ children }: { children: React.ReactNode }) => {
  const [soundList, setSoundList] = useState<SoundListProps>({
    items: [],
    drumType: undefined,
  });

  useEffect(() => {
    const load = async () => {
      // const sampleList: SoundListProps = await getUnCategorizedList(50);
      const props: dynamoQueryScanProps = {
        drumType: SampleTypes.Drum.kick,
        //limit: 50,
      };

      const sampleList: SoundListProps = await getListFromDynamo();

      // while (sampleList.lastEvaluatedKey) {
      //   const nextList = await getListFromDynamo(
      //     sampleList.lastEvaluatedKey
      //   );
      //   sampleList.items = [...sampleList.items, ...nextList.items];
      //   sampleList.lastEvaluatedKey = nextList.lastEvaluatedKey;
      // }

      setSoundList(sampleList);

      console.log("sampleList", sampleList);

      if (sampleList.items.length === 0) {
        return;
      }
    };
    load();
  }, []);
  return <KitzContext.Provider value={{
    soundList,
    setSoundList
  }}>{children}</KitzContext.Provider>;
};

