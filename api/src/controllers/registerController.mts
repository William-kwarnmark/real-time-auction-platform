import bcrypt from "bcryptjs";
import type { RegisterRequest } from "../models/requests/registerRequest.mjs";
import User, { convertUserToDto } from "../models/userSchema.mjs";

export const createUser = async (request: RegisterRequest) => {
  const existingUser = await User.findOne({ email: request.email.trim() });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const existingUsername = await User.findOne({
    username: request.username.trim(),
  });

  if (existingUsername) {
    throw new Error("Username already exists");
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(request.password, salt);

  const user = {
    userId: Date.now(),
    username: request.username.trim(),
    email: request.email.trim(),
    password: hashedPassword,
  };

  const theNewUser = await User.create(user);

  return convertUserToDto(theNewUser);
};
