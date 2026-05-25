import "./style.css";
import { io } from "socket.io-client";
import type { Item } from "./models/item";
import { createAuctionCard } from "./utils/createAuctionCard";
import { createBidHtml } from "./utils/createBidHtml";
import { createBid, getSpecificItem } from "./service/itemService";
import { createItemHtml } from "./utils/createItemHtml";
import type { Bid } from "./models/bid";

const socket = io("http://localhost:3000", { withCredentials: true });

socket.on("auctionItems", (items: Item[]) => {
  const auctionsContainer = document.getElementById("auctionsContainer");

  if (!auctionsContainer) return;

  auctionsContainer.innerHTML = "";

  items.forEach((item) => {
    const auctionCard = createAuctionCard(item);
    auctionsContainer?.appendChild(auctionCard);
  });
});

const itemId = localStorage.getItem("selectedItemId");

console.log("item id:", itemId);

socket.on("connect", async () => {
  console.log("Frontend connected");

  if (itemId) {
    const item: Item = await getSpecificItem(itemId);
    await createItemHtml(item);
    socket.emit("joinRoom", itemId);
    console.log("Frontend joined room", itemId);
  }
});

socket.on("timerUpdate", (data) => {
  const timerBox = document.getElementById(`timerBox-${data.itemId}`);
  console.log("Timer Event:", data);
  if (!timerBox) return;

  const seconds = data.secondsLeft;

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");

  timerBox.textContent = `${minutes}:${remainingSeconds}`;
});

socket.on("auctionEnded", (data) => {
  const currentUserId = localStorage.getItem("userId");

  if (!currentUserId || !data.winnerUserId) return;

  if (String(data.winnerUserId) === String(currentUserId)) {
    showWinnerPopup(data.winnerUsername);
  }
});

socket.on("bidHistory", (bids: Bid[]) => {
  console.log("bidhistory", bids);

  bids.forEach((bid) => {
    createBidHtml(bid);
  });
});

socket.on("newBid", (bid: Bid) => {
  console.log("Frontend recived newBid", bid);
  createBidHtml(bid);

  const highestBidText = document.getElementById("highestBidText");
  if (highestBidText) {
    highestBidText.textContent = `Högsta bud: ${bid.amount} kr`;
  }
});

const showWinnerPopup = (username?: string) => {
  if (document.querySelector(".winnerOverlay")) return;
  const overlay = document.createElement("div");
  overlay.className = "winnerOverlay";

  const popup = document.createElement("div");
  popup.className = "winnerPopup";

  const text = document.createElement("h2");
  text.textContent = `Grattis ${username}, du har vunnit auktionen!`;
  

  const button = document.createElement("button");
  button.textContent = "Betala här!";

  popup.append(text, button);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
};

export const processForm = async (bidErrorMsg: HTMLElement, itemId: string) => {
  const theBid = (document.getElementById("bidInput") as HTMLInputElement)
    .value;

  if (!theBid) {
    return (bidErrorMsg.textContent =
      "Du måste skriva in ett värde för att lägga ett bud");
  }

  const userId = localStorage.getItem("userId");

  if (!userId) {
    return console.error("There is no user ID in localStorage");
  }

  const data = await createBid(itemId, userId, theBid);

  if (data.message) {
    return (bidErrorMsg.textContent = data.message);
  }

  socket.emit("createBid", data, itemId);

  (document.getElementById("bidInput") as HTMLInputElement).value = "";
};
