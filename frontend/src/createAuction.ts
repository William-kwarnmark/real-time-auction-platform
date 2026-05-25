import type { auctionItem } from "./models/auctionItem";
import { createAuction } from "./service/auctionService";
import "./style.css";

document
  .getElementById("auctionForm")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = (
      document.getElementById("title") as HTMLInputElement
    ).value.trim();

    const description = (
      document.getElementById("description") as HTMLTextAreaElement
    ).value.trim();

    const image = (
      document.getElementById("image") as HTMLInputElement
    ).value.trim();

    const startingBid = (
      document.getElementById("startingBid") as HTMLInputElement
    ).value;

    const startDate = (
      document.getElementById("startDateTime") as HTMLInputElement
    ).value;

    if (!title && !description && !image && !startDate && !+startingBid) {
      alert("Fyll i alla fält för att skapa en auktion");
      return;
    }

    if (title === "" || title.length < 4) {
      alert("Rubriken måste vara minst 4 karaktärer");
      return;
    }

    if (!description) {
      alert("Skriv en beskrivning för produkten");
      return;
    }

    if (description.length > 1000) {
      alert("Beskrivningen ska vara max 1000 karaktärer");
      return;
    }

    if (!image) {
      alert("Lägg till en bild-url");
      return;
    }

    if (!startDate) {
      alert("Lägg till startdatumet för auktionen");
      return;
    }

    if (startingBid === "" || +startingBid <= 0) {
      alert("Utropspriset måste vara mer än 0 kr");
      return;
    }

    const item: auctionItem = {
      title,
      description,
      image,
      startingBid,
      startDate,
    };

    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("There's no userId in localStorage");
      return;
    }

    await createAuction(item, userId);

    location.href = "/";
  });
