
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { DataFlow, Tutor, TutorApplication, Document, HardcopyRequest, VerificationStatus, ApplicationStatus, HardcopyRequestStatus } from "../types";
import { generateMockData } from "../utils/mockData";
import { toast } from "@/components/ui/sonner";

interface AppContextProps {
  dataFlow: DataFlow;
  showDataFlow: boolean;
  toggleDataFlow: () => void;
  updateTutor: (tutor: Tutor) => void;
  updateApplication: (application: TutorApplication) => void;
  addDocument: (document: Document) => void;
  createHardcopyRequest: (applicationId: string) => void;
  updateHardcopyRequest: (hardcopyRequest: HardcopyRequest) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [dataFlow, setDataFlow] = useState<DataFlow>(() => generateMockData());
  const [showDataFlow, setShowDataFlow] = useState(false);

  const toggleDataFlow = () => {
    setShowDataFlow(!showDataFlow);
  };

  const updateTutor = (updatedTutor: Tutor) => {
    setDataFlow((prevData) => ({
      ...prevData,
      tutors: prevData.tutors.map((tutor) =>
        tutor.userId === updatedTutor.userId ? { ...tutor, ...updatedTutor } : tutor
      ),
    }));
    
    toast.success("Thông tin gia sư đã được cập nhật");
  };

  const updateApplication = (updatedApplication: TutorApplication) => {
    setDataFlow((prevData) => {
      // Update application
      const newApplications = prevData.applications.map((app) =>
        app.id === updatedApplication.id ? { ...app, ...updatedApplication } : app
      );
      
      // If status changed to ApprovedUpload or ApprovedHardcopy, update tutor status
      if (
        updatedApplication.status === ApplicationStatus.ApprovedUpload ||
        updatedApplication.status === ApplicationStatus.ApprovedHardcopy
      ) {
        const application = prevData.applications.find(
          (app) => app.id === updatedApplication.id
        );
        
        if (application) {
          const newVerificationStatus = 
            updatedApplication.status === ApplicationStatus.ApprovedUpload
              ? VerificationStatus.VerifiedUpload
              : VerificationStatus.VerifiedHardcopy;
          
          const newTutors = prevData.tutors.map((tutor) =>
            tutor.userId === application.tutorId
              ? {
                  ...tutor,
                  verificationStatus: newVerificationStatus,
                  lastStatusUpdateAt: new Date().toISOString(),
                }
              : tutor
          );
          
          return {
            ...prevData,
            applications: newApplications,
            tutors: newTutors,
          };
        }
      }
      
      return {
        ...prevData,
        applications: newApplications,
      };
    });
    
    if (updatedApplication.status === ApplicationStatus.ApprovedUpload) {
      toast.success("Hồ sơ đã được duyệt qua upload");
    } else if (updatedApplication.status === ApplicationStatus.ApprovedHardcopy) {
      toast.success("Hồ sơ đã được duyệt qua bản cứng");
    } else if (updatedApplication.status === ApplicationStatus.RevisionRequested) {
      toast.info("Yêu cầu chỉnh sửa hồ sơ đã được gửi");
    } else {
      toast.info("Đơn ứng tuyển đã được cập nhật");
    }
  };

  const addDocument = (newDocument: Document) => {
    setDataFlow((prevData) => ({
      ...prevData,
      documents: [...prevData.documents, newDocument],
    }));
    
    toast.success("Tài liệu đã được tải lên thành công");
  };

  const createHardcopyRequest = (applicationId: string) => {
    const newRequest: HardcopyRequest = {
      id: `hardcopy-${Date.now()}`,
      applicationId,
      requestedAt: new Date().toISOString(),
      status: HardcopyRequestStatus.Pending,
      staffNotes: "",
    };
    
    setDataFlow((prevData) => ({
      ...prevData,
      hardcopyRequests: [...prevData.hardcopyRequests, newRequest],
    }));
    
    toast.success("Yêu cầu xác nhận bản cứng đã được gửi");
  };

  const updateHardcopyRequest = (updatedRequest: HardcopyRequest) => {
    setDataFlow((prevData) => {
      // Update hardcopy request
      const newRequests = prevData.hardcopyRequests.map((req) =>
        req.id === updatedRequest.id ? { ...req, ...updatedRequest } : req
      );
      
      // If status changed to Approved, update application and tutor status
      if (updatedRequest.status === HardcopyRequestStatus.Approved) {
        const request = prevData.hardcopyRequests.find(
          (req) => req.id === updatedRequest.id
        );
        
        if (request) {
          // Update application status
          const newApplications = prevData.applications.map((app) =>
            app.id === request.applicationId
              ? {
                  ...app,
                  status: ApplicationStatus.ApprovedHardcopy,
                }
              : app
          );
          
          // Find tutor ID from application
          const application = newApplications.find(
            (app) => app.id === request.applicationId
          );
          
          if (application) {
            // Update tutor verification status
            const newTutors = prevData.tutors.map((tutor) =>
              tutor.userId === application.tutorId
                ? {
                    ...tutor,
                    verificationStatus: VerificationStatus.VerifiedHardcopy,
                    lastStatusUpdateAt: new Date().toISOString(),
                  }
                : tutor
            );
            
            return {
              ...prevData,
              hardcopyRequests: newRequests,
              applications: newApplications,
              tutors: newTutors,
            };
          }
        }
      }
      
      return {
        ...prevData,
        hardcopyRequests: newRequests,
      };
    });
    
    if (updatedRequest.status === HardcopyRequestStatus.Approved) {
      toast.success("Yêu cầu bản cứng đã được duyệt");
    } else if (updatedRequest.status === HardcopyRequestStatus.Rejected) {
      toast.error("Yêu cầu bản cứng đã bị từ chối");
    } else {
      toast.info("Yêu cầu bản cứng đã được cập nhật");
    }
  };

  return (
    <AppContext.Provider
      value={{
        dataFlow,
        showDataFlow,
        toggleDataFlow,
        updateTutor,
        updateApplication,
        addDocument,
        createHardcopyRequest,
        updateHardcopyRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
