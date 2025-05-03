
export enum VerificationStatus {
  NotStarted = "NotStarted",
  VerifiedUpload = "VerifiedUpload",
  VerifiedHardcopy = "VerifiedHardcopy"
}

export enum ApplicationStatus {
  Pending = "Pending",
  RevisionRequested = "RevisionRequested",
  ApprovedUpload = "ApprovedUpload",
  ApprovedHardcopy = "ApprovedHardcopy"
}

export enum HardcopyRequestStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected"
}

export interface Tutor {
  userId: string;
  verificationStatus: VerificationStatus;
  lastStatusUpdateAt: string;
  becameTutorAt?: string;
  name: string;
  email: string;
  skills?: string[];
  languages?: string[];
}

export interface TutorApplication {
  id: string;
  tutorId: string;
  submittedAt: string;
  status: ApplicationStatus;
  revisionNotes: string;
  internalNotes: string;
  tutor?: Tutor;
}

export interface DocumentFileUpload {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Document {
  id: string;
  applicationId: string;
  staffId?: string;
  description: string;
  isVisibleToLearner: boolean;
  documentFileUploads: DocumentFileUpload[];
}

export interface HardcopyRequest {
  id: string;
  applicationId: string;
  requestedAt: string;
  status: HardcopyRequestStatus;
  staffNotes: string;
  application?: TutorApplication;
}

export interface DataFlow {
  tutors: Tutor[];
  applications: TutorApplication[];
  documents: Document[];
  hardcopyRequests: HardcopyRequest[];
}
