import React, { useState } from "react";
import axios from "axios";

const ImportUserPosts = () => {
  const [file, setFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImportResult(null);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const res = await axios.post("https://api.edge21.co/api/userPosts/import-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImportResult(res.data);
    } catch (err) {
      setImportResult({ error: err.response?.data?.message || "Import failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex flex-col items-center">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Multiple User Posts from Excel</h2>
        {/* Admin Note for variable format */}
        <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-4 rounded">
          <strong>Note for Admins:</strong> Please ensure your Excel file uses the following variable/column format:<br />
          <span className="font-mono text-xs">
            ["ContentID", "InternalScore", "SourceDescription", "SourceImage", "SourceName", "postCategory", "postDescription", "postOwner", "postPhoto", "postTitle", "rating", "sourceLink", "timePublished"]
          </span><br />
          Example first row (header): <span className="font-mono text-xs">ContentID, InternalScore, SourceDescription, SourceImage, SourceName, postCategory, postDescription, postOwner, postPhoto, postTitle, rating, sourceLink, timePublished</span><br />
          <div className="mt-2 text-xs">
            <strong>Categories:</strong> For <span className="font-mono">postCategory</span>, use one of the following:<br />
            <ul className="list-disc pl-6">
              <li>Audio, Tweet, Charts, Article, Video, Nostr</li>
            </ul>
          </div>
          <span className="text-xs text-red-600">Incorrect variable names or missing columns will cause import errors.</span>
        </div>
        <form onSubmit={handleImport}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-white">
              Select Excel File (.xlsx or .xls):
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!file || loading}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow text-white font-semibold"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
        {importResult && (
          <div className="mt-6 bg-gray-700 rounded p-4 text-white">
            {importResult.error ? (
              <div className="text-red-400">{importResult.error}</div>
            ) : (
              <>
                <div>Imported: {importResult.imported}</div>
                <div>Skipped: {importResult.skipped}</div>
                <div className="mt-2">
                  <strong>Posts:</strong>
                  {/* Non-editable preview of posts */}
                  <pre className="bg-gray-800 rounded p-2 text-xs overflow-x-auto max-h-64 select-none" tabIndex={-1} readOnly aria-readonly="true">{JSON.stringify(importResult.posts, null, 2)}</pre>
                </div>
                {/* Reload button after successful import */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded shadow text-white font-semibold"
                  >
                    Upload New File
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportUserPosts;