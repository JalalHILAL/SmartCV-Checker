import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ResumeUpload } from "./components/ResumeUpload";
import { ResumeDashboard } from "./components/ResumeDashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-blue-600">SmartCV Checker</h2>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1 p-8">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Authenticated>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Resume Analysis
          </h1>
          <p className="text-xl text-gray-600">
            Upload your resume and get instant feedback with job matching insights
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResumeUpload />
          <ResumeDashboard />
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SmartCV Checker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sign in to analyze your resume with AI
          </p>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}
