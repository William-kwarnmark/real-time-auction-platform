import type { Bid } from "../models/bid";
import { getUser } from "../service/userService";

export const createBidHtml = async (bid: Bid) => {
  const bidHistory = document.getElementById("bidHistory") as HTMLElement;

  const bidTable = document.getElementById("bidHistoryTable") as HTMLElement;

  const tableRow = document.createElement("tr");

  const amountData = document.createElement("td");
  amountData.textContent = `${bid.amount} kr`;

  const user = await getUser(bid.userId.toString());

  const bidUserData = document.createElement("td");
  bidUserData.textContent = `@${user.username}`;

  const time = new Date(bid.createdAt);

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const timestampData = document.createElement("td");
  timestampData.textContent = `${hours}:${minutes}:${seconds}`;

  tableRow.append(amountData, bidUserData, timestampData);
  bidTable?.insertBefore(tableRow, bidTable.children[1]);
  bidHistory?.append(bidTable);
};
