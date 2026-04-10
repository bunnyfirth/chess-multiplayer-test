const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));

app.get("/secret", (req, res) => {
  res.json({ secret: "Cheese" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));