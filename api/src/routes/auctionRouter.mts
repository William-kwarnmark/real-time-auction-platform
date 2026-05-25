import { Router } from "express";
import { startAuctionTimer } from "../utils/auctionTimer.mjs";
import type { CreateAuctionRequest } from "../models/requests/createAuctionRequest.mjs";
import type { Item } from "../models/item.mjs";
import {
  createAuction,
  getAuctions,
} from "../controllers/auctionController.mjs";

const auctionRouter = Router();

auctionRouter.get("/", async (_, res) => {
  try {
    const auctions: Item[] = await getAuctions();

    if (!auctions) {
      return res
        .status(404)
        .json({ message: "Ingen auktion fanns i databasen" });
    }


    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Kunde inte hämta auktioner" });
  }
});

auctionRouter.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description, image, startingBid, startDate } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User id saknas" });
    }

    if (
      !title ||
      !description ||
      !image ||
      !userId ||
      !startingBid ||
      !startDate
    ) {
      return res.status(400).json({ message: "Det saknas något!" });
    }

    const item: CreateAuctionRequest = {
      title,
      description,
      image,
      userId,
      startingBid,
      startDate,
    };

    const newItem: Item = await createAuction(item);
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

export default auctionRouter;
