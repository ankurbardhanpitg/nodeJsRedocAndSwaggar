const express = require("express");

function createUsersRouter(db) {
  const router = express.Router();

  router.get("/", (req, res) => {
    const users = db.get("users").value();
    res.status(200).json(users);
  });

  router.post("/", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "name and email are required",
      });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
    };

    db.get("users").push(newUser).write();
    return res.status(201).json(newUser);
  });

  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const existingUser = db.get("users").find({ id }).value();

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const updatedUser = {
      ...existingUser,
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
    };

    db.get("users").find({ id }).assign(updatedUser).write();
    return res.status(200).json(updatedUser);
  });

  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const existingUser = db.get("users").find({ id }).value();

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    db.get("users").remove({ id }).write();
    return res.status(200).json({
      message: "User deleted successfully",
    });
  });

  return router;
}

module.exports = createUsersRouter;
