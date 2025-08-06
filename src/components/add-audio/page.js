import { useEffect, useState } from 'react';
import PostForm from './../Reuseable/PostForm';
import { getCategoryByName } from '../Reuseable/categoryApi';

const AddAudios = () => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryByName('Audio').then(cat => {
      setCategory(cat);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (!category) return <div className="text-red-500">Audio category not found.</div>;

  return <PostForm postCategory={category} formTitle="Add Audio" />;
};

export default AddAudios;
