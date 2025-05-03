
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const DataFlowPanel = () => {
  const { dataFlow, showDataFlow } = useAppContext();

  if (!showDataFlow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white z-50 max-h-[50vh] overflow-auto"
    >
      <div className="container mx-auto p-4">
        <h2 className="text-lg font-semibold mb-2">Data Flow Debug</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Tutors</h3>
            <pre className="text-xs overflow-auto bg-gray-800 p-2 rounded-md">
              {JSON.stringify(dataFlow.tutors, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Applications</h3>
            <pre className="text-xs overflow-auto bg-gray-800 p-2 rounded-md">
              {JSON.stringify(dataFlow.applications, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Documents</h3>
            <pre className="text-xs overflow-auto bg-gray-800 p-2 rounded-md">
              {JSON.stringify(dataFlow.documents, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Hardcopy Requests</h3>
            <pre className="text-xs overflow-auto bg-gray-800 p-2 rounded-md">
              {JSON.stringify(dataFlow.hardcopyRequests, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataFlowPanel;
