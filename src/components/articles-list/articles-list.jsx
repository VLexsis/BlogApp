import React, { useState } from "react";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import styles from "./articles-list.module.scss";
import Article from "../article/article";
import { useGetArticlesQuery } from "../../api/api";


function ArticlesList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const offset = (currentPage - 1) * pageSize;

  const { data, isLoading, isError } = useGetArticlesQuery({
    offset,
    limit: pageSize,
  });

  // Обработчик изменения страницы
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  if (isLoading)
    return (
      <div className={styles.load}>
        <Flex align="center" gap="middle">
          <div> Loading...</div>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Flex>
      </div>
    );
  if (isError) return <div>Error loading articles</div>;

  return (
    <section>
      <ul className={styles.articlesList}>
        {data.articles.map((article) => (
          <li key={article.slug}>
            <Link
              to={`/articles/${article.slug}`}
              className={styles.articleLink}
            >
              <Article key={article.slug} article={article} />
            </Link>
          </li>
        ))}
      </ul>
      <div className={styles.paginationContainer}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={data.articlesCount}
          onChange={handlePageChange}
          align="center"
        />
      </div>
    </section>
  );
}

export default ArticlesList;
