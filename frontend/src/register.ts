import "./style.css";

document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = (
        document.getElementById("username") as HTMLInputElement
    ).value.trim();

    const email = (
        document.getElementById("email") as HTMLInputElement
    ).value.trim();

    const password = (
        document.getElementById("password") as HTMLInputElement
    ).value;

    const registerErrorMsg = document.getElementById("registerErrorMsg");

    if (registerErrorMsg) {
        registerErrorMsg.textContent = "";
    }

    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        let message = "Kunde inte skapa konto";

        try {
            const errorData = await response.json();
            if (errorData.message) {
                message = errorData.message;
            }
        } catch {
            console.error("Could not parse error response");
        }

        if (registerErrorMsg) {
            registerErrorMsg.textContent = message;
        }
        return;
    }

    const successMsg = document.getElementById("registerSuccessMsg");

    if (successMsg) {
        successMsg.textContent = "Konto skapat!";
    }

    setTimeout(() => {
        location.href = "/login";
    }, 1000);

 
});

