export const buildResumeAnalysisPrompt = ({
  fullName,
  targetRole,
  skills,
  resumeText,
}) => {
  return `
You are an expert ATS resume reviewer and software engineering recruiter.

Analyze the following resume for a fresher / entry-level software role.

Candidate:
- Name: ${fullName}
- Target Role: ${targetRole || "Software Development Engineer"}
- Known Skills: ${skills?.length ? skills.join(", ") : "Not provided"}

Resume Text:
${resumeText}

Return response in this exact JSON format only.
Do not add markdown.
Do not add explanation outside JSON.

{
  "atsScore": 75,
  "summary": "string",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "missingKeywords": ["string", "string"],
  "improvedBullets": ["string", "string"],
  "projectSuggestions": ["string", "string"],
  "skillsSuggestions": ["string", "string"],
  "finalSuggestions": ["string", "string"]
}

Rules:
- atsScore must be a number from 0 to 100.
- Give practical suggestions for Indian engineering students.
- Focus on software development, internships, projects, DSA, MERN, backend, frontend, databases, APIs, cloud, AI/ML if relevant.
- Improved bullets should be resume-ready and action-oriented.
- Be strict but helpful.
`;
};