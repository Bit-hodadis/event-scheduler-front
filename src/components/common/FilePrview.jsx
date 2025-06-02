import React from "react";
// import { File, FileImage, FileText } from "";
import Modal from "./Modal";
import { useToast } from "../../context/ToastContext";
const FilePreview = ({ fileUrl,showPreview, setShowPreview,selectedCategory}) => {
  const fileExtension = fileUrl?.split('.').pop().toLowerCase();

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension);
  const isPDF = fileExtension === "pdf";
  const isDocx = fileExtension === "docx" || fileExtension === "doc";
const toast = useToast()
  const handleDownload = async () => {
    try {
      const response = await fetch(fileUrl, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileUrl.split('/').pop(); // or use a custom name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
    //   console.error("Download failed:", error);
      toast.error("Failed to download file.");
    }
  };
  


  return (
    <Modal
    isOpen={showPreview}
    onClose={() => setShowPreview(false)}
    title="File Preview"
    description={selectedCategory}
    size="xl"
    // description={`${selectedCategoryAttachments.length} ${selectedCategoryAttachments.length === 1 ? 'file' : 'files'} attached`}
  >
    <div className="w-full  mx-auto  border-gray-300 rounded-xl bg-white ">

      {isImage && (
        <img
          src={fileUrl}
          alt="Preview"
          className="rounded-lg shadow max-h-[600px] mx-auto"
        />
      )}

      {isPDF && (
        <embed
          src={fileUrl}
          type="application/pdf"
          className="w-full h-[600px] z-50 rounded"
        />
      )}

      {isDocx && (
        <iframe
          src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
          className="w-full h-[600px] rounded"
          frameBorder="0"
          title="DOCX Preview"
        />
      )}

      {!isImage && !isPDF && !isDocx && (
        <div className="flex items-center justify-center text-gray-500 p-6 border border-dashed rounded-md">
          {/* <File className="w-6 h-6 mr-2" /> */}
          <span>No preview available for this file type</span>
        </div>
      )}
              <div className="flex justify-end mt-4 px-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-primary hover:bg-primary text-white rounded"
          >
            Download File
          </button>
        </div>
    </div>
    </Modal>
  );

};

export default FilePreview;
