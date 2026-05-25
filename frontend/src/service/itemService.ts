export const getSpecificItem = async (itemId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/item/${itemId}`);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Kunde inte hämta auktionen från api");

    return null;
  }
};

export const createBid = async (
  itemId: string,
  userId: string,
  amount: string,
) => {
  try {
    const response = await fetch(`http://localhost:3000/item/${itemId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, amount }),
      credentials: "include",
    });

    const data = await response.json();

    if (data.userId) {
      localStorage.setItem("userId", data.userId.toString());
    }

    return data;
  } catch (error) {
    console.error("Kunde inte logga in", error);

    return;
  }
};
