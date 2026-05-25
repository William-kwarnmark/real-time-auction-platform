import { getUser } from "../service/userService";

export const showLoggedInUser = async () => {
  const loginBtn = document.getElementById("loginBtn") as HTMLButtonElement;
  const registerBtn = document.getElementById(
    "registerBtn",
  ) as HTMLButtonElement;
  const createAuctionBtn = document.getElementById(
    "createAuctionBtn",
  ) as HTMLButtonElement;
  const myAuctionsBtn = document.getElementById(
    "myAuctionsBtn",
  ) as HTMLButtonElement;
  const logOutBtn = document.getElementById("logOutBtn") as HTMLButtonElement;

  const userId = localStorage.getItem("userId");

  if (userId) {
    const user = await getUser(userId);

    const username = document.createElement("p");
    username.textContent = `Hej ${user.username}`;
    
    const userBox = document.getElementById("userBox");
    userBox?.appendChild(username);

    loginBtn.classList.toggle("hidden");
    registerBtn.classList.toggle("hidden");
    myAuctionsBtn.classList.toggle("hidden");
    createAuctionBtn.classList.toggle("hidden");
    logOutBtn.classList.toggle("hidden");
  }

  logOutBtn.addEventListener("click", async () => {
    localStorage.removeItem("userId");

    await fetch("/login/logout", {
      method: "POST",
      credentials: "include",
    });

    location.href = "/";
  });
};
