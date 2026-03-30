import { useState, type ReactElement } from "react";
import "./AuthPage.scss";
import LoginForm from "./LoginForm/LoginForm";
import RegisterForm from "./RegisterForm/RegisterForm";

enum FormType {
  Register,
  Login,
}

function AuthPage(): ReactElement {
  const [formType, setFormType] = useState<FormType>(FormType.Login);

  return (
    <div className="AuthPage Page">
      <form className="form-type-selector">
        <button
          className={`btn ${formType === FormType.Register ? "primary" : ""}`}
          type="button"
          onClick={() => {
            if (formType !== FormType.Register) setFormType(FormType.Register);
          }}
        >
          Register
        </button>
        <button
          className={`btn ${formType === FormType.Login ? "primary" : ""}`}
          type="button"
          onClick={() => {
            if (formType !== FormType.Login) setFormType(FormType.Login);
          }}
        >
          Login
        </button>
      </form>

      {formType === FormType.Register ? <RegisterForm /> : <LoginForm />}
    </div>
  );
}

export default AuthPage;
