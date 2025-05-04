
import { useState } from "react";
import { Upload, AlertTriangle, X } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { Document } from "../../types";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DocumentUpload = ({ applicationId }: { applicationId?: string }) => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { addDocument } = useAppContext();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Validate file size
      const newFiles: File[] = [];
      const invalidFiles: string[] = [];
      
      Array.from(e.target.files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          invalidFiles.push(file.name);
        } else {
          newFiles.push(file);
        }
      });
      
      if (invalidFiles.length > 0) {
        setError(`Các file sau vượt quá giới hạn 10MB: ${invalidFiles.join(', ')}`);
      } else {
        setError(null);
      }
      
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    if (files.length === 1) {
      setError(null);
    }
  };

  const validateUpload = (): boolean => {
    if (!applicationId) {
      setError("Không tìm thấy ID của đơn ứng tuyển");
      return false;
    }
    
    if (!description.trim()) {
      setError("Vui lòng nhập mô tả tài liệu");
      return false;
    }
    
    if (files.length === 0) {
      setError("Vui lòng chọn ít nhất một file để tải lên");
      return false;
    }
    
    return true;
  };

  const handleUpload = async () => {
    if (!validateUpload()) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate file upload with progress
      const totalSteps = 10;
      for (let step = 1; step <= totalSteps; step++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(Math.floor((step / totalSteps) * 100));
      }

      // Create document with uploaded files
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        applicationId: applicationId!,
        staffId: "staff-1", // In a real app, this would be the actual staff ID
        description: description,
        isVisibleToLearner: true,
        documentFileUploads: files.map((file, index) => ({
          id: `file-${Date.now()}-${index}`,
          fileName: file.name,
          fileUrl: "/placeholder.svg", // In real app, this would be the actual URL
          uploadedAt: new Date().toISOString(),
        })),
      };

      // Add the document to the data store
      addDocument(newDocument);
      
      // Reset form
      setDescription("");
      setFiles([]);
      setUploadProgress(0);
      
      toast({
        title: "Thành công",
        description: "Tài liệu đã được tải lên thành công",
        variant: "default",
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải lên tài liệu");
      
      toast({
        title: "Lỗi",
        description: "Không thể tải lên tài liệu. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-2">Tải lên tài liệu bản cứng</h3>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả tài liệu</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Ví dụ: Bằng cấp, chứng chỉ, CV,..."
            disabled={isUploading}
          />
        </div>
        
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className={`relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>Tải lên file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.gif"
                  disabled={isUploading}
                />
              </label>
              <p className="pl-1">hoặc kéo thả vào đây</p>
            </div>
            <p className="text-xs text-gray-500">
              PDF, PNG, JPG, GIF tối đa 10MB
            </p>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Files đã chọn:</p>
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md border border-gray-200"
                >
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500"
                    disabled={isUploading}
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Đang tải lên...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || files.length === 0 || !description.trim() || !applicationId}
            className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
              isUploading || files.length === 0 || !description.trim() || !applicationId
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            <Upload size={16} />
            <span>{isUploading ? "Đang tải lên..." : "Tải lên"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
