import axios from 'axios';

export const getCategoryByName = async (name) => {
  try {
    const res = await axios.get('https://api.edge21.co/api/userCategories');
    const categories = res.data || [];
    return categories.find(cat => cat.name === name) || null;
  } catch (err) {
    return null;
  }
};
