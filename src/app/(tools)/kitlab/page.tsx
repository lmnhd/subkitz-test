"use client";
import React, { useContext, useEffect, useState } from "react";
import * as Tone from "tone";
import * as SampleTypes from "../../../../ADMINISTRATION/src/interfaces";
import SampleProperties from "@/components/sampleitem/sampleproperties";
import {
  Disc2Icon,
  DivideSquare,
  FileIcon,
  PlayCircle,
  PlayCircleIcon,
  StopCircle,
  TornadoIcon,
  UploadIcon,
} from "lucide-react";

import LedStrip from "@/components/sequencer/ledstrip";
import { KitzContext, KitzProvider } from "@/lib/kitzcontext";
import {
  getAllStepPatternSaves,
  getS3URL,
  saveStepPatternToDynamo,
} from "@/lib/s3";
import SampleLoader from "@/components/sequencer/sampleloader";
import { SoundListProps } from "@/lib/kitzcontext";
import { Button } from "@aws-amplify/ui-react";
import TempoControl from "@/components/sequencer/tempocontrol";
import useSmoothHorizontalScroll from "use-smooth-horizontal-scroll";
import { on } from "events";
import SequencerSteps from "@/components/sequencer/sequencersteps";
import SequencePanel from "@/components/sequencer/sequencepanel";
import {
  Step,
  SequenceGroup,
  SequenceRow,
  SampleID,
} from "@/components/sequencer/sequencertypes";
import { ClockContext } from "@/components/sequencer/clockcontext";
import waves from "../../../../public/subkitz_waves.png";
import Image from "next/image";
import { Sample } from "@/API";
import { getDateAsIDString } from "@/lib/utils";
import { StepPatternSave, StepPatternSaves } from "@/saves/steppatternsaves";

export default function KitLab() {
  const {
    soundList,
    setSoundList,
  }: { soundList: SoundListProps; setSoundList: any } = useContext(KitzContext);
  const [currentUser, setCurrentUser] = useState<any>({ id: "admin" });

  const [numSequences, setNumSequences] = useState<number>(2);

  const [mixerVolumes, setMixerVolumes] = useState<number[]>([]);

  const [currentSamples, setCurrentSamples] = useState<Sample[]>([]);
  const [drumTypes, setDrumTypes] = useState<string[]>([]);
  const [currentBPM, setCurrentBPM] = useState<number>(100);
  const [currentSequence, setCurrentSequence] = useState<number>(0);
  const [nextSequence, setNextSequence] = useState<number>(-1);
  const [patternPlay, setPatternPlay] = useState<number>(1); //all, single, random;
  const [stepPatternSaves, setStepPatternSaves] = useState<StepPatternSaves>(
    []
  );

  const [copiedRow, setCopiedRow] = useState<SequenceRow>([]);
  const [savedKitsList, setSavedKitsList] = useState<any[]>([]);
  const [currentSavedKitID, setCurrentSavedKitID] = useState<string>("");
  const [currentSavedKitName, setCurrentSavedKitName] = useState<string>("");

  const [samplesToLoadOnCreate, setSamplesToLoadOnCreate] = useState<any>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const [scroll, setScroll] = useState<boolean>(false);
  const {
    currentStep,
    setCurrentStep,
    sequenceContextPattern,
    numRows,
    numSteps,
    players,
    sequences,
    setNumRows,
    setNumSteps,
    setPlayers,
    setSequences,
    isPlaying,
    setIsPlaying,
    sampleIDs,
    setSampleIDs,
  }: {
    currentStep: number;
    setCurrentStep: any;
    sequenceContextPattern: any;
    sequences: SequenceGroup[];
    setSequences: any;
    players: Tone.Player[];
    setPlayers: any;
    numSteps: number;
    setNumSteps: any;
    numRows: number;
    setNumRows: any;
    isPlaying: boolean;
    setIsPlaying: any;
    sampleIDs: { id: string; index: number }[];
    setSampleIDs: any;
  } = React.useContext(ClockContext);
  const { scrollContainerRef, handleScroll, scrollTo, isAtStart, isAtEnd } =
    useSmoothHorizontalScroll();
  const _LocalStorageKitsFileName = "Kitz-Saved-Kits";
  let index1 = 0;
  let step = 0;
  let pattern = 0;
  let isLive = false;
  let mode = 0;
  //let isPlaying = false;
  useEffect(() => {
    soundList.items.forEach((sample: any) => {
      //console.log("sample", sample);
    });
    Tone.Transport.bpm.value = currentBPM;

    for (let i = 0; i < numRows; i++) {}
    const savedKits = localStorage.getItem(_LocalStorageKitsFileName);
    if (savedKits) {
      setSavedKitsList(JSON.parse(savedKits));
    }
    const loadSequenceData = async () => {
      const _stepPatternSaves: StepPatternSaves =
        (await getAllStepPatternSaves()) as StepPatternSaves;
      if (_stepPatternSaves) {
        setStepPatternSaves(_stepPatternSaves || []);
      }
    };
    loadSequenceData();
  }, [soundList.items]);

  const startUpDrums = [
    { type: SampleTypes.Drum.kick, id: "" },
    { type: SampleTypes.Drum.snare, id: "" },

    { type: SampleTypes.Drum.clap, id: "" },
    { type: SampleTypes.Drum.chat, id: "" },
  ];
  const getStartupDrumsByIdOrRandom = () => {
    console.log("getStartupDrumByIdOrRandom", sampleIDs);
    if (soundList.items.length === 0) {
      console.log("no samples");
      return [""];
    }
    //return ""
    const result: string[][] = [];

    for (let t = 0; t < startUpDrums.length; t++) {
      const _drumType = startUpDrums[t].type;
      console.log("found drumType", _drumType);

      const randomSamples = soundList.items.filter((sample) => {
        return sample.drum === _drumType;
      });
      //now get 5 random samples for this drumtype
      const multiplesArray = [];
      for (let s = 0; s < 3; s++) {
        const randomIndex = Math.floor(Math.random() * randomSamples.length);
        multiplesArray.push(randomSamples[randomIndex]!.id);
      }

      result.push(multiplesArray);
      // setSampleIDs(multiplesArray)
      // console.log('multiplesArray', multiplesArray)
      // console.log('multiples-sampleIDs', sampleIDs)
    }
    setSamplesToLoadOnCreate(result);
    return result;
  };

  const reRandomizePlayers = async () => {
    stop();
    setPageLoading(true);
    console.log("re-randomizing players...");
    // setSamplesToLoadOnCreate([])
    // setPlayers([])
    // return;

    const _players = [...players];
    for (let i = 0; i < players.length; i++) {
      const drumType = drumTypes[i];
      const filteredSamples = soundList.items.filter((sample:Sample) => {
        return sample.drum === drumType;
      });
      const randomIndex = Math.floor(Math.random() * filteredSamples.length);
      const randomSample = filteredSamples[randomIndex]!;

      await loadPlayer(_players[i], randomSample!);
    }
    setPlayers(_players);
    setPageLoading(false);
    console.log("players", _players);
  };

  const updateSavedKitNamesInLocalStorage = (nameOfKit: string) => {
    let savedKitNames = localStorage.getItem(_LocalStorageKitsFileName);
    if (!savedKitNames) {
      savedKitNames = JSON.stringify([]);
    }
    const _savedKitNames: any[] = JSON.parse(savedKitNames);
    const _newSavedKitNames = _savedKitNames.filter((kit) => {
      return kit.name !== nameOfKit;
    });
    const savedKit = {
      name: nameOfKit,
      date: new Date(),
      id: getDateAsIDString(),
    };
    _newSavedKitNames.push(savedKit);
    localStorage.setItem(
      _LocalStorageKitsFileName,
      JSON.stringify(_newSavedKitNames)
    );
    setSavedKitsList(_newSavedKitNames);
    setCurrentSavedKitID(savedKit.id);
    setCurrentSavedKitName(savedKit.name);
    return savedKit;
  };
  const saveSequencesToLocalStorage = async () => {
    //Ask user to name the kit and store as variable
    await stop();
    setPageLoading(true);
    const kitName = prompt(
      "Please enter a name for this kit",
      currentSavedKitName ? currentSavedKitName : "My Kit 1"
    );
    if (!kitName) {
      return;
    }
    const savedKit = updateSavedKitNamesInLocalStorage(kitName);

    //create a kit object

    console.log("saveAllToLocalStorage");
    const _sequences = sequences;
    const _samples = sampleIDs;
    const _volumes = mixerVolumes;
    const _drumTypes = drumTypes;
    const _numRows = numRows;
    const _numSteps = numSteps;
    const _currentSequence = currentSequence;
    const _currentBPM = currentBPM;
    const _patternPlay = patternPlay;
    const _samplesToLoadOnCreate = samplesToLoadOnCreate;

    const _kitz = {
      tempo: currentBPM,
      sequences: _sequences,
      samples: _samples,
      volumes: _volumes,
      drumTypes: _drumTypes,
      numRows: _numRows,
      numSteps: _numSteps,
      currentSequence: _currentSequence,
      currentBPM: _currentBPM,
      patternPlay: _patternPlay,
      samplesToLoadOnCreate: _samplesToLoadOnCreate,
      id: savedKit.id,
      name: savedKit.name,
      date: savedKit.date,
    };
    localStorage.setItem(`KitzSeqSam-${savedKit.id}`, JSON.stringify(_kitz));
    setPageLoading(false);
    // setCurrentSavedKitID(savedKit.id);
    // setCurrentSavedKitName(savedKit.name);
  };

  const loadAllFromStorage = async (id: string) => {
    await stop();
    setPageLoading(true);

    console.log("loadAllFromStorage", id);
    const _kitz = JSON.parse(localStorage.getItem(`KitzSeqSam-${id}`)!);
    console.log("kitz", _kitz);
    if (_kitz) {
      setCurrentBPM(_kitz.tempo!);
      setSequences(_kitz.sequences);
      setSampleIDs(_kitz.samples);
      setMixerVolumes(_kitz.volumes);
      setDrumTypes(_kitz.drumTypes);
      setNumRows(_kitz.numRows);
      setNumSteps(_kitz.numSteps);
      setCurrentSequence(_kitz.currentSequence);
      setCurrentBPM(_kitz.currentBPM);
      setPatternPlay(_kitz.patternPlay);
      setSamplesToLoadOnCreate(_kitz.samplesToLoadOnCreate);
      setCurrentSavedKitID(_kitz.id);
      setCurrentSavedKitName(_kitz.name);
    }
    for (let i = 0; i < _kitz.samples.length; i++) {
      const sample = _kitz.samples[i] as string;
      const player = players[i];
      await loadPlayer(
        player,
        soundList.items.find((item:Sample) => item.id === sample!) ||
          soundList.items[0]!
      );
    }
    setPageLoading(false);
  };

  let timeOut: any;
  const afterTimeout = (message?: string, callBack?: any) => {
    if (message) {
      console.log(message);
    }
    if (callBack) {
      callBack();
    }
  };
  const loadPlayer = async (player: Tone.Player, sample: Sample) => {
    setPageLoading(true);
    timeOut = setTimeout(() => {
      afterTimeout("load player timed out...");
    }, 10000);
    const url = await getS3URL(sample.s3Path);
    console.log("url", url);
    try {
      await player.load(url!);
    } catch (error) {
      console.log(error);
    }
    setPageLoading(false);
  };

  const updateNumRows = async (num: number) => {
    if (num < 1) {
      return;
    } else if (num > 12) {
      return;
    }

    let rowsToAdd = 0;
    let rowsToRemove = 0;
    let newKeypads = sequences;
    if (num > numRows) {
      for (let seqNum = 0; seqNum < sequences.length; seqNum++) {
        rowsToAdd = num - numRows;
        //create new rows and add to all sequences

        for (let i = 0; i < rowsToAdd; i++) {
          const newSteps = Array(numSteps).fill(0);
          const newRow = newSteps.map((step, stepNum) => {
            return {
              rowNum: numRows + i,
              stepNum,
              selected: false,
              roll: false,
            };
          });

          newKeypads[seqNum].push(newRow);
        }

        setSequences(newKeypads);

        const newPlayers = players;
        newPlayers.push(new Tone.Player().toDestination());
        setPlayers(newPlayers);

        const newMixerVolumes = mixerVolumes;
        newMixerVolumes.push(0);
        setMixerVolumes(newMixerVolumes);

        const newDrumTypes = drumTypes;
        newDrumTypes.push("none");
        setDrumTypes(newDrumTypes);

        const newSamples = currentSamples;
        newSamples.push({} as Sample);
        setCurrentSamples(newSamples);
      }
    }
    if (num < numRows) {
      rowsToRemove = numRows - num;
      const pads = sequences;
      const tempPlayers = players;
      for (let i = 0; i < rowsToRemove; i++) {
        pads.pop();
        tempPlayers.pop();
      }
      setSequences(sequences);
      setPlayers(tempPlayers);
    }

    setNumRows(num);
  };

  const updateNumSteps = async (num: number) => {
    if (num < 1) {
      return;
    } else if (num > 32) {
      return;
    }
    setNumSteps(num);
    //await renderSteps(numRows, num);
  };

  const updatePad = (rowNum: number, stepNum: number, action: string) => {
    console.log("update pad called...", currentSequence, rowNum, stepNum);
    //console.log(keypads);
    const pad = sequences[currentSequence][rowNum][stepNum];
    if (action === "selected") {
      pad.selected = !pad.selected;
    }
    if (action === "roll") {
      pad.roll = !pad.roll;
    }

    const row = sequences[currentSequence][rowNum];
    row[stepNum] = pad;
    sequences[currentSequence][rowNum] = row;
    setSequences(sequences);
    //console.log(pad);
  };
  async function sequencePattern() {
    index1 = 0;

    Tone.Transport.scheduleRepeat(repeat, `${numSteps}n`);
    Tone.Transport.start();
  }
  const tempoChanged = (bpm: number) => {
    console.log("tempoChanged", bpm);
    if (!Tone.Transport.bpm) {
      return;
    }
    Tone.Transport.bpm.value = Math.floor(bpm);
    setCurrentBPM(Math.floor(bpm));
  };
  const setPlayMode = async () => {
    if (true) {
      await stop();
    }

    mode = patternPlay + 1;
    if (mode > 1) {
      mode = 0;
    }
    console.log("setPlayMode", mode);
    setPatternPlay(mode);
    //await new Promise((resolve) => setTimeout(resolve, 1000));
    //await play();
  };
  const handleSequenceSelected = (e: any, index: number) => {
    setNextSequence(-1);
    console.log("handleSequenceSelected", index);
    if (!isPlaying && mode === 0) {
      setCurrentSequence(index);
    } else {
      // setNextSequence(index);
      pattern = index - 1;
    }
    // if(isPlaying && mode === 0){
    //   setNextSequence(index);
    //   pattern = index - 1;
    // }
    // if(isPlaying && mode === 1){
    //   setNextSequence(index);
    //   pattern = index;
    // }
  };

  const handlePatternRowAction = async (actionName: string, row: number) => {
    console.log("handlePatternRowAction", actionName, row);

    let updatedSteps: SequenceRow = [];
    switch (actionName) {
      case "clear":
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              selected: false,
              roll: false,
            };
          }
        );
        break;
      case "copy":
        setCopiedRow(sequences[currentSequence][row]);
        break;
      case "paste":
        updatedSteps = copiedRow.map((step: Step, index: number) => {
          return {
            ...step,
            rowNum: step.rowNum,
            stepNum: step.stepNum,
            selected: false,
            roll: false,
          };
        });

        break;
      case "fill":
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: true,
              roll: false,
              localVolume: index % 2 === 0 ? 100 : 91,
            };
          }
        );
        break;
      case "sty1":
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: true,
              roll: false,
              localVolume: index % 4 === 0 ? 100 : 91,
            };
          }
        );
        break;
      case "sty2":
        const volVals2 = [103, 100, 97, 94, 91, 88];
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: true,
              roll: false,
              localVolume: volVals2[index % 6],
            };
          }
        );
        break;
      case "sty3":
        const volVals3 = [103, 100, 91];
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: true,
              roll: false,
              localVolume: volVals3[index % 3],
            };
          }
        );
        break;
      case "sty4":
        const volVals4 = [103, 100, 97, 94, 91];
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: true,
              roll: false,
              localVolume: volVals4[(Math.random() * volVals4.length - 1) | 0],
            };
          }
        );
        break;
      case "sty5":
        const volVals5 = [103, 100, 97, 94, 91, 88, 85, 82, 79];
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: true,
              roll: false,
              localVolume:
                index % 2 === 0
                  ? 100
                  : volVals5[(Math.random() * volVals5.length - 1) | 0],
            };
          }
        );
        break;
      case "step1":
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: true,
              roll: false,
              localVolume: 100,
            };
          }
        );
        break;
      case "step2":
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: index % 2 === 0 ? true : false,
              roll: false,
            };
          }
        );
        break;
      case "step4":
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: index % 4 === 0 ? true : false,
              roll: false,
            };
          }
        );
        break;
      case "step8":
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: index % 8 === 0 ? true : false,
              roll: false,
            };
          }
        );
        break;
      case "save":
        const stepsToSave = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              selected: step.selected,
              roll: step.roll,
              rowNum: -1,
            };
          }
        );
        const saved = await saveStepPatternToDynamo(
          stepsToSave,
          drumTypes[row],
          currentUser.id
        );

        const newSteps: StepPatternSave = {
          drumType: drumTypes[row],
          id: "",
          global: true,
          stepPattern: stepsToSave,
          userID: currentUser.id,
        };
        setStepPatternSaves([...stepPatternSaves, newSteps]);
        updatedSteps = newSteps.stepPattern
        console.log("saved", newSteps);
        return;
      case "load":
        updatedSteps = sequences[currentSequence][row].map(
          (step: Step, index: number) => {
            return {
              ...step,
              rowNum: step.rowNum,
              stepNum: step.stepNum,
              selected: index % 8 === 0 ? true : false,
              roll: false,
            };
          }
        );
        return;
        break;
      default:
        //Extract drum type and filter step pattern saves and set using the index
        const drumNames = Object.keys(SampleTypes.Drum);
        const _drumType = actionName.split("-")[0];
        console.log("drumType", _drumType, Number(actionName.split("-")[1]));
       
        try {
          if (drumNames.includes(_drumType)) {
            const _pattern = stepPatternSaves.filter((pattern) => {
              return pattern.drumType === _drumType;
            })[Number(actionName.split("-")[1])];
            console.log("_pattern", _pattern);
            if(!_pattern){return}
            
            const _steps:string = String(_pattern.stepPattern);
            const parsedSteps:Step[] = JSON.parse(_steps);
            if(parsedSteps.length === 0){return}
            console.log("parsedSteps", parsedSteps);
            
            updatedSteps = parsedSteps.map(
              (step: Step, index: number) => {
                return {
                  ...step,
                  rowNum: row,
                };
              }
            );
          }
        } catch (error) {
          console.log(error);
          return;
        }
        //return;
        break;
    }
    // const updatedSequences = sequences;
    // const updatedSequence = sequences[currentSequence];
    // updatedSequence[row] = updatedSteps;
    // updatedSequences[currentSequence] = updatedSequence;
    // setSequences(updatedSequences);
    const updatedSequences = [...sequences];
    updatedSequences[currentSequence][row] = [...updatedSteps];
    setSequences(updatedSequences);
  };
  const handleAddSequenceSelected = (e: any) => {
    const value = e.target.innerText;
    setNextSequence(-1);

    if (value === "+") {
      console.log("handleAddSequenceSelected", sequences);
      const newSequences = sequences;
      const refSequence = sequences[sequences.length - 1];
      const newSequence = refSequence.map((row, index: number) => {
        return row.map((step: any, index: number) => {
          return {
            ...step,
            rowNum: step.rowNum,
            stepNum: step.stepNum,
            selected: step.selected,
            roll: step.roll,
          };
        });
      });
      newSequences.push(newSequence);
      setSequences(newSequences);
      console.log("new sequences = ", newSequences);
      setNumSequences(newSequences.length);
      //setCurrentSequence(newSequences.length - 1);
    } else {
      //remove sequence
      console.log("handleRemoveSequenceSelected", sequences);
      if (sequences.length === 1) {
        return;
      }
      const newSequences = sequences.filter((sequence, index) => {
        return index !== currentSequence;
      });

      setSequences(newSequences);
      console.log("new sequences = ", newSequences);
      setNumSequences(newSequences.length);
      if (currentSequence > newSequences.length - 1) {
        setCurrentSequence(newSequences.length - 1);
      }
      //setCurrentSequence(newSequences.length - 1);
    }
  };
  const updateCurrentSequence = () => {
    //console.log("updateCurrentSequence", currentSequence, pattern);
    //console.log("isPlaying", isPlaying);
    //console.log("isLive", isLive);

    if (isLive && patternPlay === 0) {
      //all
      if (pattern < sequences.length - 1 && isLive) {
        pattern = pattern + 1;

        // if(pattern === sequences.length - 1  && currentSequence === sequences.length - 1){
        //   pattern = 0;

        // }

        if (nextSequence > -1 && nextSequence <= sequences.length - 1) {
          pattern = nextSequence;
        }

        setCurrentSequence(pattern);
        console.log(`set pattern to ${pattern}`);
      } else {
        if (pattern === sequences.length - 1 && isLive) {
          pattern = 0;
          setCurrentSequence(0);
          console.log(`set pattern to 0`);
        }
      }
    }
    if (isLive && patternPlay === 1) {
      //single/loop
      if (isLive) {
        pattern = currentSequence;
        if (nextSequence > -1 && nextSequence <= sequences.length - 1) {
          pattern = nextSequence;
        }
        setCurrentSequence(pattern);
        console.log(`looping pattern - ${pattern}`);
      }
    }

    return;
  };
  const updateStepVolume = (rowNum: number, stepNum: number, value: number) => {
    // console.log("updateStepVolume", rowNum, stepNum, value)
    // console.log("sequence values =>=>=> ",sequences[currentSequence])
    // console.log("sequence values =>=>=> ",sequences[currentSequence][rowNum])
    //console.log("sequence values =>=>=> ",sequences[currentSequence][rowNum][stepNum])
    const pad = sequences[currentSequence][rowNum][stepNum];
    console.log("pad", pad);

    const updatedSequences = [...sequences];
    updatedSequences[currentSequence][rowNum][stepNum] = {
      ...pad,
      localVolume: value,
    };
    setSequences([...updatedSequences]);
    console.log(
      "updatedPad",
      updatedSequences[currentSequence][rowNum][stepNum]
    );
  };
  function repeat(time: any) {
    // console.log("Playing Sequence ", currentSequence)
    //console.log("keypads length", keypads )
    isLive = true;
    step = index1 % numSteps;

    //setCurrentStep(step);

    for (let row = 0; row < sequences[pattern].length; row++) {
      //let note = notes[row];

      let samplePlayer: Tone.Player = players[row];
      if (!samplePlayer) {
        return;
      }
      let pad: Step = sequences[pattern][row][step];
      console.log("Repeater current pad is ==>", pad);
      //setCurrentStep(step);
      // console.log(
      //   `row ${row} step ${step} index ${index1} selected ${pad.selected} time ${time}`
      // );
      // console.log(pad);
      // console.log(time);
      // console.log(index);

      if (pad.selected) {
        //setCurrentStep(step);
        pad.isPlaying = true;
        //console.log("roll => ", pad.roll);
        //console.log(keypads[row][step]);
        if (samplePlayer.loaded) {
          const _volume = (pad.localVolume || 100) - 100;
          const mainVolume = mixerVolumes[row];
          let finalVolume = Math.floor(_volume + mainVolume);
          if (finalVolume > 6) {
            finalVolume = 6;
          }

          console.log("finalVolume", finalVolume);
          console.log("mainVolume", mainVolume);
          console.log("_volume", _volume);
          samplePlayer.volume.setValueAtTime(finalVolume, time);

          samplePlayer.start(time);

          if (pad.roll) {
            const subTick = Tone.Transport.bpm.value / 60 / 4 / 8;
            //samplePlayer.start(time + subTick)
            try {
              for (let j = 1; j < 9; j++) {
                const subTime = time + subTick * j;
                samplePlayer.start(subTime);
              }
            } catch (error) {
              console.log(error);
            }
          }

          //console.log("samplePlayer", samplePlayer.volume.value
        }
      }
      if (pad.isPlaying) {
        pad.isPlaying = false;
        //setCurrentStep(currentStep + 1);
      }
    }

    index1++;
    if (scroll) {
      scrollTo(step < Math.floor(numSteps / 1.1) ? step * 5 : -1000);
    } else {
    }
    // console.log("currentSequence", currentSequence)
    if (step === numSteps - 1) {
      //store the current sequence to state (memory) and update pattern for realtime change
      updateCurrentSequence();
      // console.log("currentSequence => ", pattern)
      // console.log(`Keypads =`,keypads)
    }

    // if(step === numSteps - 1){
    //   scrollTo(0)
    // }else{

    //   scrollTo(step *5)
    // }
  }
  async function stop() {
    //setCurrentSequence(pattern)
    await Tone.Transport.stop();
    await Tone.Transport.cancel();

    setIsPlaying(false);
    isLive = false;
    //setCurrentSequence(pattern);
    //setPatternPlay(mode)
  }
  async function play() {
    //  if(samples.length === 0) {return}
    //scrollTo(0)
    scrollTo(-1000);
    console.log(Tone.Transport.state);
    if (Tone.Transport.state === "stopped") {
      Tone.context.resume();
    } else {
      //Tone.start();
    }

    if (Tone.Transport.state === "stopped") {
      setIsPlaying(true);
      Tone.Transport.bpm.value = currentBPM;
      pattern = currentSequence;

      try {
        sequencePattern();
        sequenceContextPattern();
      } catch (error) {
        console.log("error playing sequence", error);
        Tone.Transport.stop();
        Tone.Transport.cancel();
      }

      //await sequencePattern();

      console.log("current pattern", pattern, currentSequence);
    } else {
      stop();
    }
    //pattern = currentSequence;
  }

  const setDrumType = (drum: string, index: number) => {
    console.log("setDrumType", drum, index);
    let _drumTypes = drumTypes;
    _drumTypes[index] = drum;
    setDrumTypes(_drumTypes);
    console.log("drumTypes", _drumTypes);
  };
  const setVolume = (_volume: number, index: number) => {
    const _volumes = mixerVolumes;
    //const newVolume = (100 - _volume) * -1;
    _volumes[index] = _volume;
    setMixerVolumes(_volumes);
    console.log("player vol = ", players[index].volume.value);
    players[index].volume.value = _volume;
    // console.log("volumes", _volume )
    // console.log("players", players)
  };
  //let __sampleIDs:any[] = []
  const setSampleID = (id: string, index: number) => {
    console.log("setSampleID", id, index, sampleIDs);

    setSampleIDs((_sampleIDs: SampleID[]) => {
      if (_sampleIDs.length === 0) {
        return [{ id, index }];
      } else {
        const sampleID = _sampleIDs.find((item) => item.index === index);
        if (sampleID) {
          return _sampleIDs.map((item) => {
            if (item.index === index) {
              return { id, index };
            } else {
              return item;
            }
          });
        }
      }
      return [..._sampleIDs, { id, index }];
    });
  };
  const getSampleID = (index: number) => {
    const sampleID = sampleIDs.find((item) => item.index === index);
    if (sampleID) {
      return sampleID.id;
    }
    return "";
  };
  //console.log("setSampleID", sampleIDs);
  //console.log("saved", stepPatternSaves);
  return (
    <>
      <div className="page-loading">
        <div className="page-loading-inner">
          <div className="page-loading-inner-inner">Loading...</div>
        </div>
      </div>{" "}
      :{" "}
      <main>
        <div className=" flex justify-center items-center fixed top-20 h-screen w-screen blur-md  opacity-60 animate-pulse -z-20">
          <Image
            src={waves}
            alt="waves"
            className={`shadow-2xl shadow-lime-500`}
          />
        </div>
        <div
          className={`flex flex-col items-center justify-between min-h-screen py-4 md:p-24  text-white transition-all duration-200 ease-in-out opacity-90 ${
            pageLoading &&
            "blur-md  opacity-30 border-2 shadow-xl shadow-lime-400/30"
          }`}
        >
          <h1>KITZ-LAB</h1>
          {/* <button title="check" onClick={() => console.log("check", sampleIDs)}>
            check
          </button> */}
          <div className="flex my-8 flex-wrap  items-center justify-center w-32? w-1/2 md:w-full md:justify-between gap-2 text-lime-500 border-[1px] border-indigo-900 rounded-xl bg-gradient-to-br from-gray-900/30 via-slate-900/30 to-gray-950/30 p-4">
            <Button
              className="bg-gray-900 text-lime-500 w-12  md:w-24 md:h-36  "
              onClick={() => updateNumRows(numRows + 1)}
            >
              + Row
            </Button>
            <Button
              className="bg-gray-900 text-lime-500 w-12  md:w-24 md:h-36  "
              onClick={() => updateNumRows(numRows - 1)}
            >
              - Row
            </Button>
            <div className={"mx-10"}>
              <p className="flex items-center justify-center">tempo</p>
              <TempoControl
                tempoChanged={tempoChanged}
                inputTempo={currentBPM}
              />
              <p className="flex items-center justify-center">BPM</p>
            </div>
            <Button
              className="bg-gray-900 text-lime-500 w-12  md:w-24 md:h-36 "
              onClick={() => updateNumSteps(numSteps + 4)}
            >
              + 4 Steps
            </Button>
            <Button
              className="bg-gray-900 text-lime-500 w-12  md:w-24 md:h-36 "
              onClick={() => updateNumSteps(numSteps - 4)}
            >
              - 4 Steps
            </Button>
          </div>
          {sequences[0]! &&
            sequences[0].length > 0 &&
            soundList.items.length > 0 && (
              <div className="flex gap-2 items-center justify-center flex-wrap">
                {Array(numRows)
                  .fill(0)
                  .map((sample, index) => {
                    // {console.log(sequences[currentSequence][index][currentStep])}
                    return (
                      <SampleLoader
                        index={index}
                        sampleBank={soundList.items}
                        key={`loader-${index}`}
                        player={players[index]}
                        _drumType={drumTypes[index]}
                        _setDrumType={setDrumType}
                        _setVolume={setVolume}
                        sampleIdsToLoadOnCreate={
                          samplesToLoadOnCreate.length === 0
                            ? getStartupDrumsByIdOrRandom()[index]
                            : samplesToLoadOnCreate[index]
                        }
                        numRows={numRows}
                        sequences={sequences}
                        currentSequence={currentSequence}
                        numSteps={numSteps}
                        pattern={pattern}
                        players={players}
                        isPlaying={isPlaying}
                        sampleIDs={sampleIDs}
                        setSampleID={setSampleID}
                      />
                    );
                  })}
              </div>
            )}
          <div
            className={`PLAY-STRIP flex flex-wrap items-center w-screen justify-between gap-10 mx-auto?`}
          >
            {savedKitsList.length > 0 && (
              <div
                className={`text-xl h-16 w-32 border-pink-700 border-[1px] my-4 bg-slate-800/50`}
              >
                <select
                  className={`w-full h-fit my-auto bg-indigo-800/50`}
                  title="saved-kits-select"
                  //value={currentSavedKitID}
                  onChange={(e) => {
                    loadAllFromStorage(e.target.value);
                  }}
                  //onSelect={(e) => {loadAllFromStorage(e.target.value)}}
                >
                  {savedKitsList.map((kit: any) => {
                    return (
                      <option
                        className={`text-xl  w-full border-black border-[1px] my-4 bg-slate-800/50`}
                        key={kit.id}
                        value={kit.id}
                        selected={kit.id === currentSavedKitID}
                      >
                        {kit.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            <Button
              className={`text-xl w-32 border-pink-700 border-[1px] my-4 bg-indigo-800/50`}
              onClick={play}
            >
              {isPlaying && <StopCircle size={48} color="red" />}
              {!isPlaying && <PlayCircleIcon size={48} color="lime" />}
            </Button>
            <Button
              className={`text-xl w-32 border-pink-700 border-[1px] my-4 bg-indigo-800/50`}
              onClick={reRandomizePlayers}
            >
              <TornadoIcon size={48} color="lime" />
            </Button>
            <Button
              className={`text-xl w-32 border-pink-700 border-[1px] my-4 bg-indigo-800/50`}
              onClick={saveSequencesToLocalStorage}
            >
              <UploadIcon size={48} color="lime" />
            </Button>
          </div>
          <div className="flex flex-wrap  mx-auto justify-center gap-4 md:gap-0 md:justify-between md:min-h-fit bg-slate-950/60 rounded-xl border-[1px] border-indigo-900 p-1 w-full items-center">
            <div className="float-left justify-center mx-5 text-left">
              Patterns:{" "}
            </div>
            <div className="mx-auto">
              <SequencePanel
                currentSequence={currentSequence}
                handleAddSequenceSelected={handleAddSequenceSelected}
                handleSequenceSelected={handleSequenceSelected}
                sequences={sequences}
              />
            </div>
            <div
              className="flex items-center float-right justify-center bg-gradient-to-br from-fuchsia-900 via-indigo-800 rounded-xl p-2 border-[1px] border-indigo-950 to-purple-800 mx-5  hover:cursor-pointer hover:border-pink-600 w-24 min-w-fit h-8 text-center"
              onClick={() => setPlayMode()}
            >
              {patternPlay === 0 && "Play All"}
              {patternPlay === 1 && "Loop"}
              {patternPlay === 2 && "Random"}
            </div>
          </div>
          <div className="md:hidden m-3 w-2/3 ">
            <Button
              className={`bg-gray-900 border-[1px] border-slate-800 text-lime-500 text-sm w-full h-6 ${
                scroll ? "bg-lime-900" : "bg-slate-900"
              } `}
              onClick={() => setScroll(!scroll)}
            >
              {scroll ? "Stop-scroll" : "Scroll"}
            </Button>
          </div>
          <div
            ref={scrollContainerRef as any}
            className="w-screen md:max-w-screen-xl? border-[1px] border-indigo-900 rounded-xl bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 p-5 md:my-2 overflow-x-auto"
          >
            <LedStrip start={isPlaying} numSteps={numSteps} />
            <SequencerSteps
              numSequences={numSequences}
              sequences={sequences}
              pattern={currentSequence}
              updatePad={updatePad}
              drumTypes={drumTypes}
              bpm={currentBPM}
              numRows={numRows}
              numSteps={numSteps}
              players={players}
              setPlayers={setPlayers}
              setKeyPads={setSequences}
              setMixerVolumes={setMixerVolumes}
              setDrumTypes={setDrumTypes}
              playMode={patternPlay}
              actionButtonHandler={handlePatternRowAction}
              _currentStep={0}
              isPlaying={isPlaying}
              handleStepVolumeChanged={updateStepVolume}
              stepPatternSaves={stepPatternSaves}
            />
          </div>
          {/* <button onClick={setUpSamples}>Set up</button> */}
          <Button
            className={`text-xl w-32 border-pink-700 border-[1px] my-4`}
            onClick={play}
          >
            {isPlaying && <StopCircle size={48} color="red" />}
            {!isPlaying && <PlayCircleIcon size={48} color="lime" />}
          </Button>
          {/* <button
          onClick={() => {
            updateCurrentSequence();
          }}
        >
          update sequence
        </button> */}
        </div>
      </main>
    </>
  );
}
