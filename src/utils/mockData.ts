
import { DataFlow, Tutor, TutorApplication, Document, HardcopyRequest, VerificationStatus, ApplicationStatus } from "../types";

export const generateMockData = (): DataFlow => {
  const tutors: Tutor[] = [
    {
      userId: "tutor-1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      verificationStatus: VerificationStatus.NotStarted,
      lastStatusUpdateAt: new Date().toISOString(),
      skills: ["Toán", "Lý", "Hóa"],
      languages: ["Tiếng Việt", "Tiếng Anh"],
    },
    {
      userId: "tutor-2",
      name: "Trần Thị B",
      email: "tranthib@example.com", 
      verificationStatus: VerificationStatus.VerifiedUpload,
      lastStatusUpdateAt: new Date().toISOString(),
      becameTutorAt: new Date().toISOString(),
      skills: ["Ngữ văn", "Tiếng Anh", "Lịch sử"],
      languages: ["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"],
    },
    {
      userId: "tutor-3",
      name: "Lê Văn C",
      email: "levanc@example.com",
      verificationStatus: VerificationStatus.VerifiedHardcopy,
      lastStatusUpdateAt: new Date().toISOString(),
      becameTutorAt: new Date().toISOString(),
      skills: ["Tin học", "Lập trình", "Toán"],
      languages: ["Tiếng Việt", "Tiếng Anh"],
    },
  ];

  const applications: TutorApplication[] = [
    {
      id: "app-1",
      tutorId: "tutor-1",
      submittedAt: new Date().toISOString(),
      status: ApplicationStatus.Pending,
      revisionNotes: "",
      internalNotes: "",
    },
    {
      id: "app-2",
      tutorId: "tutor-2",
      submittedAt: new Date().toISOString(),
      status: ApplicationStatus.ApprovedUpload,
      revisionNotes: "",
      internalNotes: "Hồ sơ đầy đủ, đã duyệt qua upload",
    },
    {
      id: "app-3",
      tutorId: "tutor-3",
      submittedAt: new Date().toISOString(),
      status: ApplicationStatus.ApprovedHardcopy,
      revisionNotes: "",
      internalNotes: "Đã xác minh qua bản cứng",
    },
  ];

  const documents: Document[] = [
    {
      id: "doc-1",
      applicationId: "app-1",
      description: "Bằng cấp và chứng chỉ",
      isVisibleToLearner: true,
      documentFileUploads: [
        {
          id: "file-1",
          fileName: "bang_dai_hoc.pdf",
          fileUrl: "/placeholder.svg",
          uploadedAt: new Date().toISOString(),
        },
        {
          id: "file-2",
          fileName: "chung_chi_tieng_anh.pdf",
          fileUrl: "/placeholder.svg",
          uploadedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "doc-2",
      applicationId: "app-2",
      description: "CV và giấy tờ hỗ trợ",
      isVisibleToLearner: false,
      documentFileUploads: [
        {
          id: "file-3",
          fileName: "cv_gia_su.pdf",
          fileUrl: "/placeholder.svg",
          uploadedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "doc-3",
      applicationId: "app-3",
      description: "Bằng cấp và chứng chỉ",
      isVisibleToLearner: true,
      documentFileUploads: [
        {
          id: "file-4",
          fileName: "bang_thac_si.pdf",
          fileUrl: "/placeholder.svg",
          uploadedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "doc-4",
      applicationId: "app-3",
      staffId: "staff-1",
      description: "Bản cứng đã xác minh",
      isVisibleToLearner: false,
      documentFileUploads: [
        {
          id: "file-5",
          fileName: "xac_minh_ban_cung.pdf",
          fileUrl: "/placeholder.svg",
          uploadedAt: new Date().toISOString(),
        },
      ],
    },
  ];

  const hardcopyRequests: HardcopyRequest[] = [
    {
      id: "hardcopy-1",
      applicationId: "app-2",
      requestedAt: new Date().toISOString(),
      status: "Pending",
      staffNotes: "",
    },
  ];

  return {
    tutors,
    applications,
    documents,
    hardcopyRequests,
  };
};
