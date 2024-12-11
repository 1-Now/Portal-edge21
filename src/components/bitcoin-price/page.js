import React, { useEffect, useState } from "react";
import Loader from './../Reuseable/Loader';
import axios from "axios";
import { FaPlus, FaMinus } from "react-icons/fa";

const BitcoinPrice = () => {
  const [data, setData] = useState({
    heading1: "",
    para1: "",
    heading2: "",
    para2: "",
    heading3: "",
    para3: "",
    metatitle: "",
    metadescription: "",
    tags: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const currentDate = getCurrentDate();

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/data/fetchDataByDate/${currentDate}`
        );

        if (response.data && response.data.length > 0) {
          setData(response.data[0]);
        }
      setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/data/update-Para-Details/${data._id}`,
        {
          heading1: data.heading1,
          para1: data.para1,
          heading2: data.heading2,
          para2: data.para2,
          heading3: data.heading3,
          para3: data.para3,
          metatitle: data.metatitle,
          metadescription: data.metadescription,
          tags: data.tags,
        }
      );

      if (response.status === 200) {
        alert("Article updated successfully!");
      } else {
        alert("Failed to update the article.");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleOptionalFields = () => {
    setShowOptionalFields(!showOptionalFields);
  };

  if (loading) {
    return <div className="text-white"><Loader /></div>;
  }

  return (
    <div className="min-h-screen p-4">
      <div className="w-full rounded-lg shadow-md">
        <h1 className="text-white text-3xl font-bold mb-6">Bitcoin Insights</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-white mb-1" htmlFor="heading1">
              Article Heading 1
            </label>
            <input
              type="text"
              id="heading1"
              value={data?.heading1}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="para1">
              Article Summary 1
            </label>
            <textarea
              id="para1"
              value={data?.para1}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
              rows="4"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-white mb-1" htmlFor="heading2">
                Article Heading 2
              </label>
              <input
                type="text"
                id="heading2"
                value={data.heading2}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white mb-1" htmlFor="para2">
                Article Summary 2
              </label>
              <textarea
                id="para2"
                value={data?.para2}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
                rows="4"
              />
            </div>
          </div>

          {showOptionalFields && (
            <>
              <div>
                <label className="block text-white mb-1" htmlFor="heading3">
                  Article Heading 3
                </label>
                <input
                  type="text"
                  id="heading3"
                  value={data.heading3}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-1" htmlFor="para3">
                  Article Paragraph 3
                </label>
                <textarea
                  id="para3"
                  value={data.para3}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
                  rows="4"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-center text-white
          w-full p-3 rounded bg-transparent border border-white focus:outline-none
          "
            onClick={toggleOptionalFields}
          >
            {showOptionalFields ? (
              <>
                <FaMinus className="mr-2" /> Hide Optional Fields
              </>
            ) : (
              <>
                <FaPlus className="mr-2" /> Show Optional Fields
              </>
            )}
          </div>

          <div>
            <label className="block text-white mb-1" htmlFor="metatitle">
              Meta Title
            </label>
            <input
              type="text"
              id="metatitle"
              value={data.metatitle}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="metadescription">
              Meta Description
            </label>
            <textarea
              id="metadescription"
              value={data.metadescription}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-white mb-1" htmlFor="tags">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={data.tags}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
            />
          </div>

          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Submit Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BitcoinPrice;
