import * as dotenv from "dotenv";
const isCloudEnvironment = !!process.env.LAMBDA_TASK_ROOT;

if (!isCloudEnvironment) {
  dotenv.config({
    path: "./.env.development",
  });
}

import { Telegraf } from "telegraf";

import { initMiddlewares } from "./middlewares";
import { roomModule } from "./modules/roomModule";
import { gameModule } from "./modules/gameModule";
import { helpModule } from "./modules/helpModule";

const bot = new Telegraf(process.env.BOT_TOKEN!) as any;

bot.use(initMiddlewares as any);

gameModule();
helpModule();
roomModule();

if (!isCloudEnvironment) {
  bot.launch();
}

export { bot };
