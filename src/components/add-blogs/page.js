import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalComponent from '../Reuseable/Model';
import { FiPlus } from 'react-icons/fi';
import { CiEdit } from 'react-icons/ci';
import { FaTrash } from "react-icons/fa";

const AddBlog = () => {

  const [modalOpen, setModalOpen] = useState(false);
  const [customData, setCustomData] = useState({
    title: '',
    subtitle: '',
    content: '',
    author: '',
    hashtags: [],
    viewCount: 0,
    published: true,
    publishDate: '',
    createdAt: '',
    updatedAt: '',
    slug: '',
  });
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // API base URL
  const API_URL = "https://api.edge21.co";

  // Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getAllBlogs`);
        setBlogs(res.data || []);
      } catch (err) {
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Create blog
  const handleCreate = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/createBlog`, customData);
      setBlogs(prev => [...prev, res.data]);
      setModalOpen(false);
    } catch (err) {
      setError("Failed to create blog");
    }
  };

  // Update blog
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_URL}/api/updateBlog/${customData._id}`, customData);
      setBlogs(prev => prev.map(b => b._id === customData._id ? res.data : b));
      setModalOpen(false);
    } catch (err) {
      setError("Failed to update blog");
    }
  };

  // Delete blog
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/deleteBlog/${id}`);
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      setError("Failed to delete blog");
    }
  };

  // Get blog by slug
  const getBlogBySlug = async (slug) => {
    try {
      const res = await axios.get(`${API_URL}/api/blog/${slug}`);
      setCustomData(res.data);
      setModalOpen(true);
    } catch (err) {
      setError("Failed to fetch by slug");
    }
  };

  const openModal = (blog) => {
    setCustomData(blog || {
      title: '',
      subtitle: '',
      content: '',
      author: '',
      hashtags: [],
      viewCount: 0,
      published: true,
      publishDate: '',
      createdAt: '',
      updatedAt: '',
      slug: '',
    });
    setModalOpen(true);
  };

  // Filter blogs by search
  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(search.toLowerCase()) ||
    blog.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <ModalComponent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={customData._id ? "Edit Blog" : "Add Blog"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            customData._id ? handleUpdate() : handleCreate();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Title:</label>
            <input
              type="text"
              value={customData.title}
              onChange={(e) => setCustomData({ ...customData, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter blog title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Subtitle:</label>
            <input
              type="text"
              value={customData.subtitle}
              onChange={(e) => setCustomData({ ...customData, subtitle: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter blog subtitle"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Content:</label>
            <textarea
              value={customData.content}
              onChange={(e) => setCustomData({ ...customData, content: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter blog content"
              rows={5}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Author:</label>
            <input
              type="text"
              value={customData.author}
              onChange={(e) => setCustomData({ ...customData, author: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter author name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Hashtags:</label>
            <input
              type="text"
              value={customData.hashtags.join(', ')}
              onChange={(e) => setCustomData({ ...customData, hashtags: e.target.value.split(',').map(tag => tag.trim()) })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Enter hashtags separated by commas"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">Published:</label>
            <select
              value={customData.published}
              onChange={(e) => setCustomData({ ...customData, published: e.target.value === 'true' })}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          {/* Additional fields, mostly read-only */}
          {customData._id && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-white">Slug:</label>
                <input
                  type="text"
                  value={customData.slug}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white opacity-70"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-white">View Count:</label>
                <input
                  type="number"
                  value={customData.viewCount}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white opacity-70"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow"
          >
            {customData._id ? 'Update Blog' : 'Add Blog'}
          </button>
        </form>
      </ModalComponent>

      <div className="min-h-screen bg-gray-900 p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-white text-2xl font-bold">All Blogs</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or author"
              className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full sm:w-64"
            />
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-lg flex items-center"
              onClick={() => openModal(null)}
            >
              <FiPlus size={20} className="mr-2" />
              Add New
            </button>
          </div>
        </div>

        {error && <div className="text-red-500 mb-2">{error}</div>}
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="border border-gray-700 rounded-lg max-h-[82vh] overflow-y-auto">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-left text-gray-400">
                <thead className="bg-[#222831] text-[#e0e3e7] text-sm">
                  <tr className="border-b border-gray-700">
                    <th className="py-3 px-5">Title</th>
                    <th className="py-3 px-5">Subtitle</th>
                    <th className="py-3 px-5">Author</th>
                    <th className="py-3 px-5">Hashtags</th>
                    <th className="py-3 px-5">Published</th>
                    <th className="py-3 px-5">Created At</th>
                    <th className="py-3 px-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.map(blog => (
                    <tr key={blog._id} className="border-b border-gray-800">
                      <td className="py-3 px-5 cursor-pointer" onClick={() => getBlogBySlug(blog.slug)}>{blog.title}</td>
                      <td className="py-3 px-5">{blog.subtitle}</td>
                      <td className="py-3 px-5">{blog.author}</td>
                      <td className="py-3 px-5">{Array.isArray(blog.hashtags) ? blog.hashtags.join(', ') : ''}</td>
                      <td className="py-3 px-5">{blog.published ? 'Yes' : 'No'}</td>
                      <td className="py-3 px-5">{blog.createdAt}</td>
                      <td className="py-3 px-5 flex gap-2">
                        <button className="text-blue-500" onClick={() => openModal(blog)}><CiEdit /></button>
                        <button className="text-red-500" onClick={() => handleDelete(blog._id)}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddBlog;