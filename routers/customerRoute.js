const express = require("express");
const customerRoute = require("../controllers/customerController");

const router = express.Router();

router.post("/create", customerRoute.customerCreate);

router.put("/update/:id", customerRoute.customerUpdate);

router.get("/list", customerRoute.customerGetAll);

router.get("/view/:id", customerRoute.customerView);

router.get("/delete/:id", customerRoute.customerDelete);



module.exports = router;