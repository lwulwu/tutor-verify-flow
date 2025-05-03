
import { ApplicationStatus, HardcopyRequestStatus, VerificationStatus } from "../types";

interface StatusBadgeProps {
  status: ApplicationStatus | VerificationStatus | HardcopyRequestStatus;
  className?: string;
}

const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      // Application Status
      case ApplicationStatus.Pending:
        return {
          label: "Đang chờ duyệt",
          color: "bg-warning-100 text-warning-800 border-warning-300",
        };
      case ApplicationStatus.RevisionRequested:
        return {
          label: "Yêu cầu chỉnh sửa",
          color: "bg-destructive/10 text-destructive border-destructive/20",
        };
      case ApplicationStatus.ApprovedUpload:
        return {
          label: "Đã duyệt upload (Tích vàng)",
          color: "bg-warning-100 text-warning-800 border-warning-300",
        };
      case ApplicationStatus.ApprovedHardcopy:
        return {
          label: "Đã duyệt bản cứng (Tích xanh)",
          color: "bg-info-100 text-info-800 border-info-300",
        };
      
      // Verification Status
      case VerificationStatus.NotStarted:
        return {
          label: "Chưa xác thực",
          color: "bg-muted/50 text-muted-foreground border-muted/50",
        };
      case VerificationStatus.VerifiedUpload:
        return {
          label: "Đã xác thực upload (Tích vàng)",
          color: "bg-warning-100 text-warning-800 border-warning-300",
        };
      case VerificationStatus.VerifiedHardcopy:
        return {
          label: "Đã xác thực bản cứng (Tích xanh)",
          color: "bg-info-100 text-info-800 border-info-300",
        };
      
      // Hardcopy Request Status
      case HardcopyRequestStatus.Pending:
        return {
          label: "Đang chờ duyệt",
          color: "bg-warning-100 text-warning-800 border-warning-300",
        };
      case HardcopyRequestStatus.Approved:
        return {
          label: "Đã duyệt",
          color: "bg-success-100 text-success-800 border-success-300",
        };
      case HardcopyRequestStatus.Rejected:
        return {
          label: "Đã từ chối",
          color: "bg-destructive/10 text-destructive border-destructive/20",
        };
      
      default:
        return {
          label: status as string,
          color: "bg-muted text-muted-foreground",
        };
    }
  };

  const { label, color } = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color} ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
