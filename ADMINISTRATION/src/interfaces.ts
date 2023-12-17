// name: a.string(),
//       s3Path: a.string(),
//       description: a.string(),
//       Genre: a.enum([
//         "hiphop",
//         "trap",
//         "rnb",
//         "pop",
//         "rock",
//         "jazz",
//         "soul",
//         "funk",
//         "electronic",
//         "experimental",
//         "world",
//         "fx",
//       ]), //hiphop, trap, rnb, pop, rock, jazz, soul, funk, electronic, experimental, world, fx
//       tags: a.string().array(),
//       drum: a.enum([
//         "sub",
//         "kick",
//         "snare",
//         "ohat",
//         "chat",
//         "cymbal",
//         "tom",
//         "perc",
//         "shaker",
//         "clave",
//         "stick",
//         "bell",
//         "conga",
//         "whistle",
//         "femvox",
//         "malevox",
//         "clap",
//         "ride",
//         "rim",
//         "nome",
//       ]), 
//       //sub, kick, snare, hat, cymbal, tom, perc
//       hygiene: a.enum(["clean", "dirty"]), //clean, dirty
//       length: a.enum(["short", "mid", "long"]), //short, mid, long
//       pitchRange: a.enum(["low", "mid", "high"]), //low, mid, high
//       //genres: a.hasMany("string"), //hiphop, trap, rnb, pop, rock, jazz, soul, funk, electronic, experimental, world, fx
//       mix: a.enum(["dry", "wet"]), //dry, wet
//       loudness: a.enum(["soft", "mid", "loud"]), //soft, mid, loud
//       decadeStyle: a.enum([
//         "fifties",
//         "sixties",
//         "seventies",
//         "eighties",
//         "nineties",
//         "twothousands",
//         "tens",
//         "twenties",
//         "thirties",
//         "spaceage"
//       ]), //50s, 60s, 70s, 80s, 90s, 00s, 10s, 20s
//       sourceGen1: a.enum(["analog", "digital"]), //analog, digital
//       sourceGen2: a.enum(["organic", "synthetic"]), // organic, synthetic
//       reversed: a.boolean().default(false),
export enum Genre {
    hiphop = "hiphop",
    trap = "trap",
    rnb = "rnb",
    pop = "pop",
    rock = "rock",
    jazz = "jazz",
    soul = "soul",
    funk = "funk",
    electronic = "electronic",
    experimental = "experimental",
    world = "world",
    fx = "fx"

}

export enum Drum {
    sub = "sub",
    kick = "kick",
    snare = "snare",
    ohat = "ohat",
    chat = "chat",
    cymbal = "cymbal",
    tom = "tom",
    perc = "perc",
    shaker = "shaker",
    clave = "clave",
    stick = "stick",
    bell = "bell",
    conga = "conga",
    whistle = "whistle",
    femvox = "femvox",
    malevox = "malevox",
    clap = "clap",
    ride = "ride",
    rim = "rim",
    nome = "nome"
}
export enum Hygiene {
    clean = "clean",
    dirty = "dirty"
}
export enum Length {
    short = "short",
    mid = "mid",
    long = "long"
}
export enum PitchRange {
    low = "low",
    mid = "mid",
    high = "high"
}
export enum Mix {
    dry = "dry",
    wet = "wet"
}
export enum Loudness {
    soft = "soft",
    mid = "mid",
    loud = "loud"
}
export enum DecadeStyle {
    fifties = "fifties",
    sixties = "sixties",
    seventies = "seventies",
    eighties = "eighties",
    nineties = "nineties",
    twothousands = "twothousands",
    tens = "tens",
    twenties = "twenties",
    thirties = "thirties",
    spaceage = "spaceage"
}
export enum SourceGen1 {
    analog = "analog",
    digital = "digital"
}
export enum SourceGen2 {
    organic = "organic",
    synthetic = "synthetic"
}
export type Tag = string;
export type SampleType = {
    name: string,
    s3Path: string,
    description?: string,
    genre?: Genre[],
    tags?: Tag[],
    drum?: Drum,
    hygiene?: Hygiene,
    length?: Length,
    pitchRange?: PitchRange,
    mix?: Mix,
    loudness?: Loudness,
    decadeStyle?: DecadeStyle,
    sourceGen1?: SourceGen1,
    sourceGen2?: SourceGen2,
    reversed?: boolean,
    owner?: string,
    

}

export interface Sample {
   
    name: string,
    s3Path: string,
    description?: string,
    genre?: Genre,
    tags?: Tag[],
    drum?: Drum,
    hygiene?: Hygiene,
    length?: Length,
    pitchRange?: PitchRange,
    mix?: Mix,
    loudness?: Loudness,
    decadeStyle?: DecadeStyle,
    sourceGen1?: SourceGen1,
    sourceGen2?: SourceGen2,
    reversed?: boolean,
    invalid?: boolean
    owner?: string,
}