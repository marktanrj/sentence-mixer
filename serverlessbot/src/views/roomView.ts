export const roomCreatedView = (roomId: string) => `
You have created a game with ID ${roomId}
Forward the following message for others to join!
`;

export const roomCreatedSendInviteView = (roomId: string) => `
Go to @sentencemixerbot and type:
/join ${roomId}
`;

export const currentPlayersInRoomView = (players: Object): string => {
  let reply = `
Current players in room:`;

  Object.values(players).forEach((player) => {
    reply += `\n- ${player.firstName} (${player.username})`;
  });

  return reply;
};
