
import { useState } from "react";
import { TutorApplication, Document } from "../../types";
import StatusBadge from "../StatusBadge";
import { motion } from "framer-motion";
import { File, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface ApplicationStatusProps {
  application: TutorApplication | undefined;
  documents: Document[];
}

const ApplicationStatus = ({ application, documents }: ApplicationStatusProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  if (!application) return null;

  // Group documents by file type for better presentation
  const documentsByType: Record<string, Document[]> = {};
  documents.forEach((doc) => {
    if (!documentsByType[doc.description]) {
      documentsByType[doc.description] = [];
    }
    documentsByType[doc.description].push(doc);
  });

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
            <h2 className="text-xl font-semibold text-gray-800">Trạng thái đơn đăng ký</h2>
            <div className="flex items-center gap-2">
              <StatusBadge status={application.status} />
              <ChevronDown 
                className={`h-5 w-5 transition-transform ${isOpen ? "transform rotate-180" : ""}`} 
              />
            </div>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Ngày nộp đơn</p>
              <p className="text-gray-700">
                {new Date(application.submittedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            
            {application.revisionNotes && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-amber-700 font-medium">Yêu cầu chỉnh sửa:</p>
                    <p className="text-sm text-amber-700">{application.revisionNotes}</p>
                  </div>
                </div>
              </div>
            )}
            
            {Object.keys(documentsByType).length > 0 ? (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Tài liệu đã nộp:</h3>
                <div className="space-y-3">
                  {Object.entries(documentsByType).map(([type, docs]) => (
                    <div key={type} className="bg-gray-50 p-3 rounded-md">
                      <p className="font-medium text-gray-700 mb-1">{type}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {docs.map((doc) =>
                          doc.documentFileUploads.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center space-x-2 p-2 bg-white border border-gray-200 rounded-md"
                            >
                              <File size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600 truncate">
                                {file.fileName}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Chưa có tài liệu nào được nộp.</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default ApplicationStatus;
