import bcrypt from "bcryptjs";
import type { LoginRequest } from "../models/requests/loginRequest.mjs";
import User, { convertUserToDto } from "../models/userSchema.mjs";

export const loginUser = async (req: LoginRequest) => {
  const foundUser = await User.findOne({ username: req.username });

  if (!foundUser) return null;

  const success = await bcrypt.compare(req.password, foundUser.password);

  if (!success) return null;

  return convertUserToDto(foundUser);
};
