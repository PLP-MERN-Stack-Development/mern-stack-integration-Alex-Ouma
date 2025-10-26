import { useState } from 'react';
import axios from 'axios';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, url, data = null, config = {}) => {
    setLoading(true);
    try {
      const res = await axios({
        method,
        url: `${import.meta.env.VITE_API_URL}${url}`,
        data,
        ...config,
      });
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      throw err;
    }
  };

  return { request, loading, error };
};

export default useApi;
