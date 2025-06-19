import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticleByJournalistsId } from "../services/api";

//
// ArticleList component
//
export default function ArticleList() {
  const [journalistArticle, setJournalistArticle] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJournalistArticle(); // Fetch all journalistArticle when component mounts
  }, []);


  const fetchJournalistArticle = async () => {
    try {
      setIsLoading(true);
      const found = await getArticleByJournalistsId(id);
      if (found) {
        setJournalistArticle(found);
        setError("");
      } else {
        setJournalistArticle(null);
        setError("Article not found.");
      }
    } catch (err) {
      setError("Failed to fetch article.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);

//   const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h1 className="article-list-header">
        {journalistArticle.length > 0 && journalistArticle[0].journalist_name
          ? journalistArticle[0].journalist_name
          : "Unknown"}
      </h1>
      <div className="article-list">
        {journalistArticle.map((article) => (
            <ArticleCard 
                key={article.id}
                article={article}
                onView={handleView}
            />
        ))}
      </div>
    </>
  );
}


function ArticleCard({ article, onView }) {
  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>

      <div className="article-description">
        <div className="article-author">By {article.journalist_name}</div>
            <button className="button-secondary" onClick={() => onView(article.id)}>
            View
            </button>
      </div>
    </div>
  );
}
