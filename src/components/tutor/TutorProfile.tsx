
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Tutor, VerificationStatus } from "../../types";
import StatusBadge from "../StatusBadge";
import VerificationIcon from "../VerificationIcon";
import { motion } from "framer-motion";

interface TutorProfileProps {
  tutor: Tutor;
}

const TutorProfile = ({ tutor }: TutorProfileProps) => {
  const { updateTutor } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: tutor.name,
    skills: tutor.skills?.join(", ") || "",
    languages: tutor.languages?.join(", ") || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTutor({
      ...tutor,
      name: formData.name,
      skills: formData.skills.split(",").map((skill) => skill.trim()),
      languages: formData.languages.split(",").map((lang) => lang.trim()),
    });
    setIsEditing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-800">
              {tutor.name}
            </h2>
            <VerificationIcon status={tutor.verificationStatus} className="ml-1" />
          </div>
          <p className="text-gray-600">{tutor.email}</p>
        </div>
        <StatusBadge status={tutor.verificationStatus} />
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Kỹ năng (ngăn cách bằng dấu phẩy)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngôn ngữ (ngăn cách bằng dấu phẩy)</label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Kỹ năng</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {tutor.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Ngôn ngữ</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {tutor.languages?.map((language, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary-foreground"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
          
          {tutor.verificationStatus !== VerificationStatus.NotStarted && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ngày trở thành gia sư</h3>
              <p className="mt-1 text-gray-700">
                {tutor.becameTutorAt
                  ? new Date(tutor.becameTutorAt).toLocaleDateString("vi-VN")
                  : "Chưa có thông tin"}
              </p>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TutorProfile;
