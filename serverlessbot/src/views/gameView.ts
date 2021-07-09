export const stageMap = [
  {
    command: "/1",
    stage: "stage 1",
    nextStage: "stage 2",
    errorMsg: `Incorrect format, please use /1 <text>`,
  },
  {
    command: "/2",
    stage: "stage 2",
    nextStage: "stage 3",
    errorMsg: `Incorrect format, please use /2 <text>`,
  },
  {
    command: "/3",
    stage: "stage 3",
    nextStage: "stage 4",
    errorMsg: `Incorrect format, please use /3 <text>`,
  },
  {
    command: "/4",
    stage: "stage 4",
    nextStage: "stage 5",
    errorMsg: `Incorrect format, please use /4 <text>`,
  },
  {
    command: "/5",
    stage: "stage 5",
    nextStage: "stage 6",
    errorMsg: `Incorrect format, please use /5 <text>`,
  },
  {
    command: "/6",
    stage: "stage 6",
    nextStage: "done",
    errorMsg: `Incorrect format, please use /6 <text>`,
  },
];

export const stage1Instructions = `
Stage 1 of 6: Type a name
Type someone's name in this game
/1 <name>
eg /1 karen
`;

export const stage2Instructions = `
Stage 2 of 6: Type a verb
Use words like kicked instead of kick, so that it has tense (time) and make sure that it is a verb that can be done to something.
/2 <verb>
eg /2 kicked
eg /2 smacked
`;

export const stage3Instructions = `
Stage 3 of 6: Type another name
Type another person's name, but add a 's after the name
/3 <name>'s
eg /3 josh's
eg /3 sam's
`;

export const stage4Instructions = `
Stage 4 of 6: Type an adjective
It is a word that describes a noun. Eg. angry, hairy, fancy
/4 <adjective>
eg /4 blue
eg /4 bright
eg /4 extremely hairy
eg /4 big and juicy
`;

export const stage5Instructions = `
Stage 5 of 6: Type a noun
A noun is something you can see and touch
/5 <noun>
eg /5 cake
eg /5 laptop
`;

export const stage6Instructions = `
Stage 6 of 6: Type more info
Type any additional information
/6 <info>
eg /6 while eating a sandwich
eg /6 while smashing the like button
eg /6 while hugging a tree
`;

export const done = `All done!`;
