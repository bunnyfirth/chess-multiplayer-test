document.getElementById("getSecret").addEventListener("click", async () => {
  const response = await fetch("https://YOUR_GLITCH_URL/secret");
  const data = await response.json();
  document.getElementById("display").innerText = "Secret is: " + data.secret;
});