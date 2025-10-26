import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import useApi from '../hooks/useApi';

const PostList = () => {
  const { posts, setPosts, setCategories } = useContext(AppContext);
  const { request, loading, error } = useApi();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postData, categoryData] = await Promise.all([
          request('get', `/posts?page=${page}&limit=10`),
          request('get', '/categories'),
        ]);
        setPosts(postData.posts);
        setTotalPages(postData.pages);
        setCategories(categoryData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [page]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Blog Posts</h1>
      {posts.map(post => (
        <div key={post._id} className="border p-4 mb-2 rounded">
          <h2 className="text-xl"><Link to={`/posts/${post._id}`}>{post.title}</Link></h2>
          <p>{post.content.substring(0, 100)}...</p>
          <p>Category: {post.category?.name}</p>
          <p>Author: {post.author?.username}</p>
          {post.image && <img src={`/Uploads/${post.image}`} alt={post.title} className="mt-2 max-w-full h-auto" />}
        </div>
      ))}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostList;
