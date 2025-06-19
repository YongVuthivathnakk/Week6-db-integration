import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, removeArticle } from "../services/api";

//
// ArticleList component
//


export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles(); // Fetch all articles when component mounts
  }, []);


  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      await removeArticle(id);
      await fetchArticles(); // refresh the list
    } catch (err) {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);

  const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  const handleJournalist = (id) => navigate(`/journalist/${id}/articles`);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {articles.length > 0 ? (
        <div className="article-list">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={deleteArticle}
              onJournalist={handleJournalist}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            paddingTop: "20px",
            fontSize: "1.5em",
          }}
        >
          No Article Available
        </div>
      )}
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete, onJournalist }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author">
        By&nbsp;
        <span
          style={{ cursor: "pointer" }}
          onClick={() => onJournalist(article.journalistId)}
          className="author-link"
        >
          {article.journalist_name}
        </span>
      </div>

      <div className="categories-list-group">
        {article.categories && article.categories.length > 0
          ? article.categories.map((cat) => (
              <div className="categories-list" key={cat.id}>
                {cat.name}
              </div>
            ))
          : <div className="categories-list">No categories</div>
        }
      </div>

      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button
          className="button-tertiary"
          onClick={() => onDelete(article.id)}
        >
          Delete
        </button>
        <button
          type="button"
          className="button-secondary"
          onClick={() => onView(article.id)}
        >
          View
        </button>
      </div>
    </div>
  );
}
