document.getElementById("getSecret").addEventListener("click", async () => {
    const response = await fetch("https://chess-multiplayer-test.onrender.com/secret");
    const data = await response.json();
    document.getElementById("display").innerText = "Secret is: " + data.secret;
});