
import { ArrowLeft } from "lucide-react";
import { ApplicationStatus } from "../../types";
import StatusBadge from "../StatusBadge";
import { motion } from "framer-motion";

interface ApplicationHeaderProps {
  status: ApplicationStatus;
  onBack: () => void;
}

const ApplicationHeader = ({ status, onBack }: ApplicationHeaderProps) => {
  return (
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
        <StatusBadge status={status} />
      </div>
    </div>
  );
};

export default ApplicationHeader;
