//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
// -  Perfrom the SQL querries to implement the bellow API
//

import { pool } from "../utils/database.js";


// Get all journalist

export async function getJournalists() {
    try{
        const [result] = await pool.query(
            'SELECT * from journalists'
        );
        return result;
    } catch (error) {
        console.log("Error fetching articles: ", error);
    }
}


// Get all articles that written by a specifi journalist id
export async function getAllArticlesByJournalistId(id) {
    try{
        const [result] = await pool.query(
            'SELECT a.*, j.name AS journalist_name, a.category FROM articles a JOIN journalist j ON a.journalistId = j.id WHERE j.id = ?', id
        );

        return result;
    } catch (error) {
        console.log("Error fetching articles: ", error);
    }
}



// Get all articles
export async function getArticles() {
    try{
        const [result] = await pool.query(
            `SELECT a.*, j.name AS journalist_name, a.category
            FROM articles a
            JOIN journalists j ON a.journalistId = j.id`
        );
        return result;
    } catch (err) {
        console.log("Error fetching article: ", err);
        throw err;
    }
}

// Get one article by ID
export async function getArticleById(id) {
    try{
        const [result] = await pool.query(
            `SELECT a.*, j.name AS journalist_name, a.category
            FROM articles a
            JOIN journalists j ON a.journalistId = j.id
            WHERE a.id = ?`, [id]
        );
        return(result);
    } catch (err) {
        console.log("Error fetching article: ", err);
        throw err;
    }
}

// Create a new article
export async function createArticle(article) {
    const { title, content, journalistId, category} = article;
    try {
        const [result] = await pool.query(
            'INSERT INTO articles (title, content, journalistId, category) VALUES (?, ?, ?, ?)',
            [title, content, journalistId, category]
        );
        return result;

    } catch(err) {
        console.log("Error fetching article: ", err);
        throw err;
    }
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    const {title, content, journalistId, category} = updatedData;

    try{
        const [result] = await pool.query(
            'UPDATE articles SET title = ?, content = ?, journalistId = ?, category = ? WHERE id = ?', 
            [title, content, journalistId, category, id]);
        return result.affectedRows > 0;
    } catch (err) {
        console.log("Error updating article: ", err);
        throw err;
    }
}

// Delete an article by ID
export async function deleteArticle(id) {
    try {
        const [result] = await pool.query(
            'DELETE FROM articles WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0; 
    } catch (err) {
        console.log("Error updating article: ", err);
        throw err;
    }
}
