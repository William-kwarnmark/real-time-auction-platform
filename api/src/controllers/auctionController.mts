import type { CreateAuctionRequest } from "../models/requests/createAuctionRequest.mjs";
import type { Item } from "../models/item.mjs";
import User from "../models/userSchema.mjs";
import { convertItemToDto, ItemModel } from "../models/itemSchema.mjs";

export const getAuctions = async () => {
  const auctionsFromDb = await ItemModel.find();

  return auctionsFromDb.map((auctionsFromDb) =>
    convertItemToDto(auctionsFromDb),
  );
};

export const createAuction = async (item: CreateAuctionRequest) => {
  const parsedStartDate = new Date(item.startDate);

  const parsedEndDate = new Date(Date.now() + 20000);

  const status = Date.now() < parsedStartDate.getTime() ? "pending" : "active";

  const user = await User.findOne({ userId: +item.userId });

  if (!user) {
    throw new Error("Ingen användare hittades med det angivna id:t");
  }

  const theItem: Item = {
    itemId: Date.now(),
    title: item.title,
    description: item.description,
    image: item.image,
    userId: +item.userId,
    startingBid: item.startingBid,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    status: status,
    bids: [],
  };

  const newItem = await ItemModel.create(theItem);

  return convertItemToDto(newItem);
};
