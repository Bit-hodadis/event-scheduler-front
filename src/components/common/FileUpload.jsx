import React, { useState, useCallback } from "react";
import { useEffect } from "react";
import { FaUpload } from "react-icons/fa";

const FileUpload = ({
  id = "imageInput",
  onFileChange,
  image,
  maxSize = 2 * 1024 * 1024,
  allowClear = false,
}) => {
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [fileSize, setFileSize] = useState(null);

  const handleFileRead = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onFileChange(file);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) validateAndReadFile(file);
  }, []);

  const onSelectFile = (event) => {
    const file = event.target.files[0];
    if (file) validateAndReadFile(file);
  };

  const validateAndReadFile = (file) => {
    setFileSize(file.size); // Set file size for display
    if (file.size > maxSize) {
      setError(
        `File size exceeds the limit of ${(maxSize / (1024 * 1024)).toFixed(
          2
        )} MB`
      );
      setPreview(""); // Clear preview if file is too large
    } else {
      handleFileRead(file);
    }
  };

  const onDragOver = (event) => event.preventDefault();

  const formatFileSize = (size) => {
    return size > 1024 * 1024
      ? `${(size / (1024 * 1024)).toFixed(2)} MB`
      : `${(size / 1024).toFixed(2)} KB`;
  };

  useEffect(() => {
    if (allowClear) {
      setPreview();
    }
  }, [allowClear]);

  return (
    <div className="flex flex-col items-center">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => document.getElementById(id).click()}
        className="relative flex h-full min-h-[10rem] w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-primary/50 py-6 transition hover:border-primary hover:bg-primary/10"
      >
        {preview || image ? (
          <div className="relative">
            <img
              src={preview || image}
              alt="Preview"
              className="max-h-40 w-auto object-contain object-center rounded-md shadow-lg transition-transform "
            />
            {/* Display file size as an overlay label */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
            <FaUpload className="text-3xl" />
            <p className="text-sm font-medium">
              Drag & drop or click to select an image
            </p>
            {/* Display max file size */}
            <p className="text-xs text-gray-500">
              Max file size: {(maxSize / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>
      <input
        id={id}
        type="file"
       
        className="hidden"
        onChange={onSelectFile}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error} (Current file size: {formatFileSize(fileSize)})
        </p>
      )}
    </div>
  );
};

export default FileUpload;
