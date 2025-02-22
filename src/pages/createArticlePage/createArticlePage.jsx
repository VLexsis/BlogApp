import React, { useState } from "react";
import { useCreateArticleMutation } from "../../api/api";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./createArticlePage.module.scss";
import { useSelector } from "react-redux";

function CreateArticlePage() {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });

  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const user = useSelector((state) => state.auth.user);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const onSubmit = async (data) => {
    try {
      await createArticle({
        article: {
          slug: data.title.toLowerCase().replace(/ /g, "-"),
          title: data.title,
          description: data.shortDescription,
          body: data.text,
          tagList: tags, // Исправлено на tagList
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

      reset(); // Сбрасываем форму
      navigate("/"); // Перенаправляем на главную страницу
    } catch (err) {
      console.error("Failed to create the article:", err);
    }
  };

  return (
    <div className={styles.createArticleContainer}>
      <h3>Create new article</h3>
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
              {...register("shortDescription", {
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
              {...register("text", {
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
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateArticlePage;
