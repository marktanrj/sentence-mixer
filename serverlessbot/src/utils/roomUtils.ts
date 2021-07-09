// import _ from "lodash";
import { db } from "../firebase";
import { ContextExtended } from "../types";
import { currentPlayersInRoomView } from "../views/roomView";
import { notifyAllPlayers } from "./gameUtils";
import { generateInviteId } from "./generateInviteId";

const ROOM_DB = "rooms";
const PLAYERS_DB = "players";

const dbRef = db.ref("sentencemixer");
const roomRef = db.ref(`sentencemixer/${ROOM_DB}`);
const playersRef = db.ref(`sentencemixer/${PLAYERS_DB}`);

export const isPlayerInRoom = async (userId: string): Promise<boolean> => {
  const player = await playersRef.child(userId).once("value");
  return !!player.val();
};

export const isRoomExists = async (roomId: string): Promise<boolean> => {
  const snapshot = await roomRef.child(roomId).once("value");
  const data = snapshot.val();
  return !!data;
};

export const isPlayerAHost = async (userId: string) => {
  const snapshot = await playersRef.child(userId).once("value");
  const data = snapshot.val();
  return data.isHost;
};

export const isPlayerOwnerOfRoom = async (userId: string, roomId: string): Promise<boolean> => {
  const snapshot = await roomRef.child(roomId).once("value");
  const data = snapshot.val();
  const isOwner = data.host === userId;
  return isOwner;
};

export const getUniqueInviteId = async (): Promise<string> => {
  let inviteId;
  let existingRoom;
  do {
    inviteId = generateInviteId();
    console.log("generating");
    try {
      const snapshot = await roomRef.child(inviteId).once("value");
      existingRoom = snapshot.val();
    } catch (err) {
      console.log(err);
    }
  } while (existingRoom);

  return inviteId;
};

export const getRoomIdOfPlayer = async (userId: string): Promise<string | null> => {
  const snapshot = await playersRef.child(userId).once("value");
  const data = snapshot.val();
  if (data) {
    return data.roomId;
  }
  return null;
};

export const getPlayersInRoom = async (roomId: string): Promise<Object> => {
  const snapshot = await playersRef.orderByChild("roomId").equalTo(roomId).once("value");
  return snapshot.val();
};

export const createGameRoom = async (roomId: string, userId: string, ctx: ContextExtended): Promise<void> => {
  dbRef.update({
    [`${ROOM_DB}/${roomId}`]: {
      host: userId,
      started: false,
      playerCount: 1,
      inputCount: 0,
      currentStage: "lobby",
      playerIds: [userId],
    },
    [`${PLAYERS_DB}/${userId}`]: {
      status: "lobby",
      roomId,
      isHost: true,
      firstName: ctx.from?.first_name,
      username: ctx.from?.username,
    },
  });
};

export const launchGameRoom = async (roomId: string): Promise<void> => {
  await roomRef.child(roomId).update({
    started: true,
    currentStage: "stage 1",
  });
};

export const deleteRoomIdAndPlayers = async (roomId: string): Promise<void> => {
  const snapshot = await roomRef.child(roomId).once("value");
  const data = snapshot.val();
  const playerIds = Object.values(data.playerIds) as string[];

  await Promise.all(
    playerIds.map((id: string) => {
      return playersRef.child(id).remove();
    })
  );

  await roomRef.child(roomId).remove();
};

export const removePlayerFromRoom = async (roomId: string, userId: string): Promise<void> => {
  const snapshot = await roomRef.child(roomId).once("value");
  const data = snapshot.val();
  const [[keyToRemove]] = Object.entries(data.playerIds).filter((item) => {
    return item[1] === userId;
  });

  const removePlayerId = roomRef.child(`${roomId}/playerIds/${keyToRemove}`).remove();
  const decrementCount = roomRef.child(`${roomId}/playerCount`).transaction((currentCount) => {
    return currentCount - 1;
  });
  const removePlayerObj = playersRef.child(userId).remove();
  await Promise.all([removePlayerId, decrementCount, removePlayerObj]);
};

export const addPlayerToRoom = async (roomId: string, userId: string, ctx: ContextExtended): Promise<void> => {
  const addPlayerId = roomRef.child(`${roomId}/playerIds`).push(userId);
  const addCount = roomRef.child(`${roomId}/playerCount`).transaction((currentCount) => {
    return currentCount + 1;
  });
  const addPlayerObj = playersRef.child(userId).set({
    status: "lobby",
    roomId,
    firstName: ctx.from?.first_name,
    username: ctx.from?.username,
  });
  await Promise.all([addPlayerId, addCount, addPlayerObj]);
};

export const sendStatusOfRoom = async (roomId: string) => {
  await notifyAllPlayers({
    message: currentPlayersInRoomView(await getPlayersInRoom(roomId)),
    roomId,
  });
};
