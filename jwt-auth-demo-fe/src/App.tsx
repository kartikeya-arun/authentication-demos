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
    try {
      const res = await fetch("http://localhost:3001/posts", {
        credentials: "include",
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
