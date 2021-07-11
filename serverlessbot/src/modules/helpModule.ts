import { Context } from "telegraf";
import _ from "lodash";
import { helpMessage } from "../views/helpViews";
import { bot } from "..";
import { ContextExtended } from "../types";
import { checkStartInput } from "../middlewares";
import { joinRoom } from "./roomModule";

export const helpModule = () => {
  bot.command("help", helpHandler);
  bot.command("start", checkStartInput(), startHandler);
};

async function helpHandler(ctx: Context) {
  bot.telegram.sendMessage(ctx.chat!.id, helpMessage);
}

async function startHandler(ctx: ContextExtended) {
  const { userInput } = ctx.sentenceMixer;
  userInput !== "" ? joinRoom(ctx) : bot.telegram.sendMessage(ctx.chat!.id, helpMessage);
}
