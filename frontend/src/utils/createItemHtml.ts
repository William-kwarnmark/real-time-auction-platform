import type { Bid } from "../models/bid";
import type { Item } from "../models/item";
import { getUser } from "../service/userService";
import { processForm } from "../socket";

export const createItemHtml = async (item: Item) => {
  const itemContainer = document.getElementById("itemContainer");

  if (!itemContainer) return;

  itemContainer.innerHTML = "";

  const itemImageContainer = document.createElement("div");
  itemImageContainer.className = "itemImageContainer";

  const itemImage = document.createElement("img");
  itemImage.src = item.image;
  itemImage.alt = item.title;

  const timerBox = document.createElement("div");
  timerBox.id = `timerBox-${item.itemId}`;
  timerBox.className = "timerBox";
  timerBox.textContent = "00:00";


  const itemInfoContainer = await itemInfo(item);

  const bidForm = createBidForm();
  bidForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    processForm(bidErrorMsg, item.itemId.toString());
  });

  const bidErrorMsg = document.createElement("p");
  bidErrorMsg.id = "bidErrorMsg";

const itemPageLayout = document.createElement("div");
itemPageLayout.className = "itemPageLayout";

const itemLeftColumn = document.createElement("div");
itemLeftColumn.className = "itemLeftColumn";

const itemRightColumn = document.createElement("div");
itemRightColumn.className = "itemRightColumn";

const bidSection = document.createElement("div");
bidSection.className = "bidSection";

const bidHistory = document.getElementById("bidHistory");

itemImageContainer.append(itemImage,timerBox);

bidSection.append(bidForm, bidErrorMsg);

itemLeftColumn.append(itemImageContainer);
itemRightColumn.append(itemInfoContainer, bidSection);

if (bidHistory) {
  itemRightColumn.append(bidHistory);
}

itemPageLayout.append(itemLeftColumn, itemRightColumn);
itemContainer.append(itemPageLayout);
};

const convertIsoDateToDate = (isoString: string) => {
  const date = new Date(isoString);

  const day = date.getDate();

  const monthNames = [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
  ];
  const monthName = monthNames[date.getMonth()];

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${monthName} ${hours}:${minutes}`;
};

const itemInfo = async (item: Item) => {
  const itemInfoContainer = document.createElement("div");
  itemInfoContainer.className = "itemInfoContainer";

  const itemSeller = document.createElement("p");
  const seller = await getUser(item.userId.toString());
  itemSeller.textContent = `@${seller.username}`;

  const itemTitle = document.createElement("h1");
  itemTitle.textContent = item.title;

  const auctionStartDate = document.createElement("p");
  const date = convertIsoDateToDate(item.startDate.toString());
  auctionStartDate.textContent = `Start: ${date}`;

  const highestBidText = document.createElement("p");
  highestBidText.id = "highestBidText";
  const highestBid: Bid = item.bids[item.bids.length - 1];
  if (highestBid) {
    highestBidText.textContent = `Högsta bud: ${highestBid.amount} kr`;
  }

  const startingBidText = document.createElement("p");
  startingBidText.textContent = `Utropspris: ${item.startingBid} kr`;

  const itemDescriptionContainer = document.createElement("div");
  itemDescriptionContainer.className = "itemDescriptionContainer";

  const descriptionHeading = document.createElement("h3");
  descriptionHeading.textContent = "Beskrivning:";

  const itemDescription = document.createElement("p");
  itemDescription.textContent = item.description;

  itemDescriptionContainer.append(descriptionHeading, itemDescription);
  itemInfoContainer.append(
    itemSeller,
    itemTitle,
    auctionStartDate,
    highestBidText,
    startingBidText,
    itemDescriptionContainer,
  );
  return itemInfoContainer;
};

const createBidForm = () => {
  const bidForm = document.createElement("form");
  bidForm.id = "bidForm";

  const bidLabel = document.createElement("label");
  bidLabel.textContent = "Ditt bud";
  bidLabel.setAttribute("for", "bidInput");

  const bidInput = document.createElement("input");
  bidInput.type = "number";
  bidInput.id = "bidInput";
  bidInput.min = "1";

  const bidSubmitBtn = document.createElement("button");
  bidSubmitBtn.textContent = "Lägg bud";

  bidForm.append(bidLabel, bidInput, bidSubmitBtn);
  return bidForm;
};
