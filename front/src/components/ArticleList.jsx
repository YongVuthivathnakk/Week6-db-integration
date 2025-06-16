import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, getJournalists, removeArticle } from "../services/api";

//
// ArticleList component
//
export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [journalists, setJournalists] = useState([]);
  const [isJournalistsLoading, setIsJournalistsLoading] = useState(true);
  const [journalistsError, setJournalistsError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles(); // Fetch all articles when component mounts
    fetchJournalists();
  }, []);

  const fetchJournalists = async () => {
    setIsJournalistsLoading(true);
    setJournalistsError("");
    try {
      const data = await getJournalists();
      setJournalists(data);
    } catch (err) {
      setJournalistsError("Fail to load journalists. Please try again.");
      console.log(err);
    }
  }


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

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {journalistsError && <p style={{ color: "red" }}>{journalistsError}</p>}
      
      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={deleteArticle}
          />
        ))}
      </div>

    </>
  );
}


function JournalistCard({ journalist }) {
  return (
    <div className="journalist-card">
      <div className="journalist-name">{journalist.name}</div>
      <div className="journalist-id">Id: {journalist.id}</div>
    </div>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author">By {article.journalist_name}</div>

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
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}
