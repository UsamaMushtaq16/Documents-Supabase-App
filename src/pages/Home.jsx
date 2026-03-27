import UploadForm from "../components/UploadForm";
import DocumentList from "../components/DocumentList";
import { useDocuments } from "../hooks/useDocuments";
import { logout } from "../services/authService";

const Home = ({ session }) => {
  const { documents, loading, reload } = useDocuments();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Documents</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {session.user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <UploadForm onUpload={reload} />
        <DocumentList
          documents={documents}
          loading={loading}
          onDelete={reload}
        />
      </div>
    </div>
  );
};

export default Home;
