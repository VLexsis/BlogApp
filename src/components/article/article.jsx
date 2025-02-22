import React from "react";
import PropTypes from "prop-types"; // Импортируем PropTypes
import styles from "./article.module.scss";
import { format } from "date-fns";

function Article({ article }) {
  const startDate = new Date(article.createdAt);
  const formattedStartTime = format(startDate, "MMMM dd, yyyy");

  const isLiked = article.favorited;

  const shortedText = (text, maxLength) => {
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
          <h1 className={styles.title}>{shortedText(article.title, 20)}</h1>
          <span className={styles.likes}>
            {isLiked ? "❤️" : "♡"} {article.favoritesCount}
          </span>
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
    </article>
  );
}

Article.propTypes = {
  article: PropTypes.shape({
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
