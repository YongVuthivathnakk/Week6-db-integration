import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById } from "../services/api";

export default function ArticlePage() {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticle();
    console.log(article)
  }, [id]);


  const fetchArticle = async () => {
    try {
      setLoading(true);

      const found = await getArticleById(Number(id));
      if (found) {
        setArticle(found);
        setError("");
      } else {
        setArticle(null);
        setError("Article not found.");
      }
    } catch (err) {
      setError("Failed to fetch article.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading article...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>No article found.</div>;

  return (
    <div>
      <h1 style={{textAlign: "center"}}></h1>
    </div>
  );
}


// TODO: Get fix the api to fetch the article by id