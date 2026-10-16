import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface POST {
  username: string;
  title: string;
}

function App() {
  const [posts, setPosts] = useState<POST[]>([]);
  const navigate = useNavigate();

  const getPosts = async () => {
    const accessToken = await localStorage.getItem("access-token");
    console.log(accessToken);
    try {
      const res = await fetch("http://localhost:3001/posts", {
        credentials: "include",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.status !== 200) {
        navigate("/login");
      } else {
        setPosts(data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <ul>
        {posts.map((post, i) => (
          <li key={i}>
            <p>{post.username}</p>
            <p>{post.title}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
