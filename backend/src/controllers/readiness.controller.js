import Roadmap from "../models/roadmap.model.js";
import ResumeAnalysis from "../models/resumeAnalysis.model.js";
import DsaQuestion from "../models/dsaQuestion.model.js";
import MockInterview from "../models/mockInterview.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const calculateProfileScore = (user) => {
  let score = 0;

  if (user?.fullName) score += 10;
  if (user?.email) score += 10;
  if (user?.college) score += 10;
  if (user?.branch) score += 10;
  if (user?.graduationYear) score += 10;
  if (user?.targetRole) score += 15;
  if (user?.targetCompanies?.length > 0) score += 15;
  if (user?.skills?.length > 0) score += 15;
  if (user?.currentPreparationLevel) score += 5;

  return Math.min(score, 100);
};

const getProfileRecommendation = (profileScore) => {
  if (profileScore >= 90) {
    return "Your profile is strong. Keep it updated with latest skills and target companies.";
  }

  if (profileScore >= 60) {
    return "Your profile is partially complete. Add missing academic, skill, and target company details.";
  }

  return "Complete your profile first. Hirenix AI needs your target role, skills, college, and company goals.";
};

const getRoadmapRecommendation = (roadmap) => {
  if (!roadmap) {
    return "Generate your first AI roadmap to start structured preparation.";
  }

  const progress = safeNumber(roadmap.progressPercentage);

  if (progress >= 80) {
    return "Great roadmap progress. Focus on revision and mock interviews now.";
  }

  if (progress >= 40) {
    return "You are making progress. Continue completing daily roadmap tasks consistently.";
  }

  return "Start completing roadmap days. Follow your plan daily to improve readiness.";
};

const getResumeRecommendation = (resumeScore) => {
  if (resumeScore >= 80) {
    return "Your resume score is strong. Keep improving project impact and keywords.";
  }

  if (resumeScore >= 60) {
    return "Your resume is decent but needs stronger bullets, keywords, and measurable project impact.";
  }

  if (resumeScore > 0) {
    return "Your resume needs improvement. Work on ATS keywords, project descriptions, and technical skills.";
  }

  return "Analyze your resume to get ATS score and personalized improvement suggestions.";
};

const getDsaRecommendation = (dsaPercentage, solvedQuestions) => {
  if (dsaPercentage >= 80 && solvedQuestions >= 100) {
    return "Excellent DSA progress. Focus on timed contests and company-specific problems.";
  }

  if (dsaPercentage >= 50 || solvedQuestions >= 50) {
    return "Good DSA progress. Increase practice on medium and hard problems.";
  }

  if (solvedQuestions > 0) {
    return "Continue solving DSA problems. Focus on arrays, strings, recursion, trees, graphs, and DP.";
  }

  return "Start tracking DSA problems. Add your solved questions to monitor progress.";
};

const getInterviewRecommendation = (interviewScore, completedInterviews) => {
  if (completedInterviews === 0) {
    return "Start your first mock interview to improve confidence, communication, and interview readiness.";
  }

  if (interviewScore >= 80) {
    return "Your mock interview performance is strong. Continue practicing company-specific interviews.";
  }

  if (interviewScore >= 60) {
    return "Your interview performance is decent. Improve answer structure, examples, and clarity.";
  }

  return "Your interview performance needs improvement. Practice HR, project, DSA, and MERN interviews regularly.";
};

const getConsistencyRecommendation = (consistencyScore) => {
  if (consistencyScore >= 80) {
    return "Your recent activity is strong. Maintain daily consistency.";
  }

  if (consistencyScore >= 40) {
    return "You have some recent activity. Try to work daily on roadmap, resume, or DSA.";
  }

  return "Your recent activity is low. Build a daily preparation habit.";
};

export const getPlacementReadinessScore = asyncHandler(async (req, res) => {
  const user = req.user;

  const profileScore = calculateProfileScore(user);

  const latestRoadmap = await Roadmap.findOne({
    user: user._id,
  }).sort({ createdAt: -1 });

  const roadmapScore = safeNumber(latestRoadmap?.progressPercentage);

  const latestResumeAnalysis = await ResumeAnalysis.findOne({
    user: user._id,
  })
    .select("-resumeText -rawAiResponse")
    .sort({ createdAt: -1 });

  const resumeScore = safeNumber(latestResumeAnalysis?.atsScore);

  const totalDsaQuestions = await DsaQuestion.countDocuments({
    user: user._id,
  });

  const solvedDsaQuestions = await DsaQuestion.countDocuments({
    user: user._id,
    status: "solved",
  });

  const dsaScore =
    totalDsaQuestions === 0
      ? 0
      : Math.round((solvedDsaQuestions / totalDsaQuestions) * 100);

  const completedInterviews = await MockInterview.find({
    user: user._id,
    status: "completed",
  }).select("overallScore");

  const totalCompletedInterviews = completedInterviews.length;

  const interviewScore =
    totalCompletedInterviews === 0
      ? 0
      : Math.round(
          completedInterviews.reduce(
            (sum, interview) => sum + safeNumber(interview.overallScore),
            0
          ) / totalCompletedInterviews
        );

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentDsaActivity = await DsaQuestion.countDocuments({
    user: user._id,
    updatedAt: {
      $gte: sevenDaysAgo,
    },
  });

  const recentInterviewActivity = await MockInterview.countDocuments({
    user: user._id,
    updatedAt: {
      $gte: sevenDaysAgo,
    },
  });

  const recentRoadmapActivity =
    latestRoadmap?.updatedAt && latestRoadmap.updatedAt >= sevenDaysAgo ? 1 : 0;

  const recentResumeActivity =
    latestResumeAnalysis?.updatedAt &&
    latestResumeAnalysis.updatedAt >= sevenDaysAgo
      ? 1
      : 0;

  const activityPoints =
    recentDsaActivity +
    recentInterviewActivity +
    recentRoadmapActivity +
    recentResumeActivity;

  const consistencyScore = Math.min(activityPoints * 20, 100);

  const weightedScore = Math.round(
    profileScore * 0.15 +
      roadmapScore * 0.15 +
      resumeScore * 0.2 +
      dsaScore * 0.2 +
      interviewScore * 0.2 +
      consistencyScore * 0.1
  );

  let readinessLevel = "Beginner";

  if (weightedScore >= 80) {
    readinessLevel = "Placement Ready";
  } else if (weightedScore >= 60) {
    readinessLevel = "Almost Ready";
  } else if (weightedScore >= 40) {
    readinessLevel = "Needs Improvement";
  }

  const recommendations = [
    getProfileRecommendation(profileScore),
    getRoadmapRecommendation(latestRoadmap),
    getResumeRecommendation(resumeScore),
    getDsaRecommendation(dsaScore, solvedDsaQuestions),
    getInterviewRecommendation(interviewScore, totalCompletedInterviews),
    getConsistencyRecommendation(consistencyScore),
  ];

  let nextBestAction = "Continue Daily Preparation";

  if (profileScore < 80) {
    nextBestAction = "Complete your profile";
  } else if (!latestResumeAnalysis) {
    nextBestAction = "Analyze your resume";
  } else if (!latestRoadmap) {
    nextBestAction = "Generate your AI roadmap";
  } else if (solvedDsaQuestions < 30) {
    nextBestAction = "Solve more DSA problems";
  } else if (totalCompletedInterviews === 0) {
    nextBestAction = "Start your first mock interview";
  } else if (roadmapScore < 70) {
    nextBestAction = "Continue your roadmap tasks";
  } else if (resumeScore < 80) {
    nextBestAction = "Improve your resume score";
  } else if (interviewScore < 70) {
    nextBestAction = "Practice more mock interviews";
  }

  const data = {
    finalScore: weightedScore,
    readinessLevel,
    nextBestAction,

    breakdown: {
      profile: {
        score: profileScore,
        weight: 15,
        contribution: Math.round(profileScore * 0.15),
      },

      roadmap: {
        score: roadmapScore,
        weight: 15,
        contribution: Math.round(roadmapScore * 0.15),
        latestRoadmap: latestRoadmap
          ? {
              _id: latestRoadmap._id,
              title: latestRoadmap.title,
              progressPercentage: latestRoadmap.progressPercentage,
              completedDays: latestRoadmap.completedDays,
              durationInDays: latestRoadmap.durationInDays,
            }
          : null,
      },

      resume: {
        score: resumeScore,
        weight: 20,
        contribution: Math.round(resumeScore * 0.2),
        latestResumeAnalysis: latestResumeAnalysis
          ? {
              _id: latestResumeAnalysis._id,
              originalFileName: latestResumeAnalysis.originalFileName,
              atsScore: latestResumeAnalysis.atsScore,
            }
          : null,
      },

      dsa: {
        score: dsaScore,
        weight: 20,
        contribution: Math.round(dsaScore * 0.2),
        totalQuestions: totalDsaQuestions,
        solvedQuestions: solvedDsaQuestions,
      },

      interview: {
        score: interviewScore,
        weight: 20,
        contribution: Math.round(interviewScore * 0.2),
        completedInterviews: totalCompletedInterviews,
      },

      consistency: {
        score: consistencyScore,
        weight: 10,
        contribution: Math.round(consistencyScore * 0.1),
        recentActivityCount: activityPoints,
      },
    },

    recommendations,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        data,
        "Placement readiness score fetched successfully"
      )
    );
});