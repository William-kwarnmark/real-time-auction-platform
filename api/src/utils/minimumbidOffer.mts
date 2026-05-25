import type { BidOffer } from "../models/bidOffer.mjs";

const INCREASE_WITH_FIVE_KR = 5;
const INCREASE_WITH_TEN_KR = 10;
const INCREASE_WITH_TWENTY_KR = 20;
const INCREASE_WITH_FIFTY_KR = 50;
const INCREASE_WITH_HUNDRED_KR = 100;

export const minimumBidOffer = (
  currentBidInKr: number,
  placedBidInKr: number,
) => {
  try {
    if (placedBidInKr <= currentBidInKr) {
      throw new Error(
        `Ditt bud måste vara större än det högsta budet som är ${currentBidInKr} kr.`,
      );
    }

    const bidOffer: BidOffer = {
      currentBidInKr,
      placedBidInKr,
    };

    if (currentBidInKr < 100) {
      calculateMinimumBidOffer(bidOffer, INCREASE_WITH_FIVE_KR);
    }

    if (currentBidInKr >= 100 && currentBidInKr < 1000) {
      calculateMinimumBidOffer(bidOffer, INCREASE_WITH_TEN_KR);
    }

    if (currentBidInKr >= 1000 && currentBidInKr < 5000) {
      calculateMinimumBidOffer(bidOffer, INCREASE_WITH_TWENTY_KR);
    }

    if (currentBidInKr >= 5000 && currentBidInKr < 10000) {
      calculateMinimumBidOffer(bidOffer, INCREASE_WITH_FIFTY_KR);
    }

    if (currentBidInKr >= 10000) {
      calculateMinimumBidOffer(bidOffer, INCREASE_WITH_HUNDRED_KR);
    }
  } catch (error) {
    throw error;
  }
};

function calculateMinimumBidOffer(bid: BidOffer, increase: number) {
  const minimumBidInKr = bid.currentBidInKr + increase;

  if (bid.placedBidInKr < minimumBidInKr) {
    throw new Error(`Minimum att buda just nu är ${minimumBidInKr}`);
  }

  console.log(`Budet ska vara minst ${minimumBidInKr} kr`);
}
