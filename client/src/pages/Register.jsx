import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      await registerUser(
        form
      );

      alert(
        "Registration Successful"
      );

      navigate(
        "/login"
      );
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>
          Register
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={
              handleChange
            }
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={
              handleChange
            }
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={
              handleChange
            }
            required
          />

          <button
            type="submit"
          >
            Register
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?

          <Link to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
