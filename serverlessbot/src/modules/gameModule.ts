import _ from "lodash";
import { bot } from "..";
import { requireCorrectStage, requireJoinedRoom, requireUserInput } from "../middlewares";
import { ContextExtended } from "../types";
import { checkAllPlayersAnsweredAndMoveNextStage, notifyAllPlayers, setPlayerInputAtStage } from "../utils/gameUtils";
import { stageMap, stage1Instructions } from "../views/gameView";

export const gameModule = () => {
  Object.values(stageMap).forEach((stageInfo) => {
    bot.command(
      stageInfo.command,
      requireJoinedRoom(),
      requireUserInput(stageInfo.errorMsg),
      requireCorrectStage(stageInfo.stage),
      stageHandler(stageInfo.stage, stageInfo.nextStage)
    );
  });
};

export const startGame = async (ctx: ContextExtended): Promise<void> => {
  const { roomId } = ctx.sentenceMixer;
  await notifyAllPlayers({ message: stage1Instructions, roomId });
};

export const stageHandler = (stage: string, nextStage: string) => {
  return async (ctx: ContextExtended): Promise<void> => {
    const { userId, roomId, userInput } = ctx.sentenceMixer;
    try {
      await setPlayerInputAtStage({ userId, roomId, userInput, stage, ctx });
      ctx.reply(`Received input for ${stage}`);
      await notifyAllPlayers({
        message: `${ctx.from?.first_name} (${ctx.from?.username}) has answered`,
        roomId,
        excludedPlayers: [userId],
      });
      await checkAllPlayersAnsweredAndMoveNextStage(roomId, nextStage);
    } catch (err) {
      console.log(err);
    }
  };
};
