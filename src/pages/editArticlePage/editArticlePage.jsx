import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useGetArticleBySlugQuery,
  useUpdateArticleMutation,
} from "../../api/api";
import styles from "./editArticlePage.module.scss";

function EditArticlePage() {
  const [articleData, setArticleData] = useState(null);
  const [tags, setTags] = useState([]); // Состояние для хранения тегов
  const [editableTags, setEditableTags] = useState([]); // Состояние для редактируемых тегов
  const [tagInput, setTagInput] = useState(""); // Состояние для ввода нового тега

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onBlur",
  });
  const navigate = useNavigate();

  const { slug } = useParams();
  const { data, isLoading, isError } = useGetArticleBySlugQuery(slug);
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();

  // Загрузка данных статьи и тегов
  useEffect(() => {
    if (data && data.article) {
      setArticleData(data.article);
      setTags(data.article.tagList || []); // Устанавливаем теги из данных статьи
      setEditableTags(data.article.tagList || []); // Инициализируем редактируемые теги
      reset({
        title: data.article.title,
        description: data.article.description,
        body: data.article.body,
      });
    }
  }, [data, reset]);

  // Добавление нового тега
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]); // Добавляем новый тег
      setEditableTags([...editableTags, tagInput.trim()]); // Добавляем новый тег в редактируемые
      setTagInput(""); // Очищаем поле ввода
    }
  };

  // Удаление тега
  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete)); // Удаляем тег
    setEditableTags(editableTags.filter((tag) => tag !== tagToDelete)); // Удаляем тег из редактируемых
  };

  // Обновление тега
  const handleUpdateTag = (index, newValue) => {
    const updatedTags = [...editableTags];
    updatedTags[index] = newValue; // Обновляем значение тега
    setEditableTags(updatedTags);
  };

  // Отправка формы
  const onSubmit = async (formData) => {
    try {
      await updateArticle({
        slug,
        articleData: {
          title: formData.title,
          description: formData.description,
          body: formData.body,
          tagList: editableTags, // Используем редактируемые теги
        },
      }).unwrap();
      navigate(`/articles/${slug}`);
    } catch (err) {
      console.error("Error response:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading article.</div>;

  return (
    <div className={styles.createArticleContainer}>
      <h3>Edit article</h3>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Title
            <input
              className={styles.input}
              placeholder="Title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className={styles.error}>{errors.title.message}</p>
            )}
          </label>
          <label>
            Short description
            <input
              className={styles.input}
              placeholder="Short description"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className={styles.error}>{errors.description.message}</p>
            )}
          </label>
          <label>
            Text
            <textarea
              className={styles.textarea}
              placeholder="Text"
              {...register("body", { required: "Text is required" })}
            />
            {errors.body && (
              <p className={styles.error}>{errors.body.message}</p>
            )}
          </label>
          <label>
            Tags
            <div>
              {/* Отображение текущих тегов с возможностью редактирования */}
              {editableTags.map((tag, index) => (
                <div key={index} className={styles.tagItem}>
                  <input
                    className={styles.inputTags}
                    placeholder="Tag"
                    value={tag}
                    onChange={(e) => handleUpdateTag(index, e.target.value)}
                  />
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
              {/* Поле для добавления нового тега */}
              <input
                className={styles.inputTags}
                placeholder="Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
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
          <button className={styles.buttonSend} type="submit">
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditArticlePage;
