import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./article.module.scss";
import {
  useLikeArticleMutation,
  useUnlikeArticleMutation,
  useGetCurrentUserQuery,
} from "../../api/api";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function Article({ article }) {
  const [likeArticle] = useLikeArticleMutation();
  const [unlikeArticle] = useUnlikeArticleMutation();
  const { data: currentUserData } = useGetCurrentUserQuery();

  const [isLiked, setIsLiked] = useState(article?.favorited || false);
  const [likesCount, setLikesCount] = useState(article?.favoritesCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  const startDate = new Date(article.createdAt);
  const formattedStartTime = format(startDate, "MMMM dd, yyyy");

  useEffect(() => {
    if (article) {
      setIsLiked(article.favorited);
      setLikesCount(article.favoritesCount);
    }
  }, [article]);

  const handleLike = useCallback(
    async (event) => {
      event.stopPropagation(); // Останавливаем всплытие события

      if (isLoading) return;

      setIsLoading(true);

      if (!currentUserData) {
        alert("You need to be logged in to like articles.");
        return;
      }

      try {
        if (isLiked) {
          await unlikeArticle(article.slug).unwrap();
          setLikesCount((prev) => prev - 1);
        } else {
          await likeArticle(article.slug).unwrap();
          setLikesCount((prev) => prev + 1);
        }
        setIsLiked((prev) => !prev);
      } catch (err) {
        console.error("Failed to toggle like:", err);
        alert("Failed to toggle like. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentUserData,
      isLiked,
      article.slug,
      likeArticle,
      unlikeArticle,
      isLoading,
    ]
  );

  const shortedText = (text, maxLength) => {
    if (!text) return ""; // Если текст отсутствует, возвращаем пустую строку
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const shortedTags = (tags, maxLength) => {
    return tags.slice(0, maxLength);
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          {/* Оберните заголовок в <Link> */}
          <Link to={`/articles/${article.slug}`} className={styles.titleLink}>
            <h1 className={styles.title}>{shortedText(article.title, 20)}</h1>
          </Link>
          <button
            onClick={(event) => {
              event.stopPropagation(); // Останавливаем всплытие события
              handleLike(event);
            }}
            className={styles.likes}
            disabled={isLoading}
          >
            {isLiked ? (
              <HeartFilled style={{ color: "red" }} />
            ) : (
              <HeartOutlined />
            )}{" "}
            {likesCount}
          </button>
        </div>

        <div className={styles.author}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{article.author.username}</span>
            <span className={styles.date}>{formattedStartTime}</span>
          </div>
          <img
            className={styles.avatar}
            src={article.author.image}
            alt="user-avatar"
          />
        </div>
      </header>
      <Link to={`/articles/${article.slug}`} className={styles.titleLink}>
        <div className={styles.tagsContainer}>
          {shortedTags(article.tagList, 5).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.description}>
          {shortedText(article.description, 100)}
        </div>
      </Link>
    </article>
  );
}

Article.propTypes = {
  article: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    favorited: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    favoritesCount: PropTypes.number.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }).isRequired,
    tagList: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};

export default Article;
