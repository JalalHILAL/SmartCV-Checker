import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ResumeUpload() {
  const [resumeText, setResumeText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const uploadResume = useMutation(api.resumes.uploadResume);

  const handleTextUpload = async () => {
    if (!resumeText.trim()) {
      toast.error("Please enter your resume text");
      return;
    }

    setIsUploading(true);
    try {
      await uploadResume({
        content: resumeText,
        fileName: "resume.txt"
      });
      toast.success("Resume uploaded successfully! Analysis in progress...");
      setResumeText("");
    } catch (error) {
      toast.error("Failed to upload resume");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain" && file.type !== "application/pdf") {
      toast.error("Please upload a text file or PDF");
      return;
    }

    setIsUploading(true);
    try {
      let content = "";
      
      if (file.type === "text/plain") {
        content = await file.text();
      } else {
        // For PDF files, we'll use a simple text extraction
        // In a real app, you'd use a proper PDF parser
        const arrayBuffer = await file.arrayBuffer();
        const text = new TextDecoder().decode(arrayBuffer);
        content = text;
      }

      await uploadResume({
        content,
        fileName: file.name
      });
      
      toast.success("Resume uploaded successfully! Analysis in progress...");
      event.target.value = "";
    } catch (error) {
      toast.error("Failed to upload resume");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Resume</h2>
      
      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File (TXT or PDF)
          </label>
          <input
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
        </div>

        <div className="text-center text-gray-500">
          <span>or</span>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Resume Text
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
            disabled={isUploading}
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
          />
        </div>

        <button
          onClick={handleTextUpload}
          disabled={isUploading || !resumeText.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing...
            </div>
          ) : (
            "Analyze Resume"
          )}
        </button>
      </div>
    </div>
  );
}
