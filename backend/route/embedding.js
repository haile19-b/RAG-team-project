import express from "express";
import { embedData, getReleventData } from "../controller/embedding.js";

export const embeddingRoure = express.Router();

embeddingRoure.post('/add-data',embedData)
embeddingRoure.get('/get-data',getReleventData)