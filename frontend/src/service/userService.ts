export const getUser = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/user/${userId}`);

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Kunde inte hämta användaren från api");

    return null;
  }
};
