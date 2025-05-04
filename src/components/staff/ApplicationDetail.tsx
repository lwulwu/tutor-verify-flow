
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { TutorApplication, ApplicationStatus } from "../../types";
import { motion } from "framer-motion";
import ApplicationHeader from "./ApplicationHeader";
import TutorInfoPanel from "./TutorInfoPanel";
import ActionsPanel from "./ActionsPanel";
import DocumentsList from "./DocumentsList";
import ApplicationNotes from "./ApplicationNotes";
import DocumentUpload from "./DocumentUpload";

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
  
  // Initialize states with application data if available
  useEffect(() => {
    if (application) {
      if (application.revisionNotes) {
        setRevisionNotes(application.revisionNotes);
      }
      
      if (application.internalNotes) {
        setInternalNotes(application.internalNotes);
      }
    }
  }, [application]);
  
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
      <ApplicationHeader status={application.status} onBack={onBack} />

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TutorInfoPanel tutor={tutor} submittedAt={application.submittedAt} />

          <ActionsPanel 
            status={application.status}
            isProcessing={isProcessing}
            hasRevisionNotes={!!revisionNotes.trim()}
            onApproveUpload={handleApproveUpload}
            onRequestRevision={handleRequestRevision}
            onApproveHardcopy={handleApproveHardcopy}
          />
        </div>

        <div className="md:col-span-2 space-y-6">
          <DocumentsList documents={documents} />
          
          <ApplicationNotes 
            revisionNotes={revisionNotes}
            internalNotes={internalNotes}
            setRevisionNotes={setRevisionNotes}
            setInternalNotes={setInternalNotes}
          />

          <div className="pt-4 border-t border-gray-200">
            <DocumentUpload applicationId={applicationId} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetail;
