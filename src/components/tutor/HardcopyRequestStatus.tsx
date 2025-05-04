
import { useState } from "react";
import { HardcopyRequest, HardcopyRequestStatus as HRStatus } from "../../types";
import StatusBadge from "../StatusBadge";
import { motion } from "framer-motion";
import { ClipboardCheck, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface HardcopyRequestStatusProps {
  request: HardcopyRequest | undefined;
}

const HardcopyRequestStatus = ({ request }: HardcopyRequestStatusProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  if (!request) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md"
    >
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="p-6 border-b border-gray-200">
          <CollapsibleTrigger className="flex justify-between items-center w-full text-left">
            <div className="flex items-center space-x-2">
              <ClipboardCheck className="text-primary-600" size={20} />
              <h2 className="text-xl font-semibold text-gray-800">Trạng thái yêu cầu bản cứng</h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={request.status} />
              <ChevronDown 
                className={`h-5 w-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`} 
              />
            </div>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Ngày gửi yêu cầu</p>
              <p className="text-gray-700">
                {new Date(request.requestedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-700 mb-1">Trạng thái:</h3>
              <p className="text-gray-600">
                {request.status === HRStatus.Pending && (
                  "Yêu cầu của bạn đang được xử lý. Vui lòng chờ đợi."
                )}
                {request.status === HRStatus.Approved && (
                  "Yêu cầu xác nhận bản cứng đã được duyệt. Tài khoản của bạn đã được xác thực bản cứng (Tích xanh)."
                )}
                {request.status === HRStatus.Rejected && (
                  "Yêu cầu xác nhận bản cứng đã bị từ chối. Vui lòng xem ghi chú từ nhân viên."
                )}
              </p>
            </div>
            
            {request.staffNotes && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 font-medium">Ghi chú từ nhân viên:</p>
                    <p className="text-sm text-blue-700">{request.staffNotes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default HardcopyRequestStatus;
