
import { Textarea } from "@/components/ui/textarea";

interface ApplicationNotesProps {
  revisionNotes: string;
  internalNotes: string;
  setRevisionNotes: (value: string) => void;
  setInternalNotes: (value: string) => void;
}

const ApplicationNotes = ({ 
  revisionNotes, 
  internalNotes, 
  setRevisionNotes, 
  setInternalNotes 
}: ApplicationNotesProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="revisionNotes"
          className="block text-sm font-medium text-gray-700"
        >
          Ghi chú chỉnh sửa (hiển thị cho gia sư)
        </label>
        <Textarea
          id="revisionNotes"
          rows={3}
          value={revisionNotes}
          onChange={(e) => setRevisionNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Nhập ghi chú để yêu cầu gia sư chỉnh sửa hồ sơ..."
        />
      </div>
      
      <div>
        <label
          htmlFor="internalNotes"
          className="block text-sm font-medium text-gray-700"
        >
          Ghi chú nội bộ (chỉ hiển thị cho nhân viên)
        </label>
        <Textarea
          id="internalNotes"
          rows={3}
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="Nhập ghi chú nội bộ cho nhân viên khác..."
        />
      </div>
    </div>
  );
};

export default ApplicationNotes;
