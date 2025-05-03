
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Sliders, RefreshCw } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleDataFlow, showDataFlow, resetData } = useAppContext();
  const [activeView, setActiveView] = useState(() => {
    if (location.pathname.includes("/staff")) return "staff";
    return "tutor";
  });

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (view === "tutor") {
      navigate("/");
    } else {
      navigate("/staff");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-semibold text-gray-800">TutorVerify</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 rounded-md p-1 flex">
          <button
            onClick={() => handleViewChange("tutor")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${
              activeView === "tutor"
                ? "bg-white text-primary-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Gia sư
          </button>
          <button
            onClick={() => handleViewChange("staff")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${
              activeView === "staff"
                ? "bg-white text-primary-800 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Nhân viên
          </button>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100"
              title="Đặt lại dữ liệu"
            >
              <RefreshCw size={16} />
              <span>Đặt lại dữ liệu</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Đặt lại dữ liệu?</AlertDialogTitle>
              <AlertDialogDescription>
                Thao tác này sẽ xóa tất cả dữ liệu hiện tại và đặt về trạng thái mặc định ban đầu. Các thay đổi này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={resetData}
                className="bg-red-500 hover:bg-red-600"
              >
                Đặt lại
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <button
          onClick={toggleDataFlow}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium ${
            showDataFlow
              ? "bg-primary-100 text-primary-800"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          title="Bật/tắt hiển thị dữ liệu"
        >
          <Sliders size={16} />
          <span>Debug</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
