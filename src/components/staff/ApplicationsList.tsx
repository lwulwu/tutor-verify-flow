
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { TutorApplication } from "../../types";
import StatusBadge from "../StatusBadge";
import VerificationIcon from "../VerificationIcon";
import { motion } from "framer-motion";
import { Check, X, Eye } from "lucide-react";

interface ApplicationsListProps {
  onViewApplication: (applicationId: string) => void;
}

const ApplicationsList = ({ onViewApplication }: ApplicationsListProps) => {
  const { dataFlow } = useAppContext();
  const [filter, setFilter] = useState("all");
  
  const { applications, tutors } = dataFlow;
  
  // Add tutor info to applications
  const applicationsWithTutor = applications.map((app) => {
    const tutor = tutors.find((t) => t.userId === app.tutorId);
    return {
      ...app,
      tutor,
    };
  });
  
  // Filter applications
  const filteredApplications = applicationsWithTutor.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Danh sách đơn ứng tuyển</h2>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "all"
                ? "bg-primary-100 text-primary-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("Pending")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "Pending"
                ? "bg-warning-100 text-warning-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Đang chờ duyệt
          </button>
          <button
            onClick={() => setFilter("RevisionRequested")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "RevisionRequested"
                ? "bg-destructive/10 text-destructive font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Yêu cầu chỉnh sửa
          </button>
          <button
            onClick={() => setFilter("ApprovedUpload")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "ApprovedUpload"
                ? "bg-warning-100 text-warning-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Đã duyệt upload
          </button>
          <button
            onClick={() => setFilter("ApprovedHardcopy")}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === "ApprovedHardcopy"
                ? "bg-info-100 text-info-800 font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Đã duyệt bản cứng
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">
                Gia sư
              </th>
              <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">
                Ngày nộp đơn
              </th>
              <th className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900">
                Trạng thái
              </th>
              <th className="py-3.5 px-4 text-center text-sm font-semibold text-gray-900">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          {application.tutor?.name}
                          {application.tutor && (
                            <VerificationIcon
                              status={application.tutor.verificationStatus}
                              className="ml-1"
                            />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.tutor?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.submittedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge status={application.status} />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => onViewApplication(application.id)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Eye size={14} className="mr-1" />
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  Không có đơn ứng tuyển nào phù hợp với bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ApplicationsList;
