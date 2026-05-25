import express from "express";
import type { UserDto } from "../models/userDto.mjs";
import { getUser, getUsers } from "../controllers/userController.mjs";

const userRouter = express.Router();

userRouter.get("/", async (_, res) => {
  try {
    const users: UserDto[] = await getUsers();

    if (!users) {
      return res
        .status(404)
        .json({ message: "No users found in the database" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const users = await getUser(userId);

    if (!users) {
      return res.status(404).json({
        message: "Ingen användare hittades i databasen med det angivna id:t",
      });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

export default userRouter;
