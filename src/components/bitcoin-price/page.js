

import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Loader from './../Reuseable/Loader';

const BitcoinPrice = () => {
  const [data, setData] = useState({
    Heading1: "",
    Para1: "",
    Heading2: "",
    Para2: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "detailsAdd", "1");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
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
      const docRef = doc(db, "detailsAdd", "1");
      await updateDoc(docRef, {
        Heading1: data.Heading1,
        Para1: data.Para1,
        Heading2: data.Heading2,
        Para2: data.Para2,
      });
      alert("Article updated successfully!");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Error updating article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
            <label className="block text-white mb-1" htmlFor="Heading1">
              Article Heading 1
            </label>
            <input
              type="text"
              id="Heading1"
              value={data.Heading1}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white mb-1" htmlFor="Para1">
              Article Summary 1
            </label>
            <textarea
              id="Para1"
              value={data.Para1}
              onChange={handleInputChange}
              className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
              rows="4"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-white mb-1" htmlFor="Heading2">
                Article Heading 2
              </label>
              <input
                type="text"
                id="Heading2"
                value={data.Heading2}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white mb-1" htmlFor="Para2">
                Article Summary 2
              </label>
              <textarea
                id="Para2"
                value={data.Para2}
                onChange={handleInputChange}
                className="w-full p-3 rounded bg-transparent text-white border border-white focus:outline-none"
                rows="4"
              />
            </div>
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
