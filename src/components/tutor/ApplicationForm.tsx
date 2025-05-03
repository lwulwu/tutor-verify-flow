
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Document, ApplicationStatus } from "../../types";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";

interface ApplicationFormProps {
  tutorId: string;
  existingApplicationId?: string;
}

const ApplicationForm = ({ tutorId, existingApplicationId }: ApplicationFormProps) => {
  const { addDocument } = useAppContext();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isVisibleToLearner, setIsVisibleToLearner] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Simulate file upload
    setTimeout(() => {
      const applicationId = existingApplicationId || `app-${Date.now()}`;
      
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        applicationId,
        description,
        isVisibleToLearner,
        documentFileUploads: files.map((file, index) => ({
          id: `file-${Date.now()}-${index}`,
          fileName: file.name,
          fileUrl: "/placeholder.svg", // Using placeholder for demo
          uploadedAt: new Date().toISOString(),
        })),
      };
      
      addDocument(newDocument);
      
      // Reset form
      setDescription("");
      setFiles([]);
      setIsVisibleToLearner(true);
      setIsUploading(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Tải lên giấy tờ/chứng thực</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả tài liệu</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Ví dụ: Bằng cấp, chứng chỉ, CV,..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tải lên file</label>
          <div className="mt-1">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Kéo thả hoặc nhấn</span> để tải file lên
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, JPEG, PNG (tối đa 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Files đã chọn:</p>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md border border-gray-200"
                >
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isVisibleToLearner"
            checked={isVisibleToLearner}
            onChange={(e) => setIsVisibleToLearner(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isVisibleToLearner"
            className="ml-2 block text-sm text-gray-700"
          >
            Hiển thị cho học viên
          </label>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={files.length === 0 || isUploading || !description}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              files.length === 0 || isUploading || !description
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            {isUploading ? (
              <span>Đang tải lên...</span>
            ) : (
              <>
                <Upload size={16} />
                <span>Tải lên</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ApplicationForm;
