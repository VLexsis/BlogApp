import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import styles from "./editProfilePage.module.scss";
import { useUpdateUserMutation } from "../../api/api";
import { updateUser as updateUserAction } from "../../reducer/reducer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProfilePage() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const user = useSelector((state) => state.auth.user);

  const onSubmit = async (data) => {
    try {
      // Обновляем данные пользователя
      const updatedUser = await updateUser({
        user: {
          email: data.email,
          username: data.username,
          bio: data.bio,
          image: data.avatar,
          password: data.password || user.password, // Используем новый пароль или старый
        },
      }).unwrap();

      // Обновляем состояние пользователя в Redux и localStorage
      dispatch(updateUserAction(updatedUser.user));
      localStorage.setItem("user", JSON.stringify(updatedUser.user));

      toast.success("Profile updated successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log("Updated User:", updatedUser.user);
    } catch (err) {
      console.error("Error response:", err);
      toast.error(
        `Error: ${
          err.data?.errors?.username ||
          err.data?.errors?.email ||
          err.data?.errors?.password || // Добавляем ошибку пароля
          err.message ||
          "Something went wrong"
        }`,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        },
      );
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.editContainer}>
        <ToastContainer />
        <h3>Edit Profile</h3>
        <div className={styles.formsContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              Username
              <input
                className={errors.username ? styles.inputError : ""}
                {...register("username", {
                  required: "This field is required",
                })}
                defaultValue={user.username || ""}
                placeholder="Username"
              />
              <div className={styles.error}>
                {errors?.username && <p>{errors?.username?.message}</p>}
              </div>
            </label>
            <label>
              Email address
              <input
                className={errors.email ? styles.inputError : ""}
                {...register("email", {
                  required: "This field is required",
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                    message: "Email address must be correct",
                  },
                })}
                defaultValue={user.email || ""}
                placeholder="Email address"
              />
              <div className={styles.error}>
                {errors?.email && <p>{errors?.email?.message}</p>}
              </div>
            </label>
            <label>
              New password
              <input
                type="password"
                className={errors.password ? styles.inputError : ""}
                {...register("password", {
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                  maxLength: {
                    value: 40,
                    message: "Maximum number of characters 40",
                  },
                })}
                placeholder="New password"
              />
              <div className={styles.error}>
                {errors?.password && <p>{errors?.password?.message}</p>}
              </div>
            </label>
            <label>
              Avatar image (URL)
              <input
                className={errors.avatar ? styles.inputError : ""}
                {...register("avatar", {
                  pattern: {
                    value: /^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9.\-_]+\.[a-zA-Z]{2,}$/,
                    message: "Image URL must be correct",
                  },
                })}
                defaultValue={user.image || ""}
                placeholder="Avatar image"
              />
              <div className={styles.error}>
                {errors?.avatar && <p>{errors?.avatar?.message}</p>}
              </div>
            </label>
            <button
              className={styles.saveButton}
              type="submit"
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditProfilePage;
