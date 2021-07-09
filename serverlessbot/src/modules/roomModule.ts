import {
  getUniqueInviteId,
  isPlayerInRoom,
  deleteRoomIdAndPlayers,
  removePlayerFromRoom,
  addPlayerToRoom,
  createGameRoom,
  isPlayerAHost,
  isPlayerOwnerOfRoom,
  launchGameRoom,
  isRoomExists,
  sendStatusOfRoom,
} from "../utils/roomUtils";
import { notifyAllPlayers } from "../utils/gameUtils";
import { startGame } from "./gameModule";
import { requireJoinedRoom, requireUserInput } from "../middlewares";
import { ContextExtended } from "../types";
import { bot } from "..";
import { roomCreatedSendInviteView, roomCreatedView } from "../views/roomView";

export const roomModule = () => {
  bot.command("/create", createRoom);
  bot.command("/delete", requireJoinedRoom(), deleteRoom);
  bot.command("/join", requireUserInput("Incorrect format, please use /join <id>"), joinRoom);
  bot.command("/leave", requireJoinedRoom(), leaveRoom);
  bot.command("/launch", requireJoinedRoom(), launchGame);
  bot.command("/status", requireJoinedRoom(), statusRoom);
};

async function createRoom(ctx: ContextExtended) {
  const { userId } = ctx.sentenceMixer;
  let roomId: string;
  try {
    if (await isPlayerInRoom(userId)) {
      bot.telegram.sendMessage(ctx.chat!.id, "You are already in a room");
      return;
    }

    roomId = await getUniqueInviteId();
    await createGameRoom(roomId, userId, ctx);
    await bot.telegram.sendMessage(ctx.chat!.id, roomCreatedView(roomId));
    await bot.telegram.sendMessage(ctx.chat!.id, roomCreatedSendInviteView(roomId));
    await sendStatusOfRoom(roomId);
    return;
  } catch (err) {
    console.log(err);
    return;
  }
}

async function deleteRoom(ctx: ContextExtended) {
  const { userId, roomId } = ctx.sentenceMixer;

  try {
    if (!(await isPlayerOwnerOfRoom(userId, roomId))) {
      bot.telegram.sendMessage(ctx.chat!.id, "You are not the owner of the room");
      return;
    }
    await notifyAllPlayers({ message: "Host has exited the game, room is disbanded", roomId, excludedPlayers: [userId] });
    await deleteRoomIdAndPlayers(roomId);
    bot.telegram.sendMessage(ctx.chat!.id, "Your room was deleted");
    return;
  } catch (err) {
    console.log(err.message);
    return;
  }
}

async function joinRoom(ctx: ContextExtended) {
  const { userId, userInput } = ctx.sentenceMixer;
  const roomId = userInput;

  try {
    if (!(await isRoomExists(roomId))) {
      bot.telegram.sendMessage(ctx.chat!.id, `Room does not exists`);
      return;
    }
    if (await isPlayerInRoom(userId)) {
      bot.telegram.sendMessage(ctx.chat!.id, `You are already in another room`);
      return;
    }
    await addPlayerToRoom(roomId, userId, ctx);
    await notifyAllPlayers({
      message: `${ctx.from?.first_name} (@${ctx.from?.username}) has joined the game`,
      roomId,
      excludedPlayers: [userId],
    });
    await bot.telegram.sendMessage(ctx.chat!.id, `Joined Room ${roomId}`);
    await sendStatusOfRoom(roomId);
    return;
  } catch (err) {
    console.log(err);
    return;
  }
}

async function leaveRoom(ctx: ContextExtended) {
  const { userId, roomId } = ctx.sentenceMixer;
  try {
    if (await isPlayerAHost(userId)) {
      bot.telegram.sendMessage(ctx.chat!.id, `Cannot leave room as host, use /delete`);
      return;
    }

    await removePlayerFromRoom(roomId, userId);

    await notifyAllPlayers({
      message: `${ctx.from?.first_name} (@${ctx.from?.username}) has left the game`,
      roomId,
      excludedPlayers: [userId],
    });
    await bot.telegram.sendMessage(ctx.chat!.id, `Left Room`);
    await sendStatusOfRoom(roomId);
    return;
  } catch (err) {
    console.log(err);
    return;
  }
}

async function launchGame(ctx: ContextExtended) {
  const { userId, roomId } = ctx.sentenceMixer;

  try {
    if (!(await isPlayerOwnerOfRoom(userId, roomId))) {
      bot.telegram.sendMessage(ctx!.chat!.id, "You are not the owner of the room");
      return;
    }
    await launchGameRoom(roomId);
    await notifyAllPlayers({ message: "Game has started", roomId });
    await startGame(ctx);
  } catch (err) {
    console.log(err.message);
    return;
  }
}

async function statusRoom(ctx: ContextExtended) {
  const { roomId } = ctx.sentenceMixer;
  try {
    await sendStatusOfRoom(roomId);
    return;
  } catch (err) {
    console.log(err);
    return;
  }
}
