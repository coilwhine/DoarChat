import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./LoginForm.scss";
import { useAppDispatch } from "../../../../store/hooks";
import authService from "../../../../Services/Auth.Service";
import { login } from "../../../../store/authSlice";
import type { AuthCredentials } from "../../../../Models/Auth.model";

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AuthCredentials>();

  async function onSubmit(values: AuthCredentials) {
    try {
      const newUser = await authService.login(values);
      dispatch(login(newUser));
      navigate("/app", { replace: true });
    } catch (error) {
      setError("root", {
        type: "server",
        message: (error as Error).message || "Login failed",
      });
    }
  }

  return (
    <form
      className={`LoginForm authForm ${isSubmitting ? "submitting" : ""}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="input-wrapper">
        <div className="input-row">
          <label htmlFor="email-input">Email</label>
          <input
            id="email-input"
            type="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            {...register("email", { required: "Email is required" })}
          />
        </div>
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}
      </div>

      <div className="input-wrapper">
        <div className="input-row">
          <label htmlFor="password-input">Password</label>
          <input
            id="password-input"
            type="password"
            placeholder="password"
            {...register("password", { required: "Password is required" })}
          />
        </div>
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}
      </div>

      {errors.root && <p className="error-message">{errors.root.message}</p>}

      <button className="btn primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
