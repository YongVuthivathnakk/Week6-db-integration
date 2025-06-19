import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById, createArticle, updateArticle, getAllCategories } from "../services/api";



export default function ArticleForm({ isEdit }) {
  
  
  const { id } = useParams();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    title: "",
    content: "",
    journalistId: "",
    categoryIds: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [errorCategory, setErrorCategory] = useState("");

  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    if (isEdit && id) {
      fetchArticle(id);
    }
    fetchCategories();
    console.log(categoriesData)

  }, []);

  const fetchArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      const article = await getArticleById(id);
      setFormData(article);
    } catch (err) {
      setError("Failed to load article. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setIsCategoryLoading(true);
    setError("");
    try {
      const categories = await getAllCategories();
      setCategoriesData(categories);
    } catch (err) {
      setErrorCategory("Failed to load categories.");
    } finally {
      setIsCategoryLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, 
      [name]: name === "journalistId" ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isEdit) {
        await updateArticle(id, formData);
      } else {
        await createArticle(formData);
      }
      navigate("/articles");
    } catch (err) {
      setError("Failed to submit article.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (id) => {
      setFormData((prev) => {
        const ids = prev.categoryIds || [];
        if (ids.includes(id)) {
          // Remove if already selected
          return { ...prev, categoryIds: ids.filter((catId) => catId !== id) };
        } else {
          // Add if not selected
          return { ...prev, categoryIds: [...ids, id] };
        }
      });
    };


  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {errorCategory && <p style={{ color: "red" }}>{errorCategory}</p>}

      <form className="article-form" onSubmit={handleSubmit}>
        <h2>{isEdit ? "Edit Article" : "Create Article"}</h2>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <br />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
          required
        />
        <br />
        {/* Journalist ID input */}
        <input
          name="journalistId"
          value={formData.journalistId}
          onChange={handleChange}
          placeholder="Journalist ID"
          required
        />
        <br />
        {/* Category selector */}
        <label htmlFor="category">Categories</label>
        <div className="category-button-group">
          {categoriesData.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`button-tertiary${formData.categoryIds.includes(item.id) ? " selected" : ""}`}
              onClick={() => handleCategoryClick(item.id)}
            >
              {item.name}
            </button>

          ))}
        </div>


        {/* <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="news">News</option>
          <option value="sports">Sports</option>
          <option value="tech">Tech</option>
        </select> */}
        <button className="main" type="submit">
          {isEdit ? "Edit " : "Create"}
        </button>
      </form>
    </>
  );
}