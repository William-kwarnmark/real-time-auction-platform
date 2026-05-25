import { model, Schema, type InferSchemaType } from "mongoose";
import type { UserDto } from "./userDto.mjs";

export const userSchema = new Schema({
  userId: { type: Number, required: true },
  username: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model("User", userSchema);

export default User;

export type UserType = InferSchemaType<typeof userSchema>;

export const convertUserToDto = (user: UserType): UserDto => {
  return {
    userId: user.userId,
    username: user.username,
    email: user.email,
  } satisfies UserDto;
};
