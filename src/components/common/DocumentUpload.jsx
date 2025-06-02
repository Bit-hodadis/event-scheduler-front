import React from "react";
import { FaFileUpload, FaTimes } from "react-icons/fa";

const DocumentUpload = ({ file, onFileChange, isSubmitted }) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <h3 className="font-medium mb-2">Supporting Document</h3>
        <p className="text-sm text-gray-600">
          Document submitted with this response.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="font-medium mb-2">Supporting Document</h3>
      {file ? (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-sm flex items-center">
            <FaFileUpload className="mr-2" />
            {file.name}
          </span>
          <button
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700"
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaFileUpload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
