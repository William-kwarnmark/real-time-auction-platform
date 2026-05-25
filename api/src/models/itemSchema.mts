import { model, Schema, type InferSchemaType } from "mongoose";
import { bidSchema } from "./bidSchema.mjs";
import type { Item } from "./item.mjs";

const itemSchema = new Schema({
  itemId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  userId: { type: Number, required: true },
  startingBid: { type: Number, required: true },
  winnerUser: { type: Number, required: false, default: null },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "active", "ended"],
    required: true,
    default: "pending",
  },
  bids: [bidSchema],
});

export const ItemModel = model("Item", itemSchema);

export type ItemType = InferSchemaType<typeof itemSchema>;

export const convertItemToDto = (item: ItemType): Item => {
  return {
    itemId: item.itemId,
    title: item.title,
    description: item.description,
    image: item.image,
    userId: item.userId,
    startingBid: item.startingBid,
    startDate: item.startDate,
    endDate: item.endDate,
    status: item.status,
    bids: item.bids,
  };
};
