import * as sqlArticleRepository from "../repositories/sqlArticleRepository.js";

// TODO : Change articleRepository to use the sqlArticleRepository


// GET / all articles by journalist id 

export async function  getAllArticlesByJournalistId(req, res) {
  try {
    const articles = await sqlArticleRepository.getAllArticlesByJournalistId(req.params.id);
    res.json(articles);
  } catch (error) {
    console.log("Error fetching articles:", error);
    res.status(500).json({ message: "Server Error"});
  }
}

export async function getJournalists(req, res) {
  try {
    const journalists = await sqlArticleRepository.getJournalists();
    res.json(journalists)
  } catch (error) {
    console.log("Error fetching articles: ", error);
    res.status(500).json({ message: "Server Error"});
  }
} 


// GET /api/articles
export async function getAllArticles(req, res) {
  try {
    const articles = await sqlArticleRepository.getArticles();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/:id
export async function getArticleById(req, res) {
  try {
    const article = await sqlArticleRepository.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/articles
export async function createArticle(req, res) {
  try {
    const newArticle = await sqlArticleRepository.createArticle(req.body);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/articles/:id
export async function updateArticle(req, res) {
  try {
    const updatedArticle = await sqlArticleRepository.updateArticle(
      req.params.id,
      req.body
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/articles/:id
export async function deleteArticle(req, res) {
  try {
    await sqlArticleRepository.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Server error" });
  }
}
