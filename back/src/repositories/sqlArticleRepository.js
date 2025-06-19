//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//

import { pool } from "../utils/database.js";

// Get all journalist

export async function getJournalists() {
  try {
    const [result] = await pool.query("SELECT * from journalists");
    return result;
  } catch (error) {
    console.log("Error fetching articles: ", error);
    throw error;
  }
}

// Get all articles that written by a specific journalist id
export async function getJournalistsArticleById(id) {
  try {
    const [rows] = await pool.query(
      `SELECT 
        a.id, a.title, a.content, a.journalistId,
        j.name AS journalist_name,
        c.id AS category_id, c.name AS category_name
      FROM articles a
      JOIN journalists j ON a.journalistId = j.id
      LEFT JOIN article_categories ac ON a.id = ac.articleId
      LEFT JOIN categories c ON ac.categoryId = c.id
      WHERE a.journalistId = ?
      ORDER BY a.id`,
      [id]
    );

    // Group categories for each article
    const articlesMap = {};
    rows.forEach((row) => {
      if (!articlesMap[row.id]) {
        articlesMap[row.id] = {
          id: row.id,
          title: row.title,
          content: row.content,
          journalistId: row.journalistId,
          journalist_name: row.journalist_name,
          categories: [],
        };
      }
      if (row.category_id && row.category_name) {
        articlesMap[row.id].categories.push({
          id: row.category_id,
          name: row.category_name,
        });
      }
    });

    return Object.values(articlesMap);
  } catch (err) {
    console.log("Error fetching articles: ", err);
    throw err;
  }
}

// Get all articles
export async function getArticles() {
  try {
    const [rows] = await pool.query(`
    SELECT 
      a.id,
      a.title,
      a.content,
      a.journalistId,
      j.name AS journalist_name,
      c.id AS category_id,
      c.name AS category_name
    FROM articles a
    JOIN journalists j ON a.journalistId = j.id
    LEFT JOIN article_categories ac ON a.id = ac.articleId
    LEFT JOIN categories c ON ac.categoryId = c.id
    ORDER BY a.id
  `);

    // Group categories for each article
    const articlesMap = {};
    rows.forEach((row) => {
      if (!articlesMap[row.id]) {
        articlesMap[row.id] = {
          id: row.id,
          title: row.title,
          content: row.content,
          journalistId: row.journalistId,
          journalist_name: row.journalist_name,
          categories: [],
        };
      }
      if (row.category_id && row.category_name) {
        articlesMap[row.id].categories.push({
          id: row.category_id,
          name: row.category_name,
        });
      }
    });

    return Object.values(articlesMap);
  } catch (err) {
    console.log("Error fetching article: ", err);
    throw err;
  }
}

// GET one article by Id
export async function getArticleById(id) {
  try {
    const [rows] = await pool.query(
      `SELECT 
                a.*, 
                j.name AS journalist_name, 
                GROUP_CONCAT(c.name) AS categories,
                GROUP_CONCAT(c.id) AS categoryIds
            FROM articles a
            JOIN journalists j ON a.journalistId = j.id
            LEFT JOIN article_categories ac ON a.id = ac.articleId
            LEFT JOIN categories c ON ac.categoryId = c.id
            WHERE a.id = ?
            GROUP BY a.id`,
      [id]
    );
    if (rows.length === 0) return null;

    // Optionally, parse categoryIds as an array of numbers
    const article = rows[0];
    article.categoryIds = article.categoryIds
      ? article.categoryIds.split(",").map(Number)
      : [];
    article.categories = article.categories
      ? article.categories.split(",")
      : [];
    return article;
  } catch (err) {
    console.log("Error fetching article by id: ", err);
    throw err;
  }
}

// Create a new article
export async function createArticle(article) {
  const { title, content, journalistId, categoryIds } = article; // categoryIds is an array
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert the article
    const [result] = await connection.query(
      "INSERT INTO articles (title, content, journalistId) VALUES (?, ?, ?)",
      [title, content, journalistId]
    );
    const articleId = result.insertId;

    // Insert into article_categories for each categoryId
    for (const categoryId of categoryIds) {
      await connection.query(
        "INSERT INTO article_categories (articleId, categoryId) VALUES (?, ?)",
        [articleId, categoryId]
      );
    }

    await connection.commit();
    return { id: articleId, title, content, journalistId, categoryIds };
  } catch (err) {
    await connection.rollback();
    console.log("Error creating article: ", err);
    throw err;
  } finally {
    connection.release();
  }
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
  const { title, content, journalistId, categoryIds } = updatedData; // categoryIds is an array
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update main article fields
    await connection.query(
      "UPDATE articles SET title = ?, content = ?, journalistId = ? WHERE id = ?",
      [title, content, journalistId, id]
    );

    // Remove old category links
    await connection.query(
      "DELETE FROM article_categories WHERE articleId = ?",
      [id]
    );

    // Insert new category links
    for (const categoryId of categoryIds) {
      await connection.query(
        "INSERT INTO article_categories (articleId, categoryId) VALUES (?, ?)",
        [id, categoryId]
      );
    }

    await connection.commit();
    return { id, title, content, journalistId, categoryIds };
  } catch (err) {
    await connection.rollback();
    console.log("Error updating article: ", err);
    throw err;
  } finally {
    connection.release();
  }
}

// Delete an article by ID
export async function deleteArticle(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // First, delete related rows from article_categories
    await connection.query(
      "DELETE FROM article_categories WHERE articleId = ?",
      [id]
    );

    // Then, delete the article itself
    await connection.query("DELETE FROM articles WHERE id = ?", [id]);

    await connection.commit();
    return { message: "Article deleted successfully" };
  } catch (err) {
    await connection.rollback();
    console.log("Error deleting article: ", err);
    throw err;
  } finally {
    connection.release();
  }
}

// GET ALL Categories

export async function getAllCategories() {
  try {
    const [result] = await pool.query("SELECT * FROM categories");
    return result;
  } catch (err) {
    console.log("Error Fetching categorise", err);
    throw err;
  }
}

export async function getFilteredCategories(categoryId) {
  try {
    const [result] = await pool.query(
      `SELECT a.*, j.name AS journalist_name, c.name AS category_name
            FROM articles a
            JOIN journalists j ON a.journalistId = j.id
            JOIN article_categories ac ON a.id = ac.articleId
            JOIN categories c ON ac.categoryId = c.id
            WHERE c.id = ?
            ORDER BY a.id`,
      [categoryId]
    );
    return result;
  } catch (err) {
    console.log("Error Fetching Categories: ", err);
    throw err;
  }
}
