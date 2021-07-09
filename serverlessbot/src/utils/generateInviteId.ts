const noOfdigits = 4;
export const generateInviteId = (): string => {
  let inviteId = "";

  for (let i = 0; i < noOfdigits; i++) {
    const randomDigit = Math.floor(Math.random() * 10);
    inviteId += randomDigit;
  }
  return inviteId;
};
