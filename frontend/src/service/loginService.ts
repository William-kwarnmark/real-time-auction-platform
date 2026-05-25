export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
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
