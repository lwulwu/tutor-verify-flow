
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { HardcopyRequest, HardcopyRequestStatus } from "../../types";
import StatusBadge from "../StatusBadge";
import { motion } from "framer-motion";
import { Check, X, ClipboardCheck } from "lucide-react";

const HardcopyRequestsList = () => {
  const { dataFlow, updateHardcopyRequest } = useAppContext();
  const [selectedRequest, setSelectedRequest] = useState<HardcopyRequest | null>(null);
  const [staffNotes, setStaffNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
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
      alert("Vui lòng nhập ghi chú trước khi từ chối.");
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
