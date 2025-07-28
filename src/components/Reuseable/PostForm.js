import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, storage } from "../../firebase/firebaseConfig";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { MdLinkedCamera } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const PostForm = ({ postCategory, formTitle }) => {
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        postTitle: "",
        postDescription: "",
        rating: "",
        InternalScore: "",
        sourceLink: "",
        SourceName: "",
        SourceDescription: "",
        postCategory: postCategory,
        ContentID: "",
        timePublished: "",
        SourceImage: "",
        postPhoto: ""
    });
    const [sourceImageFile, setSourceImageFile] = useState('');
    const [postPhotoFile, setPostPhotoFile] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const navigate = useNavigate();
    // Check if user is authenticated
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                navigate("/login");
            }
            setAuthLoading(false);
        });
    }, [auth]);

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
        if (!user) {
            navigate("/login");
            return;
        }
        setLoading(true);
        setUploadError("");

        try {
            const postsCollection = collection(db, "userPosts");
            const contentIDQuery = query(postsCollection, where("ContentID", "==", formData.ContentID));
            const contentIDSnapshot = await getDocs(contentIDQuery);

            if (!contentIDSnapshot.empty) {
                alert("ContentID already exists. Please use a unique ContentID.");
                setLoading(false);
                return;
            }

            let sourceImageUrl = null;
            let postPhotoUrl = null;

            // Upload Source Image to Firebase Storage if provided
            if (sourceImageFile) {
                try {
                    // const sourceImageRef = ref(storage, `users/${user.uid}/${sourceImageFile.name}`);
                    const uniqueSourceImageName = `${Date.now()}_${sourceImageFile.name}`;
                    const sourceImageRef = ref(storage, `users/${user.uid}/${uniqueSourceImageName}`);
                    console.log("Uploading Source Image to:", sourceImageRef);

                    try {
                        await uploadBytes(sourceImageRef, sourceImageFile);
                    } catch (error) {
                        console.error("Retrying source image upload due to image error", error);
                        await uploadBytes(sourceImageRef, sourceImageFile);
                    }
                    sourceImageUrl = await getDownloadURL(sourceImageRef);
                } catch (err) {
                    setUploadError("Failed to upload Source Image.");
                    setLoading(false);
                    return;
                }
            }

            // Upload Main Post Photo to Firebase Storage if provided
            if (postPhotoFile) {
                try {
                    // const postPhotoRef = ref(storage, `users/${user.uid}/${postPhotoFile.name}`);
                    // await uploadBytes(postPhotoRef, postPhotoFile);
                    const uniquePostPhotoName = `${Date.now()}_${postPhotoFile.name}`;
                    const postPhotoRef = ref(storage, `users/${user.uid}/${uniquePostPhotoName}`);
                    console.log("Uploading Post Photo to:", postPhotoRef.fullPath);

                    try {
                        await uploadBytes(postPhotoRef, postPhotoFile);
                    } catch (error) {
                        console.error("Retrying post photo upload due to image error", error);
                        await uploadBytes(postPhotoRef, postPhotoFile);
                    }
                    postPhotoUrl = await getDownloadURL(postPhotoRef);
                } catch (err) {
                    setUploadError("Failed to upload Feature Image.");
                    setLoading(false);
                    return;
                }
            }

            // Create formData to be submitted to Firestore
            const postData = {
                postTitle: formData.postTitle,
                postDescription: formData.postDescription,
                rating: formData.rating,
                InternalScore: formData.InternalScore ? Number(formData.InternalScore) : 0,
                sourceLink: formData.sourceLink,
                SourceName: formData.SourceName,
                SourceDescription: formData.SourceDescription,
                ContentID: formData.ContentID,
                timePublished: formData.timePublished ? Timestamp.fromDate(new Date(formData.timePublished)) : null,
                SourceImage: sourceImageUrl || null,
                postPhoto: postPhotoUrl || null,
                postOwner: true,
                postCategory: formData.postCategory,
            };
            console.log("Post Data to be added:", postData);
            await addDoc(postsCollection, postData);

            alert(`${postCategory} added successfully!`);
            window.location.reload();
        } catch (error) {
            console.error("Error adding post: ", error);
            setUploadError("Error adding post. Please try again.");
            alert("Error adding post. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    if (authLoading) return <div className="text-white">Authenticating...</div>;

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
                    placeholder={`${postCategory} Heading`}
                    value={formData.postTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 rounded bg-transparent text-white focus:placeholder-white placeholder-white border-2 border-[#31363f] focus:border-yellow-500 focus:outline-none"
                />

                {/* Description */}
                <textarea
                    name="postDescription"
                    placeholder={`${postCategory} Summary`}
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
                                    name="sourceImage"
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
                    {loading ? `Adding ${postCategory}...` : `Add ${postCategory}`}
                </button>
            </form>
        </div>
    );
};

export default PostForm;
