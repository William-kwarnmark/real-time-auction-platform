import type { auctionItem } from "../models/auctionItem";

export const getAllAuctions = async () => {
  try {
    const response = await fetch(`http://localhost:3000/auction`);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Kunde inte hämta auktioner från databasen");
    return null;
  }
};

export const getUsersAuctions = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/auction/${userId}`);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Kunde inte hämta användarens auktioner från api");

    return null;
  }
};

export const createAuction = async (item: auctionItem, userId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/auction/${userId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(item),
      credentials: "include",
    });

    const data = await response.json();

    return data;
  } catch (error) {
    alert("Något gick fel vid anropet för att skapa auktionen");
    console.error(error);
    return;
  }
};
