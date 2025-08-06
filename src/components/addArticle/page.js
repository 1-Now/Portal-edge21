import { useEffect, useState } from 'react';
import PostForm from './../Reuseable/PostForm';
import { getCategoryByName } from '../Reuseable/categoryApi';

const AddArticle = () => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryByName('Article').then(cat => {
      setCategory(cat);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (!category) return <div className="text-red-500">Article category not found.</div>;

  console.log("Category:", category);
  console.log("Category id:", category._id);
  return <PostForm postCategory={category} formTitle="Add Article" />;
};

export default AddArticle;
