import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNowStrict, subDays } from "date-fns";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import Loader from './../Reuseable/Loader';
import { useNavigate } from 'react-router-dom';
import EditPostForm from './../Reuseable/EditPostForm';
import PostCard from './../Reuseable/PostCard';
import imageplaceholder from "../../images/placeholder-image.jpg";

const DEFAULT_RANGE = '2d';

const Editfeed = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [editingPostData, setEditingPostData] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);


  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('admintoken');
    if (!token) {
      navigate('/login');
    } else {
      if (searchQuery) {
        fetchPosts(searchQuery);
      } else {
        fetchPosts();
      }
    }
  }, [range]);

  // Fetch posts from REST API
  const fetchPosts = async (searchTerm = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admintoken');
      let url = `https://api.edge21.co/api/userPosts?range=${range}`;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let postsList = response.data || [];
      // Filter client-side if searchTerm is present
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        postsList = postsList.filter(
          post =>
            (post.postTitle && post.postTitle.toLowerCase().includes(term)) ||
            (post.ContentID && post.ContentID.toLowerCase().includes(term))
        );
      }
      setLatestPosts(postsList);
      setHasMorePosts(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  // Handle search query
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(searchQuery);
  };

  // Clear search when range changes
  useEffect(() => {
    setSearchQuery("");
  }, [range]);

  // Handle post editing
  const handleEditPost = (postId) => {
    const postToEdit = latestPosts.find((post) => post._id === postId || post.id === postId);
    setEditingPostData(postToEdit);
    setEditPostId(postId);
  };

  // Handle deleting a post
  const handleDeletePost = async (postId) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('admintoken');
      await axios.delete(`https://api.edge21.co/api/userPosts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
    setActionLoading(false);
  };

  // Handle updating a post (with image upload support)
  const handleUpdatePost = async (updatedData) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('admintoken');
      let dataToSend = { ...updatedData };
      let config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Always send postCategory as its _id (not object)
      if (dataToSend.postCategory && typeof dataToSend.postCategory === 'object' && dataToSend.postCategory._id) {
        dataToSend.postCategory = dataToSend.postCategory._id;
      }

      // If postPhoto or SourceImage is a File, use FormData
      if (updatedData.postPhoto instanceof File || updatedData.SourceImage instanceof File) {
        const formData = new FormData();
        Object.entries(dataToSend).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value);
          }
        });
        dataToSend = formData;
        config.headers['Content-Type'] = 'multipart/form-data';
      }

      await axios.put(`https://api.edge21.co/api/userPosts/${editPostId}`, dataToSend, config);
      alert("Post updated successfully!");
      setEditPostId(null);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update the post.");
    }
    setActionLoading(false);
  };

  // Remove pagination logic

  console.log(latestPosts, "latestPosts")
  return (
    <div className="min-h-screen bg-gray-900 p-5 w-[50%] mx-auto">
      <h1 className="text-white text-2xl font-bold mb-6">Edit Posts</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ContentID or Title (Last 30 days)"
          className="w-full p-3 mb-2 rounded bg-gray-800 text-white"
        />
        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-6 rounded-lg">
          Search
        </button>
      </form>

      {/* Loading Spinner */}
      {loading && <p className="text-gray-400"><Loader /></p>}

      {/* Range Selection */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setRange('2d')} className={`px-3 py-1 rounded ${range === '2d' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'}`}>Last 2 Days</button>
        <button onClick={() => setRange('7d')} className={`px-3 py-1 rounded ${range === '7d' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'}`}>Last 7 Days</button>
      </div>

      {/* Posts List */}
      {!loading && latestPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {latestPosts.map((post) => (
            <div key={post._id || post.id} className="bg-gray-800 p-4 rounded flex flex-col justify-between">
              <PostCard
                image={post.postPhoto || imageplaceholder}
                title={post.postTitle}
                description={post.postDescription}
                category={post.postCategory?.name || post.postCategory}
                likes={post?.rating}
                createdAt={post.timePublished ? formatDistanceToNowStrict(new Date(post.timePublished)) : "Unknown time"}
              />
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEditPost(post._id || post.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                >
                  <CiEdit />
                </button>
                <button
                  onClick={() => handleDeletePost(post._id || post.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  disabled={actionLoading}
                >
                  <MdDeleteOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Post Form */}
      {editPostId && editingPostData && (
        <EditPostForm
          postData={editingPostData}
          onSubmit={(updatedData) => handleUpdatePost(updatedData)}
          onClose={() => setEditPostId(null)}
        />
      )}
    </div>
  );
};

export default Editfeed;
