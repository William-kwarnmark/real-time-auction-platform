import "./style.css";
import { showLoggedInUser } from "./utils/showLoggedInUser";

document.getElementById("loginBtn")?.addEventListener("click", () => {
  location.href = "/login";
});

document.getElementById("registerBtn")?.addEventListener("click", () => {
  location.href = "../registerForm.html";
});

document.getElementById("createAuctionBtn")?.addEventListener("click", () => {
  location.href = "/createauction";
});

showLoggedInUser();
