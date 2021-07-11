export const roomCreatedView = (roomId: string) => `
You have created a game with ID ${roomId}
Forward the following message for others to join!
`;

export const roomCreatedSendInviteView = (roomId: string, botUsername: string) => `
Join the sentence mixer game:
https://t.me/${botUsername}?start=${roomId}
`;

export const currentPlayersInRoomView = (players: Object, roomId: string, botUsername: string): string => {
  let reply = `
Current players in room ${roomId}:`;

  Object.values(players).forEach((player) => {
    reply += `\n- ${player.firstName} (${player.username})`;
  });

  reply += `\n\nOthers join with:\nhttps://t.me/${botUsername}?start=${roomId}`;

  return reply;
};
