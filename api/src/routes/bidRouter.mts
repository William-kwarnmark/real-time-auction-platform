import express from "express";
import type { BidDto } from "../models/bidDto.mjs";
import { createBid, getItem } from "../controllers/bidController.mjs";
import type { BidRequest } from "../models/requests/bidRequest.mjs";

export const bidRouter = express.Router();

bidRouter.get("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    const foundItem = await getItem(itemId);

    if (!foundItem) {
      console.error("Ingen auktion matchade med id");
      return res
        .status(404)
        .json({ message: `Ingen auktion matchade med id: ${itemId}` });
    }

    res.status(200).json(foundItem);
  } catch (error) {
    console.error(error);
  }
});

bidRouter.post("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { userId, amount } = req.body;

    if (!itemId || !userId || !amount) {
      return res
        .status(400)
        .json({ message: "itemId, userId eller amount saknas" });
    }

    const bid: BidRequest = { itemId, userId, amount };

    const newBid: BidDto = await createBid(bid);

    res.status(201).json(newBid);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Budet uppnår inte alla förväntade krav",
    });
  }
});
