
import { Tutor } from "../../types";

interface TutorInfoPanelProps {
  tutor: Tutor;
  submittedAt: string;
}

const TutorInfoPanel = ({ tutor, submittedAt }: TutorInfoPanelProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="font-medium text-gray-700 mb-2">Thông tin gia sư</h3>
      <div className="space-y-2">
        <p className="text-sm">
          <span className="text-gray-500">Họ tên:</span>{" "}
          <span className="font-medium">{tutor.name}</span>
        </p>
        <p className="text-sm">
          <span className="text-gray-500">Email:</span>{" "}
          <span>{tutor.email}</span>
        </p>
        {tutor.skills && tutor.skills.length > 0 && (
          <div>
            <span className="text-sm text-gray-500">Kỹ năng:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {tutor.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {tutor.languages && tutor.languages.length > 0 && (
          <div>
            <span className="text-sm text-gray-500">Ngôn ngữ:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {tutor.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
        <p className="text-sm">
          <span className="text-gray-500">Ngày nộp đơn:</span>{" "}
          <span>
            {new Date(submittedAt).toLocaleDateString("vi-VN")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TutorInfoPanel;
