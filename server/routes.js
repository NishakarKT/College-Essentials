import express from "express";
import { User } from "./models.js";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// users
Router.get("/user", async (req, res) => {
  let query = req.query;
  if (query.location && query.range) {
    query["location"] = {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [Number(query.location.lg), Number(query.location.la)],
        },
        $maxDistance: Number(Number(query.range) || 100000),
      },
    };
    delete query["range"];
  }
  try {
    const users = await User.find(query);
    if (users.length) res.status(200).send(users);
    else res.status(404).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

Router.post("/user", async (req, res) => {
  const user = req.body;
  user["location"] = {
    type: "Point",
    coordinates: [Number(user.location.lg), Number(user.location.la)],
  };
  try {
    const newUser = await User.create(user);
    res.status(201).send(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

export default Router;
