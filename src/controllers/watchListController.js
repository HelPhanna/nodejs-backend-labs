import { prisma } from "../config/db.js";

const addToWatchList = async (req, res) => {
  const { movieId, status, rating, note, userId } = req.body;

  // verify movie exist
  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });
  if (!movie) {
    return res.status(404).json({ error: "Movie not found!" });
  }

  // check if already added
  const existingInWatchList = await prisma.watchListItem.findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId,
      },
    },
  });

  if (existingInWatchList) {
    return res.status(400).json({ error: "Movie already in the watchList!" });
  }

  const watchListItem = await prisma.watchListItem.create({
    data: {
      userId: req.user.id,
      movieId,
      status: status || "PLANNED",
      rating,
      note,
    },
  });

  res.status(201).json({
    status: "Success",
    data: {
      watchListItem,
    },
  });
};

/**
 * Update watchList item
 * Updates status, rating, or notes
 * Ensures only owner can update
 * Requires protect middleware
 */
const updateWatchListItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  // Find watchList item and verify ownership
  const watchListItem = await prisma.watchListItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchListItem) {
    return res.status(404).json({ error: "WatchList item not found" });
  }

  // Ensure only owner can update
  if (watchListItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchList item" });
  }

  // Build update data
  const updateData = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  // Update watchList item
  const updatedItem = await prisma.watchListItem.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({
    status: "success",
    data: {
      watchListItem: updatedItem,
    },
  });
};

/**
 * Remove movie from watchList
 * Deletes watchList item
 * Ensures only owner can delete
 * Requires protect middleware
 */
const removeFromWatchList = async (req, res) => {
  // Find watchList item and verify ownership
  const watchListItem = await prisma.watchListItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchListItem) {
    return res.status(404).json({ error: "WatchList item not found" });
  }

  // Ensure only owner can delete
  if (watchListItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchList item" });
  }

  await prisma.watchListItem.delete({
    where: { id: req.params.id },
  });

  res.status(200).json({
    status: "success",
    message: "Movie removed from watchList",
  });
};

export { addToWatchList, updateWatchListItem, removeFromWatchList };
