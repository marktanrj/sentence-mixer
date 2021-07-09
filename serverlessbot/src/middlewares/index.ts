import _ from "lodash";
import { bot } from "..";
import { ContextExtended } from "../types";
import { isCurrentStage } from "../utils/gameUtils";
import { getRoomIdOfPlayer } from "../utils/roomUtils";

export const initMiddlewares = async (ctx: ContextExtended, next: any): Promise<void> => {
  const userId = String(_.get(ctx, "from.id"));
  ctx.sentenceMixer = {
    userId,
    roomId: "",
    userInput: "",
    userCommand: "",
    joinRoomCode: "",
  };
  return next();
};

export const requireJoinedRoom = () => {
  return async (ctx: ContextExtended, next: any): Promise<void> => {
    const roomId = await getRoomIdOfPlayer(ctx.sentenceMixer.userId);
    if (!roomId) {
      bot.telegram.sendMessage(ctx.chat!.id, "You must be in a room to use this command");
      return;
    }

    ctx.sentenceMixer = {
      ...ctx.sentenceMixer,
      roomId,
    };

    return next();
  };
};

export const requireUserInput = (errorMessageReply = "Incorrect input need at least 2 arguments") => {
  return async (ctx: ContextExtended, next: any): Promise<void> => {
    const input = String(_.get(ctx, "message.text"));

    const inputArr = input.split(" ");
    if (inputArr.length === 1) {
      bot.telegram.sendMessage(ctx.chat!.id, errorMessageReply);
      return;
    }
    const userCommand = inputArr[0];
    inputArr.shift();
    const userInput = inputArr.join(" ");

    ctx.sentenceMixer = {
      ...ctx.sentenceMixer,
      userInput,
      userCommand,
    };

    return next();
  };
};

export const requireUserInputJoinRoom = () => {
  return async (ctx: ContextExtended, next: any): Promise<void> => {
    const input = String(_.get(ctx, "message.text"));
    const inputArr = input.split(" ");
    if (inputArr.length !== 1) {
      bot.telegram.sendMessage(ctx.chat!.id, "Join with /<id>\neg. /1234");
      return;
    }
    let joinRoomCode = inputArr[0];

    if (joinRoomCode.length === 1) {
      bot.telegram.sendMessage(ctx.chat!.id, "Join with /<id>\neg. /1234");
      return;
    }

    joinRoomCode = joinRoomCode.slice(1);

    ctx.sentenceMixer = {
      ...ctx.sentenceMixer,
      joinRoomCode,
    };

    return next();
  };
};

export const requireCorrectStageInput = (stage: string) => {
  return async (ctx: ContextExtended, next: any): Promise<void> => {
    const { userCommand } = ctx.sentenceMixer;

    if (userCommand === stage) {
      bot.telegram.sendMessage(ctx.chat!.id, `Incorrect stage, please use ${stage} <text>`);
      return;
    }
    return next();
  };
};

export const requireCorrectStage = (checkStage: string) => {
  return async (ctx: ContextExtended, next: any): Promise<void> => {
    const { roomId } = ctx.sentenceMixer;

    if (!(await isCurrentStage(roomId, checkStage))) {
      bot.telegram.sendMessage(ctx.chat!.id, `Incorrect stage`);
      return;
    }

    return next();
  };
};
