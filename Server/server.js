const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productsRouter = require("./routes/products");
const txRouter = require("./routes/transactions");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/inventorydb";

connectDB(MONGO_URI);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/products", productsRouter);
app.use("/transactions", txRouter);

app.get("/", (req, res) => res.send("Inventory API is running"));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
