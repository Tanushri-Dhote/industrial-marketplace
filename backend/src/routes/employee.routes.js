const express = require("express");
const router = express.Router();

const {
  getEmployees,
  updateEmployee,
  deleteEmployee,
  toggleStatus,
} = require("../controllers/employee.controller");

// GET
router.get("/", getEmployees);

// UPDATE
router.put("/:id", updateEmployee);

// DELETE
router.delete("/:id", deleteEmployee);

// TOGGLE STATUS
router.patch("/:id/status", toggleStatus);

module.exports = router;