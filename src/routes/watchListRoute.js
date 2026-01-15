// Import Express framework
import express from "express";

// Import from controller
import {
  addToWatchList,
  removeFromWatchList,
  updateWatchListItem,
} from "../controllers/watchListController.js";

import { authMiddleware } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.use(authMiddleware);

// add
router.post("/", addToWatchList);

// update
router.put("/:id", updateWatchListItem);

// delete
router.delete("/:id", removeFromWatchList);

export default router;
