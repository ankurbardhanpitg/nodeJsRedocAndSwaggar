const express = require("express");

function createCompanyRouter(db) {
  const router = express.Router();

  // Ensure collection exists (avoids crashes when db.json has no "companies" yet)
  if (!db.has("companies").value()) {
    db.set("companies", []).write();
  }

  /**
   * Get all companies
   */
  router.get("/", (req, res) => {
    const companies = db.get("companies").value();
    return res.status(200).json(companies);
  });

  /**
   * Get company by id
   */
  router.get("/:id", (req, res) => {
    const { id } = req.params;
    const company = db.get("companies").find({ id }).value();

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json(company);
  });

  /**
   * Create a new company
   */
  router.post("/", (req, res) => {
    const { name, email, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "name and email are required",
      });
    }

    const newCompany = {
      id: Date.now().toString(),
      name,
      email,
      ...(address ? { address } : {}),
    };

    db.get("companies").push(newCompany).write();
    return res.status(201).json(newCompany);
  });

  /**
   * Update company by id
   */
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, address } = req.body;

    const existingCompany = db.get("companies").find({ id }).value();

    if (!existingCompany) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const updatedCompany = {
      ...existingCompany,
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
      ...(address ? { address } : {}),
    };

    db.get("companies").find({ id }).assign(updatedCompany).write();
    return res.status(200).json(updatedCompany);
  });

  /**
   * Delete company by id
   */
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const existingCompany = db.get("companies").find({ id }).value();

    if (!existingCompany) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    db.get("companies").remove({ id }).write();
    return res.status(200).json({
      message: "Company deleted successfully",
    });
  });

  return router;
}

module.exports = createCompanyRouter;

