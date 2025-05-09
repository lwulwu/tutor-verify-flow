
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { TutorApplication, ApplicationStatus } from "../../types";
import { motion } from "framer-motion";
import { CheckCircle, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface HardcopyRequestFormProps {
  application: TutorApplication;
}

const HardcopyRequestForm = ({ application }: HardcopyRequestFormProps) => {
  const { createHardcopyRequest, dataFlow } = useAppContext();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequesting(true);
    
    // Simulate request delay
    setTimeout(() => {
      createHardcopyRequest(application.id);
      setIsRequesting(false);
    }, 1000);
  };

  // Check if a hardcopy request already exists for this application
  const existingRequest = dataFlow.hardcopyRequests.find(
    (req) => req.applicationId === application.id
  );

  // Don't show if there's already a hardcopy request
  if (existingRequest) {
    return null;
  }

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
            <h2 className="text-xl font-semibold text-gray-800">Yêu cầu xác nhận bản cứng</h2>
            <ChevronDown 
              className={`h-5 w-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`} 
            />
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="p-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    {application.status === ApplicationStatus.ApprovedUpload 
                      ? "Tài khoản của bạn đã được xác thực qua tải lên (Tích vàng). Để nâng cấp lên xác thực qua bản cứng (Tích xanh), hãy gửi bản cứng các giấy tờ đã công chứng đến văn phòng của chúng tôi."
                      : "Bạn có thể gửi giấy tờ bản cứng đã công chứng song song với quá trình nộp hồ sơ trực tuyến để đẩy nhanh quá trình xác minh."
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-md p-4 mb-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Hướng dẫn:</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm">
                <li>In tất cả giấy tờ cần xác thực (bằng cấp, chứng chỉ)</li>
                <li>Mang đến cơ quan công chứng để công chứng</li>
                <li>Gửi bản công chứng đến địa chỉ văn phòng của chúng tôi</li>
                <li>Điền thông tin yêu cầu dưới đây và nhấn "Đã gửi giấy tờ bản cứng"</li>
              </ol>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4 mb-4">
              <h3 className="text-md font-medium text-gray-700 mb-2">Địa chỉ gửi hồ sơ:</h3>
              <address className="not-italic text-gray-600">
                <p>Văn phòng TutorVerify</p>
                <p>123 Đường Nguyễn Huệ, Quận 1</p>
                <p>TP. Hồ Chí Minh, Việt Nam</p>
                <p>Điện thoại: (028) 1234-5678</p>
              </address>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isRequesting}
                  className={`px-4 py-2 rounded-md ${
                    isRequesting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  {isRequesting ? "Đang gửi yêu cầu..." : "Đã gửi giấy tờ bản cứng"}
                </button>
              </div>
            </form>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default HardcopyRequestForm;
