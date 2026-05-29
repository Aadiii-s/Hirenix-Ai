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
        element ={
          <ProtectedRoute>
            <ResumeAnalyzer/>
          </ProtectedRoute>
        }
        />

      <Route
         path="/resume-analyses"
         element ={
          <ProtectedRoute>
            <ResumeAnalysisHistory/>
          </ProtectedRoute>
         }
        />
      
      <Route
        path="/resume-analyses/:id"
        element ={
          <ProtectedRoute>
            <ResumeAnalysisDetails/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dsa-tracker"
        element ={
          <ProtectedRoute>
            <DsaTracker />
          </ProtectedRoute>
        }
        />
        <Route
          path="/readiness"
          element ={
            <ProtectedRoute>
              <ReadinessReport />
            </ProtectedRoute>
          }
          />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;