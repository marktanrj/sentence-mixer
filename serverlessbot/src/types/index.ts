import { Context } from "telegraf";

export interface ContextExtended extends Context {
  sentenceMixer: {
    userId: string;
    roomId: string;
    userInput: string;
    userCommand: string;
    joinRoomCode: string;
  };
}
