import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { request, loading, error } = useApi();
  const { categories, setPosts } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ title: '', content: '', category: '', image: null });

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const data = await request('get', `/posts/${id}`);
          setFormData({ title: data.title, content: data.content, category: data.category._id, image: null });
        } catch (err) {
          console.error(err);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('content', formData.content);
    form.append('category', formData.category);
    if (formData.image) form.append('image', formData.image);
    try {
      const tempId = id || Date.now().toString();
      const optimisticPost = {
        _id: tempId,
        title: formData.title,
        content: formData.content,
        category: categories.find(c => c._id === formData.category),
        author: user,
      };
      setPosts(prev => id ? prev.map(p => p._id === id ? optimisticPost : p) : [optimisticPost, ...prev]);
      if (id) {
        await request('put', `/posts/${id}`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const savedPost = await request('post', '/posts', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPosts(prev => prev.map(p => p._id === tempId ? savedPost : p));
      }
      navigate('/');
    } catch (err) {
      setPosts(prev => id ? prev : prev.filter(p => p._id !== tempId));
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl">{id ? 'Edit Post' : 'Create Post'}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Title"
          className="border p-2 w-full rounded"
          required
        />
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Content"
          className="border p-2 w-full rounded"
          required
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          className="border p-2 w-full"
          accept="image/*"
        />
        <button type="submit" disabled={loading || !user} className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400">
          {loading ? 'Saving...' : id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;
