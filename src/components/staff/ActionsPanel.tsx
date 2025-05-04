
import { Check, X } from "lucide-react";
import { ApplicationStatus } from "../../types";
import { Button } from "@/components/ui/button";

interface ActionsPanelProps {
  status: ApplicationStatus;
  isProcessing: boolean;
  hasRevisionNotes: boolean;
  onApproveUpload: () => void;
  onRequestRevision: () => void;
  onApproveHardcopy: () => void;
}

const ActionsPanel = ({ 
  status, 
  isProcessing, 
  hasRevisionNotes,
  onApproveUpload,
  onRequestRevision,
  onApproveHardcopy
}: ActionsPanelProps) => {
  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-md">
      <h3 className="font-medium text-gray-700 mb-2">Thao tác</h3>
      <div className="space-y-2">
        {status === ApplicationStatus.Pending && (
          <>
            <Button
              onClick={onApproveUpload}
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
              onClick={onRequestRevision}
              disabled={isProcessing || !hasRevisionNotes}
              variant="secondary"
              className={`w-full ${
                isProcessing || !hasRevisionNotes
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-warning-600 text-white hover:bg-warning-700"
              }`}
            >
              <X size={16} className="mr-1" />
              Yêu cầu chỉnh sửa
            </Button>
          </>
        )}
        {status === ApplicationStatus.ApprovedUpload && (
          <Button
            onClick={onApproveHardcopy}
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
  );
};

export default ActionsPanel;
