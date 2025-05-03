
import { useAppContext } from "../context/AppContext";
import TutorProfile from "../components/tutor/TutorProfile";
import ApplicationStatus from "../components/tutor/ApplicationStatus";
import ApplicationForm from "../components/tutor/ApplicationForm";
import HardcopyRequestForm from "../components/tutor/HardcopyRequestForm";
import HardcopyRequestStatus from "../components/tutor/HardcopyRequestStatus";
import CreateCourseForm from "../components/tutor/CreateCourseForm";
import { VerificationStatus } from "../types";

const TutorScreen = () => {
  const { dataFlow } = useAppContext();
  
  // For demo purposes, we'll use the first tutor
  const tutor = dataFlow.tutors[0];
  
  // Find tutor's application
  const application = dataFlow.applications.find((app) => app.tutorId === tutor.userId);
  
  // Find tutor's documents
  const documents = application
    ? dataFlow.documents.filter((doc) => doc.applicationId === application.id)
    : [];
  
  // Find tutor's hardcopy request
  const hardcopyRequest = application
    ? dataFlow.hardcopyRequests.find((req) => req.applicationId === application.id)
    : undefined;

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Trang Gia Sư</h1>
      
      <div className="space-y-6">
        <TutorProfile tutor={tutor} />
        
        {application && (
          <ApplicationStatus application={application} documents={documents} />
        )}
        
        {(!application || application.status === "RevisionRequested") && (
          <ApplicationForm 
            tutorId={tutor.userId} 
            existingApplicationId={application?.id} 
          />
        )}
        
        {application && application.status === "ApprovedUpload" && (
          <HardcopyRequestForm application={application} />
        )}
        
        {hardcopyRequest && (
          <HardcopyRequestStatus request={hardcopyRequest} />
        )}
        
        {tutor.verificationStatus !== VerificationStatus.NotStarted && (
          <CreateCourseForm tutor={tutor} />
        )}
      </div>
    </div>
  );
};

export default TutorScreen;
