export const buildRoadmapPrompt = ({
  fullName,
  targetRole,
  targetCompany,
  durationInDays,
  currentLevel,
  skills,
  weakAreas,
  college,
  branch,
}) => {
  return `
You are an expert placement preparation mentor for Indian engineering students.

Create a highly practical and personalized placement preparation roadmap.

Student Profile:
- Name: ${fullName}
- College: ${college || "Not provided"}
- Branch: ${branch || "Not provided"}
- Target Role: ${targetRole}
- Target Company: ${targetCompany || "General product-based companies"}
- Duration: ${durationInDays} days
- Current Level: ${currentLevel}
- Current Skills: ${skills?.length ? skills.join(", ") : "Not provided"}
- Weak Areas: ${weakAreas?.length ? weakAreas.join(", ") : "Not provided"}

Roadmap must cover:
1. DSA preparation
2. Core CS subjects
3. Resume improvement
4. Project explanation practice
5. Mock interview practice
6. Aptitude practice
7. Communication improvement
8. Weekly revision
9. Company-specific preparation if target company is provided

Return response in this exact JSON format only.
Do not add markdown.
Do not add explanation outside JSON.

{
  "title": "string",
  "summary": "string",
  "dailyPlan": [
    {
      "day": 1,
      "title": "string",
      "focusArea": "string",
      "estimatedHours": 4,
      "tasks": ["string", "string", "string"]
    }
  ],
  "weeklyMilestones": [
    {
      "week": 1,
      "goal": "string",
      "topics": ["string", "string"],
      "deliverables": ["string", "string"]
    }
  ],
  "recommendedResources": ["string", "string"],
  "aiSuggestions": ["string", "string"]
}

Rules:
- dailyPlan must contain exactly ${durationInDays} days.
- estimatedHours should be realistic.
- Tasks should be specific and actionable.
- Include DSA topics like Arrays, Strings, Linked List, Trees, Graphs, DP, Greedy.
- Include CS topics like DBMS, OS, OOP, CN where useful.
- Include resume and mock interview tasks weekly.
- Make it suitable for placement preparation.
`;
};