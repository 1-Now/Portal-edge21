"use client";

import React, { useEffect, useState } from "react";
import { db, storage } from "@/app/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
  startAfter,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { formatDistanceToNowStrict, subDays } from "date-fns";
import PostCard from "../components/Reuseable/PostCard";
import EditPostForm from "../components/Reuseable/EditPostForm";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import Loader from "../components/Reuseable/Loader";

const POSTS_PER_PAGE = 30;

const Editfeed = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null); // Track the last post of the current page
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [editingPostData, setEditingPostData] = useState(null);
  const [hasMorePosts, setHasMorePosts] = useState(true); // Track if there are more posts

  const [checkingAuth, setCheckingAuth] = useState(true); // New state to check if auth is loading
  const [user, setUser] = useState(null);


  const router = useRouter();
   useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchPosts();
      } else {
        router.push('/login');
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts either default (48 hours) or search (30 days)
  const fetchPosts = async (searchTerm = "", pageNumber = 1, usePagination = false) => {
    setLoading(true);
    try {
      const postsCollection = collection(db, "userPosts");
      const currentTime = new Date();
      const last48Hours = subDays(currentTime, 2);
      const lastMonth = subDays(currentTime, 30);

      let postsQuery;
      if (searchTerm) {
        postsQuery = query(
          postsCollection,
          where("timePublished", ">=", lastMonth),
          orderBy("timePublished", "desc"),
        );
      } else {
        postsQuery = query(
          postsCollection,
          where("timePublished", ">=", last48Hours),
          orderBy("timePublished", "desc"),
          limit(POSTS_PER_PAGE)
        );
      }

      // Handle pagination using `startAfter`
      if (usePagination && lastVisible) {
        postsQuery = query(
          postsCollection,
          where("timePublished", ">=", last48Hours),
          orderBy("timePublished", "desc"),
          startAfter(lastVisible),
          limit(POSTS_PER_PAGE)
        );
      }

      const postsSnapshot = await getDocs(postsQuery);
      const postsList = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const lastVisiblePost = postsSnapshot.docs[postsSnapshot.docs.length - 1]; // Save last visible post
      setLastVisible(lastVisiblePost);

      // If searchTerm exists, filter results by postTitle or ContentID
      let filteredPosts = postsList;
      if (searchTerm) {
        filteredPosts = postsList.filter(
          (post) =>
            post.postTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.ContentID?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // For pagination: Append new posts to the existing ones
      if (usePagination) {
        setLatestPosts((prevPosts) => [...prevPosts, ...filteredPosts]);
      } else {
        setLatestPosts(filteredPosts);
      }

      setHasMorePosts(postsList.length >= POSTS_PER_PAGE);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  // Handle search query
  const handleSearch = (e) => {
    e.preventDefault();
    setLastVisible(null);
    fetchPosts(searchQuery, 1);
  };

  // Handle post editing
  const handleEditPost = (postId) => {
    const postToEdit = latestPosts.find((post) => post.id === postId);
    setEditingPostData(postToEdit);
    setEditPostId(postId);
  };

  // Handle deleting a post
  const handleDeletePost = async (postId, imageUrl) => {
    setActionLoading(true);
    try {
      // Delete post from Firestore
      const postRef = doc(db, "userPosts", postId);
      await deleteDoc(postRef);

      // Delete image from Firebase storage
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }

      alert("Post deleted successfully!");
      fetchPosts(); // Refresh posts after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post.");
    }
    setActionLoading(false);
  };

  const uploadImageIfNeeded = async (file, userId, fieldName) => {
    if (!file) return null;
    const fileRef = ref(storage, `users/${userId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };

  const handleUpdatePost = async (updatedData) => {
    try {
      const postRef = doc(db, "userPosts", editPostId);
      let sourceImageUrl = updatedData.SourceImage;
      let postPhotoUrl = updatedData.postPhoto;

      if (updatedData.SourceImage instanceof File) {
        sourceImageUrl = await uploadImageIfNeeded(updatedData.SourceImage, updatedData.postOwner, "SourceImage");
      }
      if (updatedData.postPhoto instanceof File) {
        postPhotoUrl = await uploadImageIfNeeded(updatedData.postPhoto, updatedData.postOwner, "postPhoto");
      }

      const updatedPostData = { ...updatedData, SourceImage: sourceImageUrl, postPhoto: postPhotoUrl };

      await updateDoc(postRef, updatedPostData);

      alert("Post updated successfully!");
      setEditPostId(null);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update the post.");
    }
  };

  // Handle next page click
  const handleNextPage = () => {
    if (hasMorePosts) {
      fetchPosts(searchQuery, page + 1, true); // Pass `true` to use pagination logic
      setPage((prevPage) => prevPage + 1); // Increase page number
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      fetchPosts(searchQuery, page - 1); // Fetch previous page posts
    }
  };
  const imageplaceholder = "/images/placeholder-image.jpg";

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
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

      {/* Posts List */}
      {!loading && latestPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {latestPosts.map((post) => (
            <div key={post.id} className="bg-gray-800 p-4 rounded flex flex-col justify-between">
              <PostCard
                image={post.postPhoto || imageplaceholder}
                title={post.postTitle}
                description={post.postDescription}
                category={post.postCategory}
                createdAt={formatDistanceToNowStrict(post.timePublished?.toDate())}
              />
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEditPost(post.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                >
                  <CiEdit />
                </button>
                <button
                  onClick={() => handleDeletePost(post.id, post.SourceImage)}
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

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handlePrevPage}
          className={`bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={page === 1}
        >
          Back
        </button>
        <button
          onClick={handleNextPage}
          className={`bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded ${!hasMorePosts ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!hasMorePosts}
        >
          Next
        </button>
      </div>

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
