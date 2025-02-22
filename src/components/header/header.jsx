import React from "react";
import styles from "./header.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../../reducer/reducer";
import { Link, useNavigate } from "react-router-dom";
import defaultAvatar from "../../image/defaultAvatar/default-avatar.png";

function Header() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logoutSuccess());
    navigate("/");
  };

  return (
    <div className={styles.headerContainer}>
      <Link to="/articles" className={styles.menu}>
        Realworld Blog
      </Link>
      <div className={styles.autorzationsContainer}>
        {/* Кнопка "Create article" всегда на одном уровне */}
        <Link to="/new-article">
          <button
            className={
              isAuthenticated ? styles.createButtonAuth : styles.createButton
            }
          >
            Create article
          </button>
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/profile" className={styles.avatarLink}>
              <p>{user?.username}</p>
              <img
                src={user?.image || defaultAvatar}
                alt="User Avatar"
                className={styles.avatar}
              />
            </Link>
            <button className={styles.logOutButton} onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/sign-in" className={styles.link}>
              Sign In
            </Link>
            <Link to="/sign-up" className={styles.link}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
