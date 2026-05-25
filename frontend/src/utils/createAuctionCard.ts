import type { Item } from "../models/item";

export const createAuctionCard = (item: Item) => {
  const auctionCard = document.createElement("div");
  auctionCard.className = "auctionCard";

  const imageContainer = document.createElement("div");
  imageContainer.className = "imageContainer";
  imageContainer.addEventListener("click", () => {
    localStorage.setItem("selectedItemId", item.itemId.toString());

    location.href = "/item";
  });

  const image = document.createElement("img");
  image.src = item.image;
  image.alt = item.title;

  const auctionCardDetails = document.createElement("div");
  auctionCardDetails.className = "auctionCardDetails";

  const auctionTitle = document.createElement("h3");
  auctionTitle.textContent = item.title;
  auctionTitle.addEventListener("click", () => {
    localStorage.setItem("selectedItemId", item.itemId.toString());

    location.href = "/item";
  });

  const auctionPrice = document.createElement("p");
  auctionPrice.textContent = `Utropspris: ${item.startingBid} kr`;

  const latestBid = item.bids[item.bids.length - 1];

    const startDate = new Date(item.startDate);

  const formattedDate = startDate.toLocaleString("sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const startDateText = document.createElement("p");
  startDateText.textContent = `Start: ${formattedDate}`;

  auctionCardDetails.append(auctionTitle, auctionPrice);
  if (latestBid) {
    const highestBidAmount = document.createElement("p");
    highestBidAmount.textContent = `Högsta budet: ${latestBid.amount} kr`;

    auctionCardDetails.append(highestBidAmount);
  }

  auctionCardDetails.append(startDateText)
  imageContainer.appendChild(image);
  auctionCard.append(imageContainer, auctionCardDetails);
  return auctionCard;
};
