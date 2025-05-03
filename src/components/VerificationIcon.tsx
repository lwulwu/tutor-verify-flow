
import { VerificationStatus } from "../types";
import { CheckCircle } from "lucide-react";

interface VerificationIconProps {
  status: VerificationStatus;
  className?: string;
}

const VerificationIcon = ({ status, className = "" }: VerificationIconProps) => {
  if (status === VerificationStatus.NotStarted) {
    return null;
  }

  const color = status === VerificationStatus.VerifiedUpload ? "text-warning-500" : "text-info-600";

  return <CheckCircle className={`inline-block ${color} ${className}`} size={16} />;
};

export default VerificationIcon;
