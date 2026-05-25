export type CreateAuctionRequest = {
  title: string;
  description: string;
  image: string;
  userId: string;
  startingBid: number;
  startDate: string;
};
