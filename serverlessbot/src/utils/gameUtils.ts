import _ from "lodash";
import { db } from "../firebase";
import { bot } from "../index";
import { ContextExtended } from "../types";
import * as gameView from "../views/gameView";
import { deleteRoomIdAndPlayers } from "./roomUtils";

const STAGE_TO_MESSAGE_MAP: { [x: string]: string } = {
  "stage 1": gameView.stage1Instructions,
  "stage 2": gameView.stage2Instructions,
  "stage 3": gameView.stage3Instructions,
  "stage 4": gameView.stage4Instructions,
  "stage 5": gameView.stage5Instructions,
  "stage 6": gameView.stage6Instructions,
  done: gameView.done,
};

const ROOM_DB = "rooms";
const PLAYERS_DB = "players";

const roomRef = db.ref(`sentencemixer/${ROOM_DB}`);
const playersRef = db.ref(`sentencemixer/${PLAYERS_DB}`);

export const notifyAllPlayers = async ({
  message,
  roomId,
  excludedPlayers,
}: {
  message: string;
  roomId: string;
  excludedPlayers?: string[];
}): Promise<void> => {
  const snapshot = await roomRef.child(roomId).once("value");
  const data = snapshot.val();
  Object.values(data.playerIds as { [x: string]: string }).forEach((id: string) => {
    if (excludedPlayers?.includes(id)) {
      return;
    }
    bot.telegram.sendMessage(id, message);
  });
};

export const setPlayerInputAtStage = async ({
  userId,
  roomId,
  userInput,
  stage,
  ctx,
}: {
  userId: string;
  roomId: string;
  userInput: string;
  stage: string;
  ctx: ContextExtended;
}) => {
  const snapshot = await playersRef.child(userId).once("value");
  const data = snapshot.val();
  if (data[stage]) {
    bot.telegram.sendMessage(ctx!.chat!.id, "You already replied");
    throw new Error("Player already replied");
  } else {
    await Promise.all([
      playersRef.child(userId).update({
        [stage]: userInput,
      }),
      roomRef.child(`${roomId}/inputCount`).transaction((currentCount) => {
        return currentCount + 1;
      }),
    ]);
  }
};

export const checkAllPlayersAnsweredAndMoveNextStage = async (roomId: string, nextStage: string): Promise<void> => {
  const snapshot = await roomRef.child(roomId).once("value");
  const data = snapshot.val();
  if (data.inputCount === data.playerCount) {
    moveNextStage(roomId, nextStage);
  }
};

export const moveNextStage = async (roomId: string, nextStage: string) => {
  await roomRef.child(roomId).update({
    currentStage: nextStage,
    inputCount: 0,
  });
  notifyAllPlayers({ message: STAGE_TO_MESSAGE_MAP[nextStage], roomId });
  if (nextStage === "done") {
    endGame(roomId);
  }
};

export const endGame = async (roomId: string) => {
  const snapshot = await playersRef.orderByChild("roomId").equalTo(roomId).once("value");
  const data = snapshot.val();

  const inputMap: any = {};
  Object.values(data).forEach((item, i) => {
    inputMap[i + 1] = item;
  });

  const totalNumberPlayers = Object.keys(inputMap).length;

  for (let i = 0; i < 8 + totalNumberPlayers * 2; i++) {
    let outputSentence = "";
    for (let k = 1; k <= 6; k++) {
      const randomPlayerKey = String(randomIntBetween(1, totalNumberPlayers));
      const inputText = inputMap[randomPlayerKey][`stage ${k}`];
      outputSentence += " " + processText(inputText);
    }
    await notifyAllPlayers({ message: outputSentence, roomId });
  }

  setTimeout(() => {
    notifyAllPlayers({ message: "Game finished, room disbanded", roomId });
    deleteRoomIdAndPlayers(roomId);
  }, 1000);
};

export const randomIntBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const isCurrentStage = async (roomId: string, stage: string) => {
  const snapshot = await roomRef.child(roomId).once("value");
  const data = snapshot.val();
  return data.currentStage === stage;
};

export const processText = (text: string): string => {
  let output = text.toLowerCase();
  output = output.replace(/<+|>+$/g, "");
  output = output.trim();
  return output;
};
