import express from "express";
import type { RegisterRequest } from "../models/requests/registerRequest.mjs";
import { createUser } from "../controllers/registerController.mjs";
import type { UserDto } from "../models/userDto.mjs";

const registerRouter = express.Router();

registerRouter.post("/", async (req, res) => {
  try {
    const { username, email, password }: RegisterRequest = req.body;

    if (!username) {
      return res.status(400).json({ message: "Missing username in body" });
    }

    if (username.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Username must contain at least 2 characters" });
    }

    if (!email) {
      return res.status(400).json({ message: "Missing email in body" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!password) {
      return res.status(400).json({ message: "Missing password in body" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must contsin at least 6 characters" });
    }

    const userDto: UserDto = await createUser({ username, email, password });

    return res.status(201).json(userDto);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default registerRouter;
