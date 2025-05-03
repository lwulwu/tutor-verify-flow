
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import ApplicationsList from "../components/staff/ApplicationsList";
import ApplicationDetail from "../components/staff/ApplicationDetail";
import HardcopyRequestsList from "../components/staff/HardcopyRequestsList";

const StaffScreen = () => {
  const [activeTab, setActiveTab] = useState("applications");
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const handleViewApplication = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
  };

  const handleBackToList = () => {
    setSelectedApplicationId(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Trang Nhân Viên</h1>
      
      {!selectedApplicationId ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-2">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("applications")}
                className={`pb-2 px-4 text-sm font-medium ${
                  activeTab === "applications"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Danh sách đơn ứng tuyển
              </button>
              <button
                onClick={() => setActiveTab("hardcopyRequests")}
                className={`pb-2 px-4 text-sm font-medium ${
                  activeTab === "hardcopyRequests"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Yêu cầu xác nhận bản cứng
              </button>
            </div>
          </div>
          
          {activeTab === "applications" && (
            <ApplicationsList onViewApplication={handleViewApplication} />
          )}
          
          {activeTab === "hardcopyRequests" && <HardcopyRequestsList />}
        </div>
      ) : (
        <ApplicationDetail
          applicationId={selectedApplicationId}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default StaffScreen;
