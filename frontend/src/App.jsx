import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Roadmap from "./pages/Roadmap";
import RoadmapDetails from "./pages/RoadmapDetails";
import RoadmapHistory from "./pages/RoadmapHistory";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeAnalysisHistory from "./pages/ResumeAnalysisHistory";
import ResumeAnalysisDetails from "./pages/ResumeAnalysisDetails";
import DsaTracker from "./pages/DsaTracker";
import ReadinessReport from "./pages/ReadinessReport";
import MockInterview from "./pages/MockInterview";
import MockInterviewHistory from "./pages/MockInterviewHistory";
import MockInterviewSession from "./pages/MockInterviewSession";
import SkillGapAnalyzer from "./pages/SkillGapAnalyzer";
import SkillGapDetails from "./pages/SkillGapDetails";
import SkillGapHistory from "./pages/SkillGapHistory";
import CompanyTracker from "./pages/CompanyTracker";
import CompanyDetails from "./pages/CompanyDetails";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <Roadmap />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmaps"
        element={
          <ProtectedRoute>
            <RoadmapHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmaps/:id"
        element={
          <ProtectedRoute>
            <RoadmapDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-analyzer"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-analyses"
        element={
          <ProtectedRoute>
            <ResumeAnalysisHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/resume-analyses/:id"
        element={
          <ProtectedRoute>
            <ResumeAnalysisDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dsa-tracker"
        element={
          <ProtectedRoute>
            <DsaTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/readiness"
        element={
          <ProtectedRoute>
            <ReadinessReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-interview"
        element={
          <ProtectedRoute>
            <MockInterview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-interviews"
        element={
          <ProtectedRoute>
            <MockInterviewHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mock-interviews/:id"
        element={
          <ProtectedRoute>
            <MockInterviewSession />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skill-gap"
        element={
          <ProtectedRoute>
            <SkillGapAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/skill-gap/history"
        element={
          <ProtectedRoute>
            <SkillGapHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/skill-gap/:id"
        element={
          <ProtectedRoute>
            <SkillGapDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <ProtectedRoute>
            <CompanyTracker />
          </ProtectedRoute>
        }
      />

      <Route
        path="/companies/:id"
        element={
          <ProtectedRoute>
            <CompanyDetails />
          </ProtectedRoute>
        }
      />
      <Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <AnalyticsDashboard />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;