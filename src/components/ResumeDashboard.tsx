import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function ResumeDashboard() {
  const resumes = useQuery(api.resumes.getUserResumes) || [];
  const [selectedResumeId, setSelectedResumeId] = useState<Id<"resumes"> | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const analyzeJobMatch = useAction(api.resumes.analyzeJobMatch);
  
  const selectedResume = resumes.find(r => r._id === selectedResumeId);

  const handleJobMatch = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      toast.error("Please select a resume and enter a job description");
      return;
    }

    setIsAnalyzing(true);
    try {
      await analyzeJobMatch({
        resumeId: selectedResumeId,
        jobDescription: jobDescription.trim()
      });
      toast.success("Job match analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze job match");
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (resumes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Analysis Dashboard</h2>
        <div className="text-center text-gray-500 py-12">
          <p>Upload a resume to see analysis results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Analysis Dashboard</h2>
      
      {/* Resume Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Resume
        </label>
        <select
          value={selectedResumeId || ""}
          onChange={(e) => setSelectedResumeId(e.target.value as Id<"resumes"> || null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose a resume...</option>
          {resumes.map((resume) => (
            <option key={resume._id} value={resume._id}>
              {resume.fileName || `Resume ${new Date(resume.createdAt).toLocaleDateString()}`}
            </option>
          ))}
        </select>
      </div>

      {selectedResume && (
        <div className="space-y-6">
          {/* Basic Analysis */}
          {selectedResume.analysis && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Analysis</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedResume.analysis.wordCount}
                  </div>
                  <div className="text-sm text-gray-600">Words</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedResume.analysis.readabilityScore}/100
                  </div>
                  <div className="text-sm text-gray-600">Readability</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Skills ({selectedResume.analysis.skills.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResume.analysis.skills.slice(0, 10).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                    {selectedResume.analysis.skills.length > 10 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{selectedResume.analysis.skills.length - 10} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Job Titles</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResume.analysis.jobTitles.map((title, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {title}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedResume.analysis.grammarIssues.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Grammar Issues ({selectedResume.analysis.grammarIssues.length})</h4>
                    <div className="space-y-2">
                      {selectedResume.analysis.grammarIssues.slice(0, 3).map((issue, index) => (
                        <div key={index} className="text-sm bg-yellow-50 p-2 rounded">
                          <div className="text-yellow-800 font-medium">{issue.issue}</div>
                          <div className="text-yellow-600">{issue.suggestion}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Job Match Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Match Analysis</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                onClick={handleJobMatch}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Match...
                  </div>
                ) : (
                  "Analyze Job Match"
                )}
              </button>

              {selectedResume.jobMatchScore !== undefined && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Match Score</span>
                    <span className="text-sm font-bold text-gray-900">{selectedResume.jobMatchScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        selectedResume.jobMatchScore >= 80 ? 'bg-green-500' :
                        selectedResume.jobMatchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${selectedResume.jobMatchScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {selectedResume.insights && selectedResume.insights.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Insights & Recommendations</h4>
                  <div className="space-y-2">
                    {selectedResume.insights.map((insight, index) => (
                      <div key={index} className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
