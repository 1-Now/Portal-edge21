import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import PostCard from './../Reuseable/PostCard';
import { formatDistanceToNowStrict } from 'date-fns';
import Loader from './../Reuseable/Loader';
import imageplaceholder from "../../images/placeholder-image.jpg";
const POSTS_PER_PAGE = 50;

const AllPosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [range, setRange] = useState('2d');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admintoken');
    if (!token) {
      navigate('/login');
    } else {
      fetchAllPosts(range);
    }
  }, [range]);

  useEffect(() => {
    setTotalPages(Math.ceil(allPosts?.length / POSTS_PER_PAGE));
  }, [allPosts]);
  const fetchAllPosts = async (selectedRange) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admintoken');
      const response = await axios.get(`https://api.edge21.co/api/userPosts?range=${selectedRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const postsList = response.data || [];
      setAllPosts(postsList);
      setPage(1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const renderPageButtons = () => {
    let pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`mx-1 px-4 py-2 rounded ${page === i ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'}`}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-5">
      <h1 className="text-white text-2xl font-bold mb-6">All Latest Posts</h1>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setRange('2d')} className={`px-3 py-1 rounded ${range === '2d' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'}`}>Last 2 Days</button>
        <button onClick={() => setRange('7d')} className={`px-3 py-1 rounded ${range === '7d' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'}`}>Last 7 Days</button>
        <button onClick={() => setRange('1m')} className={`px-3 py-1 rounded ${range === '1m' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-white'}`}>Last 30 Days</button>
      </div>
      {loading ? (
        <p>
          <Loader />
        </p>
      ) : (
        <>
          {allPosts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {allPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE).map((post) => (
                <PostCard
                  key={post._id || post.id}
                  image={post.postPhoto || imageplaceholder}
                  title={post.postTitle || post.SourceName}
                  description={post.postDescription}
                  likes={post.rating}
                  ShareLink={post.sourceLink}
                  category={post.postCategory?.name || post.postCategory}
                  createdAt={
                    post.timePublished
                      ? formatDistanceToNowStrict(new Date(post.timePublished))
                      : 'Unknown time'
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No posts found</p>
          )}
          <div className="flex justify-center mt-6">
            <button
              onClick={handlePrevPage}
              className={`bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={page === 1}
            >
              Back
            </button>
            {renderPageButtons()}
            <button
              onClick={handleNextPage}
              className={`bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllPosts;
