import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./signUpPage.module.scss";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../../api/api";

function SignUpPage() {
  const {
    register,
    reset,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onblur",
  });
  const navigate = useNavigate();

  const handleServerError = (error) => {
    if (error.data && error.data.errors) {
      const serverErrors = error.data.errors;
      Object.keys(serverErrors).forEach((key) => {
        const errorMessage = Array.isArray(serverErrors[key])
          ? serverErrors[key].join(", ")
          : serverErrors[key];
        toast.error(`${key}: ${errorMessage}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      });
    } else if (error.status === "FETCH_ERROR") {
      // Network error (server unavailable)
      toast.error("Network Error: Unable to connect to the server", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      // Other errors
      toast.error(`Error: ${error.message || "Something went wrong"}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async (data) => {
    try {
      await registerUser({
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      }).unwrap();
      reset();
      navigate("/sign-in");
    } catch (err) {
      handleServerError(err);
    }
  };

  // To check password match
  const password = watch("password");

  return (
    <>
      <div className={styles.signUpContainer}>
        <ToastContainer />
        <h3>Create new account</h3>
        <div className={styles.formsContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              Username
              <input
                className={errors.username ? styles.inputError : ""}
                {...register("username", {
                  required: "This field is required",
                  pattern: {
                    value: /^[a-zA-Z][a-zA-Z0-9]*$/,
                    message: "You can only use English letters and numbers",
                  },
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Maximum number of characters 20",
                  },
                })}
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
                placeholder="Email address"
              />
              <div className={styles.error}>
                {errors?.email && <p>{errors?.email?.message}</p>}
              </div>
            </label>

            <label>
              Password
              <input
                type="password"
                className={errors.password ? styles.inputError : ""}
                {...register("password", {
                  required: "This field is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                  maxLength: {
                    value: 40,
                    message: "Maximum number of characters 40",
                  },
                })}
                placeholder="Password"
              />
              <div className={styles.error}>
                {errors?.password && <p>{errors?.password?.message}</p>}
              </div>
            </label>

            <label>
              Repeat Password
              <input
                type="password"
                className={errors.repeatPassword ? styles.inputError : ""}
                {...register("repeatPassword", {
                  required: "This field is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                placeholder="Repeat Password"
              />
              <div className={styles.error}>
                {errors?.repeatPassword && (
                  <p>{errors?.repeatPassword?.message}</p>
                )}
              </div>
            </label>

            <label
              className={
                errors.agreement
                  ? `${styles.labelCheckbox} ${styles.error}`
                  : styles.labelCheckbox
              }
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                {...register("agreement", {
                  required: "You must agree to the terms",
                })}
              />
              <p className={styles.textCheckbox}>
                I agree to the processing of my personal information
              </p>
            </label>
            <div className={styles.error}>
              {errors?.agreement && <p>{errors?.agreement?.message}</p>}
            </div>

            <button
              className={styles.createButton}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </form>
          <p className={styles.pFooter}>
            Already have an account?
            <Link to="/sign-in">
              <span> Sign in. </span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
