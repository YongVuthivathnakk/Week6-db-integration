import { Router } from "express";
import { getAllArticles, getJournalists, getArticleById, createArticle, updateArticle, deleteArticle, getJournalistsArticleById, getAllCategories, getFilteredCategories } from "../controllers/articleController.js";

const articleRouter = Router();
articleRouter.get("/articles/", getAllArticles);
articleRouter.get("/articles/:id", getArticleById);
articleRouter.post("/articles/", createArticle);
articleRouter.put("/articles/:id", updateArticle);
articleRouter.delete("/articles/:id", deleteArticle);
articleRouter.get("/journalists/", getJournalists);
articleRouter.get("/journalists/:id/articles", getJournalistsArticleById);
articleRouter.get("/categories", getAllCategories);
articleRouter.get("/categories/:id/articles", getFilteredCategories);

export default articleRouter;
