import { Telegraf, Context } from "telegraf";
import * as dotenv from "dotenv";

import { initMiddlewares } from "./middlewares";
import { roomModule } from "./modules/roomModule";
import { gameModule } from "./modules/gameModule";
import { helpModule } from "./modules/helpModule";

const isCloudEnvironment = !!process.env.LAMBDA_TASK_ROOT;
if (!isCloudEnvironment) {
  dotenv.config({
    path: "./.env.development",
  });
}

const bot = new Telegraf(process.env.BOT_TOKEN!) as any;

bot.use(initMiddlewares as any);

roomModule();
gameModule();
helpModule();

if (!isCloudEnvironment) {
  bot.launch();
}

export { bot };
