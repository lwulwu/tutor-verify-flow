import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { HardcopyRequest, HardcopyRequestStatus, Document } from "../../types";
import StatusBadge from "../StatusBadge";
import { motion } from "framer-motion";
import { Check, X, ClipboardCheck, Upload, AlertTriangle, File } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const HardcopyRequestsList = () => {
  const { dataFlow, updateHardcopyRequest, addDocument } = useAppContext();
  const [selectedRequest, setSelectedRequest] = useState<HardcopyRequest | null>(null);
  const [staffNotes, setStaffNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const hardcopyRequests = dataFlow.hardcopyRequests;
  
  // Add application and tutor info to requests
  const requestsWithDetails = hardcopyRequests.map((req) => {
    const application = dataFlow.applications.find((app) => app.id === req.applicationId);
    let tutor = null;
    
    if (application) {
      tutor = dataFlow.tutors.find((t) => t.userId === application.tutorId);
      return {
        ...req,
        application,
        tutor,
      };
    }
    
    return {
      ...req,
      application,
      tutor,
    };
  });

  const handleRequestSelect = (request: HardcopyRequest) => {
    setSelectedRequest(request);
    setStaffNotes(request.staffNotes);
  };

  const handleApprove = () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      updateHardcopyRequest({
        ...selectedRequest,
        status: HardcopyRequestStatus.Approved,
        staffNotes,
      });
      setIsProcessing(false);
      setSelectedRequest(null);
      setStaffNotes("");
    }, 1000);
  };

  const handleReject = () => {
    if (!selectedRequest || !staffNotes.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ghi chú trước khi từ chối.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      updateHardcopyRequest({
        ...selectedRequest,
        status: HardcopyRequestStatus.Rejected,
        staffNotes,
      });
      setIsProcessing(false);
      setSelectedRequest(null);
      setStaffNotes("");
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Validate file size
      const invalidFiles = Array.from(e.target.files).filter(
        file => file.size > 10 * 1024 * 1024 // 10MB limit
      );
      
      if (invalidFiles.length > 0) {
        setUploadError(`Các file sau vượt quá giới hạn 10MB: ${invalidFiles.map(f => f.name).join(', ')}`);
        setSelectedFiles(null);
      } else {
        setUploadError(null);
        setSelectedFiles(e.target.files);
      }
    }
  };

  const validateUploadForm = (): boolean => {
    if (!selectedRequest) {
      setUploadError("Không tìm thấy yêu cầu đã chọn");
      return false;
    }
    
    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadError("Vui lòng chọn ít nhất một file để tải lên");
      return false;
    }
    
    if (!uploadDescription.trim()) {
      setUploadError("Vui lòng nhập mô tả tài liệu");
      return false;
    }
    
    return true;
  };

  const handleUploadSubmit = async () => {
    if (!validateUploadForm()) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate file upload with progress
      const totalSteps = 10;
      for (let step = 1; step <= totalSteps; step++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(Math.floor((step / totalSteps) * 100));
      }

      // Create a new document with the selected files
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        applicationId: selectedRequest!.applicationId,
        staffId: "staff-1", // In a real app, this would be the actual staff ID
        description: uploadDescription,
        isVisibleToLearner: true,
        documentFileUploads: Array.from(selectedFiles!).map((file, index) => ({
          id: `file-${Date.now()}-${index}`,
          fileName: file.name,
          fileUrl: "/placeholder.svg", // In a real app, this would be the actual URL
          uploadedAt: new Date().toISOString(),
        })),
      };

      addDocument(newDocument);
      
      toast({
        title: "Thành công",
        description: "Tài liệu đã được tải lên thành công",
        variant: "default",
      });
      
      // Reset form
      setUploadModalOpen(false);
      setSelectedFiles(null);
      setUploadDescription("");
      setUploadError(null);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Đã xảy ra lỗi khi tải lên tài liệu. Vui lòng thử lại.");
      toast({
        title: "Lỗi tải lên",
        description: "Không thể tải lên tài liệu. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ClipboardCheck className="text-primary-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách yêu cầu xác nhận bản cứng
          </h2>
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
                Ngày yêu cầu
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
            {requestsWithDetails.length > 0 ? (
              requestsWithDetails.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.tutor?.name || "Không có thông tin"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.tutor?.email || "Không có thông tin"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.requestedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleRequestSelect(request)}
                        disabled={request.status !== HardcopyRequestStatus.Pending}
                        className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm ${
                          request.status === HardcopyRequestStatus.Pending
                            ? "text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Xử lý
                      </button>
                      
                      <Dialog open={uploadModalOpen && selectedRequest?.id === request.id} onOpenChange={(open) => {
                        if (!open) {
                          setUploadError(null);
                          setUploadProgress(0);
                          setUploadDescription("");
                          setSelectedFiles(null);
                        }
                        setUploadModalOpen(open);
                      }}>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-success-600 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500"
                          >
                            Upload
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Tải lên tài liệu bản cứng</DialogTitle>
                            <DialogDescription>
                              Tải lên hình ảnh hoặc bản scan của giấy tờ bản cứng đã nhận từ gia sư
                            </DialogDescription>
                          </DialogHeader>
                          
                          {uploadError && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>{uploadError}</AlertDescription>
                            </Alert>
                          )}
                          
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label htmlFor="description" className="text-sm font-medium">
                                Mô tả tài liệu
                              </label>
                              <input
                                id="description"
                                type="text"
                                value={uploadDescription}
                                onChange={(e) => setUploadDescription(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Nhập mô tả tài liệu..."
                                disabled={isUploading}
                              />
                            </div>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                              <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="file-upload"
                                    className={`relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    <span>Tải lên file</span>
                                    <input
                                      id="file-upload"
                                      name="file-upload"
                                      type="file"
                                      className="sr-only"
                                      multiple
                                      onChange={handleFileChange}
                                      accept=".pdf,.png,.jpg,.jpeg,.gif"
                                      disabled={isUploading}
                                    />
                                  </label>
                                  <p className="pl-1">hoặc kéo thả vào đây</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PDF, PNG, JPG, GIF tối đa 10MB
                                </p>
                              </div>
                            </div>
                            {selectedFiles && selectedFiles.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Đã chọn ({selectedFiles.length} file):</p>
                                <ul className="mt-1 text-sm text-gray-500 space-y-1">
                                  {Array.from(selectedFiles).map((file, index) => (
                                    <li key={index} className="flex items-center">
                                      <File className="h-4 w-4 mr-2" />
                                      <span className="truncate">{file.name}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {isUploading && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">Đang tải lên...</span>
                                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                                </div>
                                <Progress value={uploadProgress} />
                              </div>
                            )}
                          </div>
                          
                          <DialogFooter className="sm:justify-end">
                            <button
                              type="button"
                              onClick={() => setUploadModalOpen(false)}
                              disabled={isUploading}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              onClick={handleUploadSubmit}
                              disabled={isUploading || !selectedFiles || selectedFiles.length === 0 || !uploadDescription.trim()}
                              className={`ml-2 px-4 py-2 rounded-md ${
                                isUploading || !selectedFiles || selectedFiles.length === 0 || !uploadDescription.trim()
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-primary-600 text-white hover:bg-primary-700"
                              }`}
                            >
                              {isUploading ? "Đang tải lên..." : "Lưu"}
                            </button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  Không có yêu cầu xác nhận bản cứng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="p-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-800 mb-2">
            Xử lý yêu cầu xác nhận bản cứng
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="staffNotes"
                className="block text-sm font-medium text-gray-700"
              >
                Ghi chú từ nhân viên
              </label>
              <textarea
                id="staffNotes"
                rows={3}
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Nhập ghi chú về việc duyệt/từ chối yêu cầu..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedRequest(null)}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing || !staffNotes.trim()}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isProcessing || !staffNotes.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-destructive text-white hover:bg-destructive/90"
                }`}
              >
                <X size={16} className="mr-1" />
                Từ chối
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-success-600 text-white hover:bg-success-700"
                }`}
              >
                <Check size={16} className="mr-1" />
                Duyệt
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HardcopyRequestsList;
