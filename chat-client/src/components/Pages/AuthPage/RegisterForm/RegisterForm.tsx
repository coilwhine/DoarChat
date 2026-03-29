import { type ReactElement } from "react";
import { useForm } from "react-hook-form";
import authService from "../../../../Services/Auth.Service";
import "./RegisterForm.scss";
import { useAppDispatch } from "../../../../store/hooks";
import { login } from "../../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import type { RegistrationData } from "../../../../Models/User.model";

function RegisterForm(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationData>();

  async function onSubmit(values: RegistrationData) {
    try {
      const newUser = await authService.register(values);

      dispatch(login(newUser));
      navigate("/app", { replace: true });
    } catch (error) {
      setError("root", {
        type: "server",
        message: (error as Error).message || "Registration failed",
      });
    }
  }

  return (
    <form
      className={`RegisterForm authForm ${isSubmitting ? "submitting" : ""}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="input-wrapper">
        <div className="input-row">
          <label htmlFor="name-input">Name</label>
          <input
            id="name-input"
            type="text"
            placeholder="Your name"
            disabled={isSubmitting}
            {...register("name", { required: "Name is required" })}
          />
        </div>
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>

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
            placeholder="Create a password"
            disabled={isSubmitting}
            {...register("password", { required: "Password is required" })}
          />
        </div>
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}
      </div>

      {errors.root && <p className="error-message">{errors.root.message}</p>}

      <button className="btn primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

export default RegisterForm;
