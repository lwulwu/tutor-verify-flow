
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Tutor, VerificationStatus } from "../../types";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface CreateCourseFormProps {
  tutor: Tutor;
}

const CreateCourseForm = ({ tutor }: CreateCourseFormProps) => {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    // Simulate course creation
    setTimeout(() => {
      // In a real app, we'd create a course in the database
      setCreating(false);
      setCourseName("");
      setCourseDescription("");
      setCoursePrice("");
      alert("Khóa học đã được tạo thành công!");
    }, 1000);
  };

  // Only show if tutor is verified
  if (
    tutor.verificationStatus !== VerificationStatus.VerifiedUpload &&
    tutor.verificationStatus !== VerificationStatus.VerifiedHardcopy
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="text-primary-600" size={20} />
        <h2 className="text-xl font-semibold text-gray-800">Tạo khóa học mới</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên khóa học</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Ví dụ: Toán cao cấp lớp 12"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả khóa học</label>
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Mô tả chi tiết về nội dung khóa học..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Giá khóa học (VND)</label>
          <input
            type="number"
            value={coursePrice}
            onChange={(e) => setCoursePrice(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Ví dụ: 500000"
            min="0"
            step="10000"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={creating || !courseName || !courseDescription || !coursePrice}
            className={`px-4 py-2 rounded-md ${
              creating || !courseName || !courseDescription || !coursePrice
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            {creating ? "Đang tạo..." : "Tạo khóa học"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateCourseForm;
