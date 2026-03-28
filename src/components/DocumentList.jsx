import { deleteDocument } from "../services/documentService";

const DocumentList = ({ documents, loading, onDelete }) => {
  if (loading) {
    return (
      <div className="text-sm text-gray-500 py-8 text-center">
        Loading documents...
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
        <p className="text-gray-500 text-sm">
          No documents yet. Upload your first one above.
        </p>
      </div>
    );
  }

  const handleDownload = async (doc) => {
    try {
      const response = await fetch(doc.file_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.title;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed: " + err.message);
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.title}"?`)) return;
    const filePath = new URL(doc.file_url).pathname
      .split("/object/sign/documents/")[1]
      ?.split("?")[0];
    try {
      await deleteDocument(doc.id, decodeURIComponent(filePath));
      onDelete();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">
          Your documents
          <span className="ml-2 text-xs font-normal text-gray-400">
            {documents.length} file{documents.length !== 1 ? "s" : ""}
          </span>
        </h2>
      </div>

      <ul className="divide-y divide-gray-100">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.title}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(doc.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <a
                href={doc.file_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Open
              </a>

              <button
                onClick={() => handleDownload(doc)}
                className="text-sm text-green-600 hover:text-green-700 font-medium px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
              >
                Download
              </button>

              <button
                onClick={() => handleDelete(doc)}
                className="text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;
