import React, { useState, useEffect } from 'react';
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import { FaSort, FaSortUp, FaSortDown, FaTrash } from "react-icons/fa";
import ModalComponent from './../Reuseable/Model';
import axios from "axios";

const ResourceLinks = () => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    url: '',
    date: '',
    category: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchCategories();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.edge21.co/api/resources");
      
      setResources(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://api.edge21.co/api/categories");
      setCategories(response.data || []);
    } catch {}
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

  const sortedResources = [...resources].sort((a, b) => {
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
    setForm({ title: '', description: '', url: '', date: '', category: '' });
    setSelectedResource(null);
    setModalOpen(true);
  };

  const openEditModal = (resource) => {
    setEditMode(true);
    // Convert date to YYYY-MM-DD if present
    let dateValue = '';
    if (resource.date) {
      const d = new Date(resource.date);
      if (!isNaN(d)) {
        dateValue = d.toISOString().slice(0, 10);
      }
    }
    setForm({
      title: resource.title || '',
      description: resource.description || '',
      url: resource.url || '',
      date: dateValue,
      category: resource.category?._id || resource.category || ''
    });
    setSelectedResource(resource);
    setModalOpen(true);
  };

  const handleDelete = async (resource) => {
    if (!window.confirm(`Delete resource "${resource.title}"?`)) return;
    try {
      await axios.delete(`https://api.edge21.co/api/resources/${resource._id}`);
      setResources(resources.filter((r) => r._id !== resource._id));
    } catch (error) {
      alert("Delete failed: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim() || !form.category) return;
    setFormLoading(true);
    try {
      if (editMode && selectedResource) {
        await axios.put(`https://api.edge21.co/api/resources/${selectedResource._id}`, form);
      } else {
        await axios.post("https://api.edge21.co/api/resources", form);
      }
      setModalOpen(false);
      fetchResources();
    } catch (error) {
      alert("Save failed: " + error.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <ModalComponent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? "Edit Resource" : "Add Resource"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4 px-1">
            <label className="block text-sm font-bold mb-2 text-white">Title:</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter title"
              required
            />
          </div>
          <div className="mb-4 px-1">
            <label className="block text-sm font-bold mb-2 text-white">Description:</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter description"
            />
          </div>
          <div className="mb-4 px-1">
            <label className="block text-sm font-bold mb-2 text-white">URL:</label>
            <input
              type="url"
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter URL"
              required
            />
          </div>
          <div className="mb-4 px-1">
            <label className="block text-sm font-bold mb-2 text-white">Date:</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div className="mb-4 px-1">
            <label className="block text-sm font-bold mb-2 text-white">Category:</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow" disabled={formLoading}>
            {formLoading ? (
              <span>Processing...</span>
            ) : (
              editMode ? "Update" : "Add"
            )} Resource
          </button>
        </form>
      </ModalComponent>

      <div className="min-h-screen bg-gray-900 p-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl font-bold">Resource Links</h1>
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
                  <th className="py-3 px-5 min-w-[400px] cursor-pointer hover:bg-gray-700" onClick={() => handleSort('title')}>
                    <div className="flex items-center">
                      Title
                      {getSortIcon('title')}
                    </div>
                  </th>
                  <th className="py-3 px-5 min-w-[200px] cursor-pointer hover:bg-gray-700" onClick={() => handleSort('description')}>
                    <div className="flex items-center">
                      Description
                      {getSortIcon('description')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('url')}>
                    <div className="flex items-center">
                      URL
                      {getSortIcon('url')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('date')}>
                    <div className="flex items-center">
                      Date
                      {getSortIcon('date')}
                    </div>
                  </th>
                  <th className="py-3 px-5 cursor-pointer hover:bg-gray-700" onClick={() => handleSort('category')}>
                    <div className="flex items-center">
                      Category
                      {getSortIcon('category')}
                    </div>
                  </th>
                  <th className="py-3 px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                ) : sortedResources.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">No resources found.</td></tr>
                ) : (
                  sortedResources.map((res) => (
                    <tr key={res._id} className="border-b border-gray-800">
                      <td className="py-3 px-5 min-w-[250px]">{res.title}</td>
                      <td className="py-3 px-5">{res.description}</td>
                      <td className="py-3 px-5 text-xs"><a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{res.url}</a></td>
                      <td className="py-3 px-5">{res.date ? new Date(res.date).toLocaleDateString() : '-'}</td>
                      <td className="py-3 px-5">{res.category?.name || (categories.find(c => c._id === res.category)?.name) || '-'}</td>
                      <td className="py-3 px-5 flex gap-4 items-center">
                        <CiEdit onClick={() => openEditModal(res)} className="cursor-pointer text-blue-500" />
                        <FaTrash onClick={() => handleDelete(res)} className="cursor-pointer text-red-500" />
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

export default ResourceLinks;