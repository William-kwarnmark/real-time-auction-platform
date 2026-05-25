import { loginUser } from "./service/loginService";
import "./style.css";

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = (
    document.getElementById("username") as HTMLInputElement
  ).value.trim();

  const password = (
    document.getElementById("password") as HTMLInputElement
  ).value.trim();

  const loginErrorMsg = document.getElementById("loginErrorMsg") as HTMLElement;

  const data = await loginUser(username, password);

  if (data.message) {
    return (loginErrorMsg.textContent = data.message);
  }

  location.href = "/";
});
