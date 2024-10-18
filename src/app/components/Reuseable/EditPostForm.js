"use client";

import React, { useState } from "react";
import Image from "next/image";
const EditPostForm = ({ postData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    ...postData,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, [e.target.name]: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Trigger the parent component's onSubmit method
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-95 p-10 z-50">
      <div className="relative w-full max-w-[80%] h-full bg-gray-800 p-8 rounded-lg overflow-hidden">
        <div className="absolute top-0 right-0 m-4">
          <button
            onClick={onClose}
            className="text-white text-2xl font-semibold cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Scrollable form section */}
        <div className="overflow-y-auto h-full pr-4">
          <h2 className="text-2xl text-white mb-4">Edit Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Post Title */}
            <label className="block text-white">Article Title</label>
            <input
              type="text"
              name="postTitle"
              value={formData.postTitle}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-900 text-white"
            />

            {/* Post Description */}
            <label className="block text-white">Article Description</label>
            <textarea
              name="postDescription"
              value={formData.postDescription}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-900 text-white"
              rows={5}
            />

            {/* Internal Score */}
            <label className="block text-white">Internal Score</label>
            <input
              type="number"
              name="InternalScore"
              value={formData.InternalScore}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-900 text-white"
            />

            {/* Rating */}
            <label className="block text-white">Rating</label>
            <input
              type="text"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-900 text-white"
            />

            {/* Source Link */}
            <label className="block text-white">Source Link</label>
            <input
              type="text"
              name="sourceLink"
              value={formData.sourceLink}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-900 text-white"
            />

            {/* Source Name */}
            <label className="block text-white">Source Name</label>
            <input
              type="text"
              name="SourceName"
              value={formData.SourceName}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-900 text-white"
            />

            {/* Source Description */}
            <label className="block text-white">Source Description</label>
            <input
              type="text"
              name="SourceDescription"
              value={formData.SourceDescription}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-900 text-white"
            />

            <label className="block text-white">Content ID</label>
            <input
              type="text"
              name="ContentID"
              value={formData?.ContentID}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-900 text-white"
            />

            <label className="block text-white">Post Category</label>
            <select
              name="postCategory"
              value={formData.postCategory}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-gray-900 text-white"
            >
              <option value="Article">Article</option>
              <option value="Tweet">Tweet</option>
              <option value="Video">Video</option>
              <option value="Charts">Charts</option>
            </select>

            {/* Source Image Upload */}
            <label className="block text-white">Source Image</label>
            <div className="w-full h-40 rounded relative bg-gray-900 flex justify-center items-center">
              {!formData.SourceImage && (
                <label
                  htmlFor="sourceImage"
                  className="flex flex-col items-center cursor-pointer text-gray-500"
                >
                  <span className="mt-2 text-sm">Add Source Image</span>
                  <input
                    type="file"
                    id="sourceImage"
                    name="SourceImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              {formData.SourceImage && (
                <div className="absolute inset-0">
                  <Image
                    src={
                      formData.SourceImage instanceof File
                        ? URL.createObjectURL(formData.SourceImage)
                        : formData.SourceImage
                    }
                    width={100}
                    height={100}
                    alt="Source Image"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, SourceImage: null })}
                    className="absolute top-2 right-2 text-white bg-red-600 rounded px-[10px] py-[1px] focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            {/* Post Photo Upload */}
            <label className="block text-white">Post Image</label>
            <div className="w-full h-40 rounded relative bg-gray-900 flex justify-center items-center">
              {!formData.postPhoto && (
                <label
                  htmlFor="postPhoto"
                  className="flex flex-col items-center cursor-pointer text-gray-500"
                >
                  <span className="mt-2 text-sm">Add Post Image</span>
                  <input
                    type="file"
                    id="postPhoto"
                    name="postPhoto"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              {formData.postPhoto && (
                <div className="absolute inset-0">
                  <Image
                    src={
                      formData.postPhoto instanceof File
                        ? URL.createObjectURL(formData.postPhoto)
                        : formData.postPhoto
                    }
                    width={100}
                    height={100}
                    alt="Post Photo"
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    onClick={() => setFormData({ ...formData, postPhoto: null })}
                    className="absolute top-2 right-2 text-white bg-red-600 rounded px-[10px] py-[1px] focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            {/* Save and Cancel Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-6 rounded-lg"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostForm;
