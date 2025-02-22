import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../reducer/reducer"; //
import { PrivateRoute } from "../private-route/private-route";
import ArticlesList from "../articles-list/articles-list";
import ArticlePage from "../../pages/articlePage/articlePage";
import SignUpPage from "../../pages/signUpPage/signUpPage";
import SignInPage from "../../pages/signInPage/signInPage";
import EditProfilePage from "../../pages/editProfilePage/editProfilePage";
import CreateArticlePage from "../../pages/createArticlePage/createArticlePage";
import EditArticlePage from "../../pages/editArticlePage/editArticlePage";
import Header from "../header/header";

import styles from "./app.module.scss";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      dispatch(loginSuccess(user));
    }
  }, [dispatch]);

  return (
    <Router>
      <div className={styles.body}>
        <Header />
        <Routes>
          <Route path="/" element={<ArticlesList />} />
          <Route path="/articles" element={<ArticlesList />} />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/profile" element={<EditProfilePage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/new-article" element={<CreateArticlePage />} />
          </Route>
          <Route path="/articles/:slug/edit" element={<EditArticlePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
