import React, { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await axios.get<Post[]>(
        "http://backend.hyundong.shop/api/posts"
      );
      setPosts(
        res.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  async function submitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return;

    try {
      await axios.post<Post>("http://backend.hyundong.shop/api/posts", {
        title,
        content,
      });
      window.location.reload();
    } catch (err) {
      console.error("Submit error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
              BBS
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              A simple bulletin board
            </p>
          </header>

          <main>
            <form
              onSubmit={submitPost}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                New Post
              </h2>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                rows={5}
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Submit
              </button>
            </form>

            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-transform transform hover:-translate-y-1"
                >
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {post.content}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
