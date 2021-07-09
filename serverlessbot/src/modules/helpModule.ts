import { Context } from "telegraf";
import _ from "lodash";
import { helpMessage } from "../views/helpViews";
import { bot } from "..";

export const helpModule = () => {
  bot.command(["start", "help"], helpHandler);
};

async function helpHandler(ctx: Context) {
  bot.telegram.sendMessage(ctx.chat!.id, helpMessage);
}
