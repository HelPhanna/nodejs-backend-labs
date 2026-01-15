import express from "express";

const router = express.Router();

router.get("/", (rep, res) => {
  res.json({ message: "get!" });
});

router.post("/", (rep, res) => {
  res.json({ httpMethod: "post!" });
});

router.put("/", (rep, res) => {
  res.json({ httpMethod: "put!" });
});

router.delete("/", (rep, res) => {
  res.json({ httpMethod: "delete!" });
});

export default router;
