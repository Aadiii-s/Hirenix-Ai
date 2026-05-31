export const buildSkillGapPrompt = ({
  fullName,
  targetRole,
  targetCompanies,
  userSkills,
  resumeScore,
  resumeMissingKeywords,
  dsaStats,
  roadmapProgress,
  interviewStats,
}) => {
  return `
You are an expert placement mentor and skill gap analyst for Indian engineering students.

Analyze the student's current preparation and identify skill gaps for their target role.

Student:
- Name: ${fullName}
- Target Role: ${targetRole || "Software Development Engineer"}
- Target Companies: ${
    targetCompanies?.length ? targetCompanies.join(", ") : "General product-based companies"
  }
- Current Skills: ${userSkills?.length ? userSkills.join(", ") : "Not provided"}

Resume:
- ATS Score: ${resumeScore || 0}
- Missing Resume Keywords: ${
    resumeMissingKeywords?.length
      ? resumeMissingKeywords.join(", ")
      : "Not available"
  }

DSA:
- Total Questions: ${dsaStats?.totalQuestions || 0}
- Solved Questions: ${dsaStats?.solvedQuestions || 0}
- Completion Percentage: ${dsaStats?.completionPercentage || 0}
- Easy Solved: ${dsaStats?.difficultyBreakdown?.easySolved || 0}
- Medium Solved: ${dsaStats?.difficultyBreakdown?.mediumSolved || 0}
- Hard Solved: ${dsaStats?.difficultyBreakdown?.hardSolved || 0}

Roadmap:
- Progress: ${roadmapProgress || 0}%

Mock Interview:
- Completed Interviews: ${interviewStats?.completedInterviews || 0}
- Average Score: ${interviewStats?.averageScore || 0}

Return response in this exact JSON format only.
Do not add markdown.
Do not add explanation outside JSON.

{
  "summary": "string",
  "requiredSkills": ["string", "string"],
  "missingSkills": ["string", "string"],
  "weakSkills": ["string", "string"],
  "strongSkills": ["string", "string"],
  "prioritySkills": [
    {
      "skill": "string",
      "priority": "high",
      "reason": "string",
      "suggestedAction": "string"
    }
  ],
  "learningPlan": [
    {
      "week": 1,
      "focus": "string",
      "skills": ["string", "string"],
      "tasks": ["string", "string"]
    }
  ],
  "readinessImpact": "high"
}

Rules:
- requiredSkills should match target role and product-based placement needs.
- missingSkills should be skills not visible in current profile/resume/preparation.
- weakSkills should be skills where evidence is weak based on resume, DSA, roadmap, interview.
- strongSkills should be skills already visible.
- prioritySkills should include 5 to 8 most important skills.
- priority must be high, medium, or low.
- learningPlan should be 4 weeks.
- Focus on DSA, CS fundamentals, projects, resume, communication, system design, aptitude where needed.
- Be strict but practical.
`;
};