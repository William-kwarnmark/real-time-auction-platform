import express from "express";
import type { LoginRequest } from "../models/requests/loginRequest.mjs";
import { loginUser } from "../controllers/loginController.mjs";
import jwt from "jsonwebtoken";

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username && !password) {
      return res.status(400).json({
        message:
          "Du måste skriva in ett användarnamn och lösenord för att logga in",
      });
    }

    if (!username) {
      return res
        .status(400)
        .json({ message: "Du måste skriva in ett användarnamn" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ message: "Du måste skriva in ett lösenord" });
    }

    const userDto = await loginUser({ username, password });

    if (userDto) {
      const token = jwt.sign(userDto, process.env.JWT_SECRET || "secret");
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      res.cookie("login", token, { expires, httpOnly: true });

      return res.status(200).json(userDto);
    }

    res.status(400).json({
      message:
        "Felaktigt användarnamn eller lösenord. Vänligen försök igen eller skapa ett nytt konto.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

loginRouter.post("/logout", (req, res) => {
  res.clearCookie("login", {
    path: "/",
  });

  return res.status(200).json({ message: "Utloggad" });
});

export default loginRouter;
