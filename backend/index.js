const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());

console.log("Start aplikacji");

app.get("/", (req, res) => {
  res.send("API działa!");
});

app.post("/tasks", async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Usunięto zadanie" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        completed: req.body.completed,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose
  .connect(
    "mongodb://admin:Test1234@ac-dr8clps-shard-00-00.dd4ju1c.mongodb.net:27017,ac-dr8clps-shard-00-01.dd4ju1c.mongodb.net:27017,ac-dr8clps-shard-00-02.dd4ju1c.mongodb.net:27017/todo?ssl=true&replicaSet=atlas-z5wzli-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Połączono z bazą");

    app.listen(5005, () => {
      console.log("Server działa na porcie 5005");
    });
  })
  .catch((err) => {
    console.log("BŁĄD POŁĄCZENIA:");
    console.log(err);
  });