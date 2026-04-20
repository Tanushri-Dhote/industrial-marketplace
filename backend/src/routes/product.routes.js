const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const tenant = require("../middlewares/tenant.middleware");
const permission = require("../middlewares/permission.middleware");

const controller = require("../controllers/product.controller");


console.log("auth:", auth);
console.log("tenant:", tenant);
console.log("permission:", permission);
console.log("controller:", controller);
console.log("createProduct:", controller.createProduct);

// CREATE
router.post(
  "/",
  auth,
  tenant,
  permission("products", "create"),
  controller.createProduct
);

// GET
router.get(
  "/",
  auth,
  tenant,
  permission("products", "read"),
  controller.getProducts
);

// UPDATE
router.put(
  "/:id",
  auth,
  tenant,
  permission("products", "update"),
  controller.updateProduct
);

// DELETE
router.delete(
  "/:id",
  auth,
  tenant,
  permission("products", "delete"),
  controller.deleteProduct
);

module.exports = router;