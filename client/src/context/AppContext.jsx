import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  return (
    <AppContext.Provider value={{ posts, setPosts, categories, setCategories }}>
      {children}
    </AppContext.Provider>
  );
};
