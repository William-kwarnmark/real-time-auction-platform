import { config } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
import registerRouter from "./routes/register.mjs";
import cors from "cors";
import cookieParser from "cookie-parser";
import loginRouter from "./routes/loginRouter.mjs";
import { bidRouter } from "./routes/bidRouter.mjs";
import { Server } from "socket.io";
import { ItemModel } from "./models/itemSchema.mjs";
import type { BidDto } from "./models/bidDto.mjs";
import type { Item } from "./models/item.mjs";
import auctionRouter from "./routes/auctionRouter.mjs";
import userRouter from "./routes/userRouter.mjs";
import { startAuctionTimer } from "./utils/auctionTimer.mjs";
import cookie from "cookie";

config();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("Hittade ingen anslutningssträng i din env-fil.");
}

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

const server = createServer(app);

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/auction", auctionRouter);
app.use("/item", bidRouter);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
  cookie: true,
});

io.on("connection", async (socket) => {
  console.log("Användaren är ansluten", socket.id);

  const auctions: Item[] = await ItemModel.find();

  socket.emit("auctionItems", auctions);

  socket.on("joinRoom", async (itemId: string) => {
    socket.join(itemId);

    const bidHistory = await ItemModel.findOne({ itemId: +itemId });

    if (bidHistory) {
      socket.emit("bidHistory", bidHistory.bids);
    }
  });

  socket.on("createBid", async (bid: BidDto, itemId: string) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");

    const loginCookie = cookies.login;

    if (!loginCookie) {
      return console.error("Användaren måste vara inloggad för att lägga bud");
    }
    console.log("Server createBid received", bid, itemId);

    const foundAuction = await ItemModel.findOne({ itemId: +itemId });

    if (!foundAuction) {
      throw new Error(`Kunde inte hitta auktionen med id: ${+itemId}`);
    }

    console.log("server emitting newBid", bid);

    io.to(itemId).emit("newBid", bid);
  });
});

server.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("API:et rullar på port:", PORT);
    startAuctionTimer(io);
  } catch (error) {
    console.error("Kunde inte ansluta till databasen:", error);
  }
});
