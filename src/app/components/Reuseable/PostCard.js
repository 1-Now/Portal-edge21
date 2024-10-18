"use client";

import { useState } from 'react';
import { FaYoutube, FaTwitter, FaChartArea } from 'react-icons/fa';
import { CiHeart } from "react-icons/ci";
import { MdOutlineModeComment } from "react-icons/md";
import { FiFileText } from 'react-icons/fi';
import Image from 'next/image'

const PostCard = ({ category, image, ShareLink, title, description, likes, comments, createdAt }) => {
    const [showMore, setShowMore] = useState(false);
    const handleToggle = () => setShowMore(!showMore);

    const characterLimit = 100;
    const getCategoryIcon = () => {
        if (category === "Video") {
            return <FaYoutube className="w-4 h-4 mr-1" />;
        } else if (category === "Tweet") {
            return <FaTwitter className="w-4 h-4 mr-1" />;
        } else if (category === "Charts") {
            return <FaChartArea className="w-4 h-4 mr-1" />;
        } else {
            return <FiFileText className="w-4 h-4 mr-1" />;
        }
    };
    const getCategoryText = () => {
        return category === "Tweet" ? "Xweet" : category;
    };
    const imageplaceholder = "/images/placeholder-image.jpg";
    return (
        <div className="bg-gray-800 text-white p-4 rounded-lg">
            {/* Post Image */}
            <div className="mb-4">
                <div className="relative">
                    {image && (
                        <Image
                            src={image || imageplaceholder}
                            alt={title}
                            width={800}
                            height={400}
                            className="w-full h-[200px] object-cover rounded-lg mb-4"
                        />
                    )}
                    <a href={ShareLink} target="_self" rel="noopener noreferrer" className="bg-[#f28e13] flex cursor-pointer absolute top-2 right-2 text-white text-xs px-3 py-2 rounded">
                        {getCategoryIcon()}
                        {getCategoryText()}
                    </a>
                </div>
                {/* Post Title */}
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <div className="flex items-center">
                        <CiHeart className="mr-2 text-2xl text-bolder text-white" /> {likes || 0}
                        <MdOutlineModeComment className="mx-2 text-2xl text-bolder text-white" /> {comments || 0}
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-2">
                        {createdAt}
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-gray-400 cursor-pointer" onClick={handleToggle}>
                    {showMore || description.length <= characterLimit
                        ? description
                        : `${description.substring(0, characterLimit)}...`}
                </p>
                {description.length > characterLimit && (
                    <button
                        onClick={handleToggle}
                        className="text-yellow-400 text-sm mt-2"
                    >
                        {showMore ? 'Show Less' : 'Show More'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PostCard;
