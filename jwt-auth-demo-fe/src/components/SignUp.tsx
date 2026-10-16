import { useState } from "react";
import { data, Link, useNavigate } from "react-router";

interface FORM_DATA {
  username: string;
  password: string;
  confirmPassword: string;
}
export default function SignUp() {
  const [formData, setFormData] = useState<FORM_DATA>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const url = "http://localhost:3001/register";
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const signup = async (e: React.SubmitEvent) => {
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
      console.log(data);
      const accessToken = data.accessToken;
      console.log(accessToken);
      accessToken && (await localStorage.setItem("access-token", accessToken));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>Register</h1>
      <form onSubmit={signup}>
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
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>
      <div>
        Already registered? Login <Link to={"/login"}>here</Link>
      </div>
    </>
  );
}
