import { ItemModel } from "../models/itemSchema.mjs";
import { Bid } from "../models/bidSchema.mjs";
import User from "../models/userSchema.mjs";

const TWENTY_SECONDS = 20000;

export const startAuctionTimer = (io: any) => {
  setInterval(async () => {
    try {
      const items = await ItemModel.find({
        status: { $in: ["pending", "active"] },
      });

      for (const item of items) {
        const now = Date.now();
        const start = new Date(item.startDate).getTime();
        const end = new Date(item.endDate).getTime();

        // Starta auktionen
        if (item.status === "pending" && now >= start) {
          item.status = "active";
          item.endDate = new Date(Date.now() + TWENTY_SECONDS);
          await item.save();

          console.log("Auktionen startad:", item.itemId);
          continue;
        }

        // nedräkning
        if (item.status === "active") {
          const secondsLeft = Math.max(0, Math.ceil((end - now) / 1000));

           io.to(item.itemId.toString()).emit("timerUpdate", {
            itemId: item.itemId,
            secondsLeft,
          });

          console.log("Auktion", item.itemId, "Sekunder kvar:", secondsLeft);

          // Avslut
          if (now >= end) {
            item.status = "ended";

            let winnerUserId: number | null = null;
            let winnerUsername: string | null = null;

            const highestBid = item.bids[item.bids.length - 1];

            if (highestBid) {
              const winningBid = await Bid.findOne({
                bidId: highestBid.bidId,
              });

              if (winningBid) {
                const winner = await User.findOne({
                  userId: winningBid.userId,
                });

                if (winner) {
                  item.winnerUser = winner.userId;

                  winnerUserId = winner.userId;
                  winnerUsername = winner.username;
                }

                console.log("Vinnare:", winner?.username ?? "okänd användare");
              } else {
                console.log("Ingen vinnare");
              }
            }

            await item.save();

            io.to(item.itemId.toString()).emit("auctionEnded", {
              itemId: item.itemId,
              winnerUserId,
              winnerUsername,
            });

            console.log("Auktionen är avslutad", item.itemId);
          }
        }
      }
    } catch (error) {
      console.error("Fel på timern", error);
    }
  }, 1000);
};
