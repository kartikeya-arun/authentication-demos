import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

interface FORM_DATA {
  username: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FORM_DATA>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const url = "http://localhost:3001/login";

  const login = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      res.status === 200 &&
        (await localStorage.setItem("access-token", data.accessToken)) &&
        navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const isAuthenticated = async () => {
    const accessToken = await localStorage.getItem("access-token");
    if (!accessToken) {
      navigate("/login");
    }
  };

  useEffect(() => {
    isAuthenticated();
  }, []);

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={login}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      <div>
        Not a member? Register <Link to={"/register"}>here</Link>
      </div>
    </>
  );
}
