
import { Upload } from "lucide-react";

const DocumentUpload = () => {
  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-2">Tải lên tài liệu bản cứng</h3>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
            >
              <span>Tải lên file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
              />
            </label>
            <p className="pl-1">hoặc kéo thả vào đây</p>
          </div>
          <p className="text-xs text-gray-500">
            PDF, PNG, JPG, GIF tối đa 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
