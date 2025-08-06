import { useState } from 'react';
import axios from 'axios';
import { MdLinkedCamera } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const PostForm = ({ postCategory, formTitle }) => {
    const [formData, setFormData] = useState({
        postTitle: "",
        postDescription: "",
        rating: "",
        InternalScore: "",
        sourceLink: "",
        SourceName: "",
        SourceDescription: "",
        postCategory: postCategory?._id || "",
        ContentID: "",
        timePublished: "",
        SourceImage: "",
        postPhoto: ""
    });
    const [sourceImageFile, setSourceImageFile] = useState(null);
    const [postPhotoFile, setPostPhotoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const navigate = useNavigate();

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle image uploads for both Source Image and Post Photo
    const handleImageChange = (e, setImageFile) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadError("");

        try {
            // Prepare FormData for file upload
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'InternalScore') {
                    data.append(key, value ? Number(value) : 0);
                } else if (key === 'timePublished' && value) {
                    data.append(key, new Date(value).toISOString());
                } else if (key === 'postCategory') {
                    // Always send category _id
                    data.append(key, postCategory?._id || "");
                } else {
                    data.append(key, value);
                }
            });
            if (sourceImageFile) {
                data.append('SourceImage', sourceImageFile);
            }
            if (postPhotoFile) {
                data.append('postPhoto', postPhotoFile);
            }
            data.append('postOwner', true);

            await axios.post('https://api.edge21.co/api/userPosts/createPost', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert(`${postCategory?.name || "Post"} added successfully!`);
            window.location.reload();
        } catch (error) {
            console.error("Error adding post: ", error.response?.data?.message);
            setUploadError(error.response?.data?.message || "Error adding post. Please try again.");
            alert(error.response?.data?.message || "Error adding post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-5">
            <h1 className="text-white text-2xl font-bold mb-6">{formTitle}</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
                    <input
                        type="text"
                        name="ContentID"
                        placeholder="Content ID"
                        value={formData.ContentID}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
                        required
                    />
                    <input
                        type="text"
                        name="sourceLink"
                        placeholder="Source Link"
                        value={formData.sourceLink}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
                    />
                </div>
                <input
                    type="text"
                    name="postTitle"
                    placeholder={`${postCategory?.name || "Post"} Heading`}
                    value={formData.postTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
                />

                {/* Description */}
                <textarea
                    name="postDescription"
                    placeholder={`${postCategory?.name || "Post"} Summary`}
                    value={formData.postDescription}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
                    rows={4}
                    required
                    onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                />
                <div className="grid md:grid-cols-2 xs:grid-cols-1 gap-4">
                    <input
                        type="text"
                        name="SourceName"
                        placeholder="Source Name"
                        value={formData.SourceName}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
                    />
                    <input
                        type="number"
                        name="rating"
                        placeholder="Likes"
                        value={formData?.rating}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
                        required
                    />
                </div>
                <div className="grid md:grid-cols-2 xs:grid-cols-1 gap-4">
                    <input
                        type="number"
                        name="InternalScore"
                        placeholder="Internal Score"
                        value={formData.InternalScore}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
                        required
                    />
                    <input
                        type="datetime-local"
                        name="timePublished"
                        placeholder="Select Date & Time"
                        value={formData.timePublished}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
                        required
                    />
                </div>

                <div className="w-full h-28 rounded border-2 border-[#31363f] relative mt-4 p-4">
                    <div className="w-[100%] mob-w-[100%] h-full bg-transparent rounded flex justify-center items-center">
                        {!sourceImageFile && (
                            <label
                                htmlFor="sourceImage"
                                className="flex flex-col items-center cursor-pointer text-gray-500 w-full"
                            >
                                <MdLinkedCamera size={40} className="text-white" />
                                <span className="mt-2 text-white text-xs">Add Source Image</span>
                                <input
                                    type="file"
                                    id="sourceImage"
                                    name="SourceImage"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, setSourceImageFile)}
                                    className="hidden"
                                />
                            </label>
                        )}
                        {sourceImageFile && (
                            <div className="ml-3">
                                <img
                                    src={sourceImageFile ? URL.createObjectURL(sourceImageFile) : ""}
                                    alt="Source Image"
                                    className="w-full h-12 object-cover rounded"
                                    width={100}
                                    height={100}
                                />
                                <button
                                    type="button"
                                    onClick={() => setSourceImageFile(null)}
                                    className="absolute top-2 right-2 bg-red-500 text-white px-[7px] py-[1px] rounded"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full h-56 rounded border-2 border-[#31363f] relative mt-4 p-4">
                    <div className="w-[100%] mob-w-[100%] h-full bg-transparent rounded flex justify-center items-center">
                        {!postPhotoFile && (
                            <label
                                htmlFor="postPhoto"
                                className="flex flex-col items-center cursor-pointer text-gray-500 w-full"
                            >
                                <MdLinkedCamera size={60} className="text-white" />
                                <span className="mt-2 text-white text-xs">Add Feature Image</span>
                                <input
                                    type="file"
                                    id="postPhoto"
                                    name="postPhoto"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, setPostPhotoFile)}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {postPhotoFile && (
                            <div className="w-full h-full">
                                <img
                                    src={postPhotoFile ? URL.createObjectURL(postPhotoFile) : ""}
                                    alt="Post Image"
                                    className="w-full h-full object-contain rounded"
                                    width={100}
                                    height={100}
                                />
                                <button
                                    type="button"
                                    onClick={() => setPostPhotoFile(null)}
                                    className="absolute top-2 right-2 bg-red-500 text-white px-[7px] py-[1px] rounded"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {uploadError && (
                    <div className="text-red-500 text-center font-semibold mb-2">{uploadError}</div>
                )}
                <button
                    type="submit"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg"
                    disabled={loading}
                >
                    {loading ? `Adding ${postCategory?.name || "Post"}...` : `Add ${postCategory?.name || "Post"}`}
                </button>
            </form>
        </div>
    );
};

export default PostForm;
