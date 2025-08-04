import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the items.
router.get("/allItemsList", async (req, res) => {
  let collection = await db.collection("items");
  let results = await collection.find({}).toArray();

  // console.log("items: ", results);
  res.send(results).status(200);
});

router.get("/getItemById/:id", async (req, res) => {
  let collection = await db.collection("items");
  let results = await collection.find({}).toArray();
  const id = req.params.id;
  const item = results.find(elem => elem.id === id);

  // console.log("item by id: ", item);
  res.send(item).status(200);
});

export default router;