import React, { useState, useEffect } from 'react'
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { FaSort, FaSortUp, FaSortDown, FaTrash } from "react-icons/fa";
import ModalComponent from './../Reuseable/Model';
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.edge21.co/api/categories");
      setCategories(response.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <FaSortUp className="ml-1 text-blue-400" /> : 
      <FaSortDown className="ml-1 text-blue-400" />;
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (!sortField) return 0;
    let aValue = a[sortField];
    let bValue = b[sortField];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const openAddModal = () => {
    setEditMode(false);
    setCategoryName("");
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditMode(true);
    setCategoryName(category.name);
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await axios.delete(`https://api.edge21.co/api/categories/${category._id}`);
      setCategories(categories.filter((c) => c._id !== category._id));
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      if (editMode && selectedCategory) {
        await axios.put(`https://api.edge21.co/api/categories/${selectedCategory._id}`, { name: categoryName });
      } else {
        await axios.post("https://api.edge21.co/api/categories", { name: categoryName });
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      alert("Save failed: " + error.message);
    }
  };

  return (
    <>
      <ModalComponent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4 px-1">
            <label className="block text-sm font-bold mb-2 text-white">Category Name:</label>
            <input
              type="text"
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter category name"
              required
            />
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow">
            {editMode ? "Update" : "Add"} Category
          </button>
        </form>
      </ModalComponent>

      <div className="min-h-screen bg-gray-900 p-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-bold">Categories</h1>
          <button onClick={openAddModal} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-lg flex items-center">
            <FiPlus size={20} className="mr-2" />
            Add New
          </button>
        </div>
        <div className="border border-gray-700 rounded-lg max-h-[82vh] overflow-y-auto">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-left text-gray-400">
              <thead className="bg-[#222831] text-[#e0e3e7]">
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="py-3 px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={2} className="text-center py-4">Loading...</td></tr>
                ) : sortedCategories.length === 0 ? (
                  <tr><td colSpan={2} className="text-center py-4">No categories found.</td></tr>
                ) : (
                  sortedCategories.map((cat) => (
                    <tr key={cat._id} className="border-b border-gray-800">
                      <td className="py-3 px-5">{cat.name}</td>
                      <td className="py-3 px-5 flex gap-4">
                        <CiEdit onClick={() => openEditModal(cat)} className="cursor-pointer text-blue-500" />
                        <FaTrash onClick={() => handleDelete(cat)} className="cursor-pointer text-red-500" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;