
import { File } from "lucide-react";
import { Document } from "../../types";

interface DocumentsListProps {
  documents: Document[];
}

const DocumentsList = ({ documents }: DocumentsListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Tài liệu đã nộp</h3>
      {documents.length > 0 ? (
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">{doc.description}</h4>
                  <p className="text-xs text-gray-500">
                    {doc.staffId
                      ? "Tải lên bởi nhân viên"
                      : "Tải lên bởi gia sư"}
                    {doc.isVisibleToLearner && " • Hiển thị cho học viên"}
                  </p>
                </div>
                {doc.staffId && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    Bản cứng
                  </span>
                )}
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {doc.documentFileUploads.map((file) => (
                  <div
                    key={file.id}
                    className="border border-gray-200 rounded p-2 flex items-center space-x-2"
                  >
                    <File size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">
                      {file.fileName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Chưa có tài liệu nào được nộp.</p>
      )}
    </div>
  );
};

export default DocumentsList;
