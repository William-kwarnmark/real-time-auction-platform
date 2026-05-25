import type { BidDto } from "./bidDto.mjs";

export type Item = {
  itemId: number;
  title: string;
  description: string;
  image: string;
  userId: number;
  startingBid: number;
  winnerUser?: number;
  startDate: Date;
  endDate: Date;
  status: "pending" | "active" | "ended";
  bids: BidDto[];
};
