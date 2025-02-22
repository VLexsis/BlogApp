import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import { useParams } from "react-router-dom";
import {
  useGetArticleBySlugQuery,
  useDeleteArticleMutation,
  useLikeArticleMutation,
  useUnlikeArticleMutation,
} from "../../api/api";
import { useGetCurrentUserQuery } from "../../api/api";
import { format } from "date-fns";

import styles from "./articlePage.module.scss";

function ArticlePage() {
  const { slug } = useParams();
  const { data, isLoading, isError, refetch } = useGetArticleBySlugQuery(slug);
  const { data: currentUserData } = useGetCurrentUserQuery();
  const [deleteArticle] = useDeleteArticleMutation();
  const [likeArticle] = useLikeArticleMutation();
  const [unlikeArticle] = useUnlikeArticleMutation();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(data?.article?.favorited || false);
  const [likesCount, setLikesCount] = useState(
    data?.article?.favoritesCount || 0,
  );

  const isAuthor =
    currentUserData?.user?.username === data?.article?.author?.username;

  useEffect(() => {
    if (data) {
      setIsLiked(data.article.favorited);
      setLikesCount(data.article.favoritesCount);
    }
  }, [data]);

  const onDelete = async (slug) => {
    try {
      await deleteArticle({ slug }).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Failed to delete the article:", err);
      alert("Failed to delete the article. Please try again.");
    }
  };

  const handleLike = async () => {
    if (!currentUserData) {
      alert("You need to be logged in to like articles.");
      return;
    }

    try {
      if (isLiked) {
        await unlikeArticle(slug).unwrap();
        setLikesCount((prev) => prev - 1);
      } else {
        await likeArticle(slug).unwrap();
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked((prev) => !prev);
      refetch();
    } catch (err) {
      console.error("Failed to toggle like:", err);
      alert("Failed to toggle like. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.load}>
        <Flex align="center" gap="middle">
          <div> Loading...</div>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Flex>
      </div>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const startDate = new Date(data.article.createdAt);
  const formattedStartTime = format(startDate, "MMMM dd, yyyy");

  return (
    <div className={styles.articleList}>
      <article className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>{data.article.title}</h1>
            <button className={styles.likes} onClick={handleLike}>
              {isLiked ? "❤️" : "♡"} {likesCount}
            </button>
          </div>
          <div className={styles.author}>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>
                {data.article.author.username}
              </span>
              <span className={styles.date}>{formattedStartTime}</span>
            </div>
            <img
              className={styles.avatar}
              src={data.article.author.image}
              alt="user-avatar"
            />
          </div>
        </header>
        {isAuthor && (
          <div className={styles.buttonsContainer}>
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => onDelete(slug)}
              okText="Yes"
              cancelText="No"
            >
              <button className={styles.buttonDelete}>Delete</button>
            </Popconfirm>
            <Link to={`/articles/${data.article.slug}/edit`}>
              <button className={styles.buttonEdit}>Edit</button>
            </Link>
          </div>
        )}
        <div className={styles.tagsContainer}>
          {data.article.tagList.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.description}>{data.article.description}</div>
        <ReactMarkdown className={styles.articleBody}>
          {data.article.body}
        </ReactMarkdown>
      </article>
    </div>
  );
}

export default ArticlePage;
