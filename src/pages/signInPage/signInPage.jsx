import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../reducer/reducer";
import styles from "./signInPage.module.scss";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
  });

  const [loginUser, { isLoading }] = useLoginMutation();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser({
        user: {
          email: data.email,
          password: data.password,
        },
      }).unwrap();

      toast.success("Login successful!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      reset();
      navigate("/articles");
      dispatch(loginSuccess(response.user));
      localStorage.setItem("token", response.user.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        `Error: ${
          err.data?.errors?.["email or password"] || "Something went wrong"
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

  return (
    <>
      <div className={styles.signInContainer}>
        <ToastContainer />
        <h3>Login</h3>
        <div className={styles.formsContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                })}
                placeholder="Password"
              />
              <div className={styles.error}>
                {errors?.password && <p>{errors?.password?.message}</p>}
              </div>
            </label>
            <button
              className={styles.loginButton}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className={styles.pFooter}>
            Don’t have an account?
            <Link to="/sign-up">
              <span> Sign Up. </span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignInPage;
