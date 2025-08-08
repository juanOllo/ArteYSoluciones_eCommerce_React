import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// GET complete items list
router.get("/allItemsList", async (req, res) => {
  let collection = await db.collection("items");
  let results = await collection.find({}).toArray();

  // console.log("items: ", results);
  res.send(results).status(200);
});

// GET item by _d
router.get("/getItem/:id", async (req, res) => {
  let collection = await db.collection("items");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// PATCH item by _id
router.patch("/updateItem/:id", async (req, res) => {
  // console.log("req item: ", req.body);
  try {
    const id = req.params.id;
    const updates = {
      $set: {
        name: req.body.name,
        priceXSize: req.body.priceXSize,
        info: req.body.info,
        images: req.body.images
      },
    };

    const collection = await db.collection("items");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      updates
    );

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating item");
  }
});

// POST new item
router.post("/addNewItem", async (req, res) => {
  try {
    let newDocument = {
      id: req.body.id,
      name: req.body.name,
      priceXSize: req.body.priceXSize,
      info: req.body.info,
      images: req.body.images
    };
    let collection = await db.collection("items");
    let result = await collection.insertOne(newDocument);
    
    // res.send(result).status(204);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding item");
  }
});

// DEL item by _id
router.delete("/deleteItem/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("items");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting item");
  }
});


export default router;