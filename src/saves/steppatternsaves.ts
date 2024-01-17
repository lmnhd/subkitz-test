import { Step } from "@/components/sequencer/sequencertypes";
export type StepPatternSave = {
    id:any;
    drumType:string;
    global:boolean;
    stepPattern:Step[]
    userID:string;
}
export type StepPatternSaves = StepPatternSave[]