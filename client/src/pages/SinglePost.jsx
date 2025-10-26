import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import useApi from '../hooks/useApi';
import { AuthContext } from '../context/AuthContext';

const SinglePost = () => {
  const { id } = useParams();
  const { request, loading, error } = useApi();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postData, commentData] = await Promise.all([
          request('get', `/posts/${id}`),
          request('get', `/comments/${id}`),
        ]);
        setPost(postData);
        setComments(commentData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const newComment = await request('post', '/comments', { content: commentContent, postId: id });
      setComments([...comments, newComment]);
      setCommentContent('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!post) return null;

  return (
    <div className="p-4">
      <h1 className="text-2xl">{post.title}</h1>
      {post.image && <img src={`/Uploads/${post.image}`} alt={post.title} className="my-4 max-w-full h-auto" />}
      <p>{post.content}</p>
      <p>Category: {post.category?.name}</p>
      <p>Author: {post.author?.username}</p>
      <div className="mt-4">
        <h2 className="text-xl">Comments</h2>
        {comments.map(comment => (
          <div key={comment._id} className="border p-2 mb-2">
            <p>{comment.content}</p>
            <p>By: {comment.author?.username}</p>
          </div>
        ))}
        {user && (
          <form onSubmit={handleCommentSubmit} className="space-y-2">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment"
              className="border p-2 w-full rounded"
              required
            />
            <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded">
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SinglePost;
