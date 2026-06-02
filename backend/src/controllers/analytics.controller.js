import CompanyPrep from "../models/companyPrep.model.js";
import DsaQuestion from "../models/dsaQuestion.model.js";
import MockInterview from "../models/mockInterview.model.js";
import ResumeAnalysis from "../models/resumeAnalysis.model.js";
import Roadmap from "../models/roadmap.model.js";
import SkillGapAnalysis from "../models/skillGapAnalysis.model.js";

import ApiResponse from "../utils/ApiResponse.js";
import{ asyncHandler }from "../utils/asyncHandler.js";

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

const getScoreLevel = (score) => {
  if (score >= 80) return "strong";
  if (score >= 60) return "good";
  if (score >= 40) return "average";
  return "weak";
};

const getQuickActions = ({
  profileScore,
  latestRoadmap,
  latestResume,
  dsaStats,
  interviewStats,
  latestSkillGap,
  companyStats,
}) => {
  const actions = [];

  if (profileScore < 80) {
    actions.push({
      title: "Complete your profile",
      description: "Add target role, skills, companies, branch, and graduation year.",
      path: "/edit-profile",
      priority: "high",
    });
  }

  if (!latestResume) {
    actions.push({
      title: "Analyze your resume",
      description: "Get ATS score, missing keywords, and improved bullet points.",
      path: "/resume-analyzer",
      priority: "high",
    });
  }

  if (!latestRoadmap) {
    actions.push({
      title: "Generate AI roadmap",
      description: "Create a structured placement preparation plan.",
      path: "/roadmap",
      priority: "high",
    });
  }

  if (dsaStats.solvedQuestions < 30) {
    actions.push({
      title: "Solve more DSA problems",
      description: "Track at least 30 solved problems to build coding momentum.",
      path: "/dsa-tracker",
      priority: "high",
    });
  }

  if (interviewStats.completedInterviews === 0) {
    actions.push({
      title: "Start mock interview",
      description: "Practice AI mock interviews to improve confidence and communication.",
      path: "/mock-interview",
      priority: "medium",
    });
  }

  if (!latestSkillGap) {
    actions.push({
      title: "Generate skill gap analysis",
      description: "Find missing skills and weekly focus areas.",
      path: "/skill-gap",
      priority: "medium",
    });
  }

  if (companyStats.totalCompanies === 0) {
    actions.push({
      title: "Add target companies",
      description: "Track company-wise preparation and application progress.",
      path: "/companies",
      priority: "medium",
    });
  }

  return actions.slice(0, 5);
};

export const getAnalyticsOverview = asyncHandler(async (req, res) => {
  const user = req.user;
  const userId = user._id;

  const profileScore = calculateProfileScore(user);

  const latestRoadmap = await Roadmap.findOne({
    user: userId,
  }).sort({ createdAt: -1 });

  const roadmapProgress = latestRoadmap?.progressPercentage || 0;

  const latestResume = await ResumeAnalysis.findOne({
    user: userId,
  })
    .select("-resumeText -rawAiResponse")
    .sort({ createdAt: -1 });

  const resumeScore = latestResume?.atsScore || 0;

  const totalDsaQuestions = await DsaQuestion.countDocuments({
    user: userId,
  });

  const solvedDsaQuestions = await DsaQuestion.countDocuments({
    user: userId,
    status: "solved",
  });

  const inProgressDsaQuestions = await DsaQuestion.countDocuments({
    user: userId,
    status: "in_progress",
  });

  const revisionDsaQuestions = await DsaQuestion.countDocuments({
    user: userId,
    status: "revision",
  });

  const dsaCompletionPercentage =
    totalDsaQuestions === 0
      ? 0
      : Math.round((solvedDsaQuestions / totalDsaQuestions) * 100);

  const dsaTopicStats = await DsaQuestion.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: {
        _id: "$topic",
        total: { $sum: 1 },
        solved: {
          $sum: {
            $cond: [{ $eq: ["$status", "solved"] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
    {
      $limit: 6,
    },
  ]);

  const completedInterviews = await MockInterview.find({
    user: userId,
    status: "completed",
  }).select("overallScore interviewType createdAt");

  const totalInterviews = await MockInterview.countDocuments({
    user: userId,
  });

  const averageInterviewScore =
    completedInterviews.length === 0
      ? 0
      : Math.round(
          completedInterviews.reduce(
            (sum, interview) => sum + interview.overallScore,
            0
          ) / completedInterviews.length
        );

  const latestInterview = await MockInterview.findOne({
    user: userId,
  })
    .select("-questions.expectedAnswerPoints")
    .sort({ createdAt: -1 });

  const latestSkillGap = await SkillGapAnalysis.findOne({
    user: userId,
  })
    .select("-rawAiResponse")
    .sort({ createdAt: -1 });

  const totalCompanies = await CompanyPrep.countDocuments({
    user: userId,
  });

  const highPriorityCompanies = await CompanyPrep.countDocuments({
    user: userId,
    priority: "high",
  });

  const appliedCompanies = await CompanyPrep.countDocuments({
    user: userId,
    applicationStatus: {
      $ne: "not_applied",
    },
  });

  const companyList = await CompanyPrep.find({
    user: userId,
  }).select("companyName progressPercentage priority applicationStatus");

  const averageCompanyProgress =
    companyList.length === 0
      ? 0
      : Math.round(
          companyList.reduce(
            (sum, company) => sum + company.progressPercentage,
            0
          ) / companyList.length
        );

  const weakAreas = [];

  if (profileScore < 80) weakAreas.push("Profile Completion");
  if (roadmapProgress < 50) weakAreas.push("Roadmap Consistency");
  if (resumeScore < 70) weakAreas.push("Resume ATS Optimization");
  if (dsaCompletionPercentage < 50) weakAreas.push("DSA Practice");
  if (averageInterviewScore < 60) weakAreas.push("Mock Interview Performance");
  if (averageCompanyProgress < 40) weakAreas.push("Company-wise Preparation");

  latestSkillGap?.topThreeFocusAreas?.forEach((focus) => {
    if (!weakAreas.includes(focus)) {
      weakAreas.push(focus);
    }
  });

  const moduleScores = [
    {
      module: "Profile",
      score: profileScore,
      level: getScoreLevel(profileScore),
      path: "/profile",
    },
    {
      module: "Roadmap",
      score: roadmapProgress,
      level: getScoreLevel(roadmapProgress),
      path: latestRoadmap ? `/roadmaps/${latestRoadmap._id}` : "/roadmap",
    },
    {
      module: "Resume",
      score: resumeScore,
      level: getScoreLevel(resumeScore),
      path: latestResume ? `/resume-analyses/${latestResume._id}` : "/resume-analyzer",
    },
    {
      module: "DSA",
      score: dsaCompletionPercentage,
      level: getScoreLevel(dsaCompletionPercentage),
      path: "/dsa-tracker",
    },
    {
      module: "Interview",
      score: averageInterviewScore,
      level: getScoreLevel(averageInterviewScore),
      path: latestInterview ? `/mock-interviews/${latestInterview._id}` : "/mock-interview",
    },
    {
      module: "Companies",
      score: averageCompanyProgress,
      level: getScoreLevel(averageCompanyProgress),
      path: "/companies",
    },
  ];

  const dsaStats = {
    totalQuestions: totalDsaQuestions,
    solvedQuestions: solvedDsaQuestions,
    inProgressQuestions: inProgressDsaQuestions,
    revisionQuestions: revisionDsaQuestions,
    completionPercentage: dsaCompletionPercentage,
    topicStats: dsaTopicStats,
  };

  const interviewStats = {
    totalInterviews,
    completedInterviews: completedInterviews.length,
    averageScore: averageInterviewScore,
    latestInterview: latestInterview
      ? {
          _id: latestInterview._id,
          title: latestInterview.title,
          interviewType: latestInterview.interviewType,
          status: latestInterview.status,
          overallScore: latestInterview.overallScore,
        }
      : null,
  };

  const companyStats = {
    totalCompanies,
    highPriorityCompanies,
    appliedCompanies,
    averageProgress: averageCompanyProgress,
    topCompanies: companyList.slice(0, 5),
  };

  const quickActions = getQuickActions({
    profileScore,
    latestRoadmap,
    latestResume,
    dsaStats,
    interviewStats,
    latestSkillGap,
    companyStats,
  });

  const overview = {
    user: {
      fullName: user.fullName,
      targetRole: user.targetRole,
      targetCompanies: user.targetCompanies || [],
      skills: user.skills || [],
    },

    summary: {
      profileScore,
      roadmapProgress,
      resumeScore,
      dsaCompletionPercentage,
      averageInterviewScore,
      averageCompanyProgress,
    },

    moduleScores,

    latestRoadmap: latestRoadmap
      ? {
          _id: latestRoadmap._id,
          title: latestRoadmap.title,
          progressPercentage: latestRoadmap.progressPercentage,
          completedDays: latestRoadmap.completedDays,
          durationInDays: latestRoadmap.durationInDays,
        }
      : null,

    latestResume: latestResume
      ? {
          _id: latestResume._id,
          originalFileName: latestResume.originalFileName,
          atsScore: latestResume.atsScore,
          missingKeywords: latestResume.missingKeywords,
        }
      : null,

    dsaStats,
    interviewStats,
    skillGap: latestSkillGap
      ? {
          _id: latestSkillGap._id,
          summary: latestSkillGap.summary,
          missingSkills: latestSkillGap.missingSkills,
          weakSkills: latestSkillGap.weakSkills,
          topThreeFocusAreas: latestSkillGap.topThreeFocusAreas,
        }
      : null,
    companyStats,
    weakAreas: weakAreas.slice(0, 8),
    quickActions,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, overview, "Analytics overview fetched successfully"));
});