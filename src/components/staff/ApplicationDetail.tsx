import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { TutorApplication, Document, ApplicationStatus } from "../../types";
import StatusBadge from "../StatusBadge";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, File, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApplicationDetailProps {
  applicationId: string;
  onBack: () => void;
}

const ApplicationDetail = ({ applicationId, onBack }: ApplicationDetailProps) => {
  const { dataFlow, updateApplication } = useAppContext();
  const [revisionNotes, setRevisionNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Find application and related data
  const application = dataFlow.applications.find((app) => app.id === applicationId);
  const tutor = application ? dataFlow.tutors.find((t) => t.userId === application.tutorId) : null;
  const documents = dataFlow.documents.filter((doc) => doc.applicationId === applicationId);
  
  if (!application || !tutor) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-4">
          <p className="text-gray-500">Không tìm thấy thông tin đơn ứng tuyển.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Initialize states with application data if available
  if (revisionNotes === "" && application.revisionNotes) {
    setRevisionNotes(application.revisionNotes);
  }
  
  if (internalNotes === "" && application.internalNotes) {
    setInternalNotes(application.internalNotes);
  }

  const handleApproveUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      updateApplication({
        ...application,
        status: ApplicationStatus.ApprovedUpload,
        internalNotes,
      });
      setIsProcessing(false);
    }, 1000);
  };

  const handleRequestRevision = () => {
    if (!revisionNotes.trim()) {
      alert("Vui lòng nhập ghi chú chỉnh sửa trước khi yêu cầu chỉnh sửa.");
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      updateApplication({
        ...application,
        status: ApplicationStatus.RevisionRequested,
        revisionNotes,
        internalNotes,
      });
      setIsProcessing(false);
    }, 1000);
  };

  const handleApproveHardcopy = () => {
    setIsProcessing(true);
    setTimeout(() => {
      updateApplication({
        ...application,
        status: ApplicationStatus.ApprovedHardcopy,
        internalNotes,
      });
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={onBack}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Quay lại"
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              Chi tiết đơn ứng tuyển
            </h2>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Thông tin gia sư</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Họ tên:</span>{" "}
                <span className="font-medium">{tutor.name}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Email:</span>{" "}
                <span>{tutor.email}</span>
              </p>
              {tutor.skills && tutor.skills.length > 0 && (
                <div>
                  <span className="text-sm text-gray-500">Kỹ năng:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {tutor.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tutor.languages && tutor.languages.length > 0 && (
                <div>
                  <span className="text-sm text-gray-500">Ngôn ngữ:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {tutor.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-sm">
                <span className="text-gray-500">Ngày nộp đơn:</span>{" "}
                <span>
                  {new Date(application.submittedAt).toLocaleDateString("vi-VN")}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Thao tác</h3>
            <div className="space-y-2">
              {application.status === ApplicationStatus.Pending && (
                <>
                  <Button
                    onClick={handleApproveUpload}
                    disabled={isProcessing}
                    variant="default"
                    className={`w-full ${
                      isProcessing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-success-600 text-white hover:bg-success-700"
                    }`}
                  >
                    <Check size={16} className="mr-1" />
                    Duyệt qua upload
                  </Button>
                  <Button
                    onClick={handleRequestRevision}
                    disabled={isProcessing || !revisionNotes.trim()}
                    variant="secondary"
                    className={`w-full ${
                      isProcessing || !revisionNotes.trim()
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-warning-600 text-white hover:bg-warning-700"
                    }`}
                  >
                    <X size={16} className="mr-1" />
                    Yêu cầu chỉnh sửa
                  </Button>
                </>
              )}
              {application.status === ApplicationStatus.ApprovedUpload && (
                <Button
                  onClick={handleApproveHardcopy}
                  disabled={isProcessing}
                  variant="default"
                  className={`w-full ${
                    isProcessing
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  <Check size={16} className="mr-1" />
                  Duyệt qua bản cứng
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Tài liệu đã nộp</h3>
            {documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800">{doc.description}</h4>
                        <p className="text-xs text-gray-500">
                          {doc.staffId
                            ? "Tải lên bởi nhân viên"
                            : "Tải lên bởi gia sư"}
                          {doc.isVisibleToLearner && " • Hiển thị cho học viên"}
                        </p>
                      </div>
                      {doc.staffId && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          Bản cứng
                        </span>
                      )}
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {doc.documentFileUploads.map((file) => (
                        <div
                          key={file.id}
                          className="border border-gray-200 rounded p-2 flex items-center space-x-2"
                        >
                          <File size={16} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">
                            {file.fileName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Chưa có tài liệu nào được nộp.</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="revisionNotes"
                className="block text-sm font-medium text-gray-700"
              >
                Ghi chú chỉnh sửa (hiển thị cho gia sư)
              </label>
              <textarea
                id="revisionNotes"
                rows={3}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Nhập ghi chú để yêu cầu gia sư chỉnh sửa hồ sơ..."
              />
            </div>
            
            <div>
              <label
                htmlFor="internalNotes"
                className="block text-sm font-medium text-gray-700"
              >
                Ghi chú nội bộ (chỉ hiển thị cho nhân viên)
              </label>
              <textarea
                id="internalNotes"
                rows={3}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Nhập ghi chú nội bộ cho nhân viên khác..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Tải lên tài liệu bản cứng</h3>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
                  >
                    <span>Tải lên file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                    />
                  </label>
                  <p className="pl-1">hoặc kéo thả vào đây</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG, GIF tối đa 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetail;
