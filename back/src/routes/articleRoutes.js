import { Router } from "express";
import { getAllArticles, getJournalists, getArticleById, createArticle, updateArticle, deleteArticle } from "../controllers/articleController.js";

const articleRouter = Router();
articleRouter.get("/articles/", getAllArticles);
articleRouter.get("/articles/:id", getArticleById);
articleRouter.post("/articles/", createArticle);
articleRouter.put("/articles/:id", updateArticle);
articleRouter.delete("/articles/:id", deleteArticle);
articleRouter.get("/journalists/", getJournalists);

export default articleRouter;
