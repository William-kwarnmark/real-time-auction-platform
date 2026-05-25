import { ItemModel } from "../models/itemSchema.mjs";
import { Bid, convertBidToDto } from "../models/bidSchema.mjs";
import type { BidDto } from "../models/bidDto.mjs";
import { minimumBidOffer } from "../utils/minimumbidOffer.mjs";
import type { BidRequest } from "../models/requests/bidRequest.mjs";
import User from "../models/userSchema.mjs";

export const getItem = async (id: string) => {
  return await ItemModel.findOne({ itemId: +id });
};

export const createBid = async (bid: BidRequest) => {
  const user = await User.findOne({ userId: +bid.userId });

  if (!user) {
    throw new Error("Ingen användare hittades med det angivna id");
  }

  const newBid: BidDto = {
    bidId: Date.now(),
    itemId: +bid.itemId,
    userId: +bid.userId,
    amount: +bid.amount,
    createdAt: new Date(),
  };

  const auction = await ItemModel.findOne({ itemId: +bid.itemId });

  if (!auction) {
    throw new Error("Hittade ingen auktion med det angivna id");
  }

  if (auction.status !== "active") {
    throw new Error("Auktion ej aktiv");
  }

  if (auction.userId === +bid.userId) {
    throw new Error("Kan ej buda på egen auktion");
  }

  const latestBid = auction.bids[auction.bids.length - 1];

  if (latestBid) {
    const currentBid = latestBid.amount;
    minimumBidOffer(currentBid, +bid.amount);
  } else {
    const currentBid = auction.startingBid;
    minimumBidOffer(currentBid, +bid.amount);
  }

  const createdBid = await Bid.create(newBid);

  auction.bids.push(newBid);

  // Startar om timern
  auction.endDate = new Date(Date.now() + 20000);

  await auction.save();

  return convertBidToDto(createdBid);
};
