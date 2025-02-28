import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useGetArticleBySlugQuery,
  useUpdateArticleMutation,
  useCreateArticleMutation,
} from "../../api/api";
import styles from "./articleFormPage.module.scss";
import { useSelector } from "react-redux";

function ArticleFormPage({ mode = "create" }) {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();
  const { slug } = useParams();
  const user = useSelector((state) => state.auth.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });
  const { data, isLoading, isError } = useGetArticleBySlugQuery(slug, {
    skip: mode === "create",
  });

  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();

  useEffect(() => {
    if (mode === "edit" && data?.article) {
      setTags(data.article.tagList || []);
      reset({
        title: data.article.title,
        description: data.article.description,
        body: data.article.body,
      });
    }
  }, [data, reset, mode]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const onSubmit = async (formData) => {
    const articlePayload = {
      title: formData.title,
      description: formData.description,
      body: formData.body,
      tagList: tags,
    };
    try {
      if (mode === "edit") {
        await updateArticle({
          slug,
          articleData: articlePayload,
        }).unwrap();
        navigate(`/articles/${slug}`);
      } else {
        await createArticle({
          article: {
            ...articlePayload,
            slug: formData.title.toLowerCase().replace(/ /g, "-"),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            favorited: false,
            favoritesCount: 0,
            author: {
              bio: user.bio || "",
              image: user.image,
              username: user.username,
              following: false,
            },
          },
        }).unwrap();
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to create the article:", err);
    } finally {
      reset();
    }
  };

  if (mode === "create" && isLoading) return <div>Loading...</div>;
  if (mode === "create" && isError) return <div>Error loading article.</div>;

  return (
    <div className={styles.ArticleFormContainer}>
      <h3>{mode === "create" ? "Create new article" : "Edit article"}</h3>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Title
            <input
              className={errors.title ? styles.inputError : styles.input}
              placeholder="Title"
              {...register("title", {
                required: "This field is required",
              })}
            />
            <div className={styles.error}>
              {errors?.title && <p>{errors?.title?.message}</p>}
            </div>
          </label>
          <label>
            Short description
            <input
              className={
                errors.shortDescription ? styles.inputError : styles.input
              }
              placeholder="Short description"
              {...register("description", {
                required: "This field is required",
              })}
            />
            <div className={styles.error}>
              {errors?.shortDescription && (
                <p>{errors?.shortDescription?.message}</p>
              )}
            </div>
          </label>
          <label>
            Text
            <textarea
              className={errors.text ? styles.inputTextError : styles.inputText}
              placeholder="Text"
              {...register("body", {
                required: "This field is required",
              })}
            />
            <div className={styles.error}>
              {errors?.text && <p>{errors?.text?.message}</p>}
            </div>
          </label>

          <label>
            Tags
            <div>
              {tags.map((tag, index) => (
                <div key={index} className={styles.tagContainer}>
                  <input className={styles.inputTags} value={tag} />
                  <button
                    type="button"
                    className={styles.buttonDelete}
                    onClick={() => handleDeleteTag(tag)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div>
              <input
                className={styles.inputTags}
                placeholder="Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                type="button"
                className={styles.buttonAddTag}
                onClick={handleAddTag}
              >
                Add tag
              </button>
            </div>
          </label>

          <button
            type="submit"
            className={styles.buttonSend}
            disabled={isLoading}
          >
            {mode === "create"
              ? isCreating
                ? "Creating..."
                : "Create"
              : isUpdating
                ? "Saving..."
                : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ArticleFormPage;
