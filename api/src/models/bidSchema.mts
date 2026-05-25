import mongoose, { type InferSchemaType } from "mongoose";
import type { BidDto } from "./bidDto.mjs";

export const bidSchema = new mongoose.Schema({
  bidId: { type: Number, required: true },
  itemId: { type: Number, required: true },
  userId: { type: Number, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export const Bid = mongoose.model("Bid", bidSchema);

export type BidType = InferSchemaType<typeof bidSchema>;

export const convertBidToDto = (bid: BidType): BidDto => {
  return {
    bidId: bid.bidId,
    itemId: bid.itemId,
    userId: bid.userId,
    amount: bid.amount,
    createdAt: bid.createdAt,
  } satisfies BidDto;
};
