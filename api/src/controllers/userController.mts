import User, { convertUserToDto } from "../models/userSchema.mjs";

export const getUsers = async () => {
  const usersFromDb = await User.find();

  return usersFromDb.map((usersFromDb) => convertUserToDto(usersFromDb));
};

export const getUser = async (id: string) => {
  return await User.findOne({ userId: +id });
};
