export const buildInterviewQuestionsPrompt = ({
  fullName,
  targetRole,
  skills,
  interviewType,
  difficulty,
  questionCount,
}) => {
  return `
You are an expert technical interviewer for software engineering placements.

Create a mock interview question set for an Indian engineering student.

Candidate:
- Name: ${fullName}
- Target Role: ${targetRole || "Software Development Engineer"}
- Skills: ${skills?.length ? skills.join(", ") : "Not provided"}
- Interview Type: ${interviewType}
- Difficulty: ${difficulty}
- Number of Questions: ${questionCount}

Interview type meaning:
- hr: HR and general personality questions
- dsa: DSA concepts, problem-solving, complexity
- mern: MongoDB, Express, React, Node.js, APIs, authentication
- project: project explanation, architecture, database, challenges, deployment
- behavioral: teamwork, conflict, leadership, failure, communication
- mixed: combination of HR, DSA, MERN, project, behavioral

Return response in this exact JSON format only.
Do not add markdown.
Do not add explanation outside JSON.

{
  "title": "string",
  "questions": [
    {
      "question": "string",
      "category": "hr",
      "expectedAnswerPoints": ["string", "string", "string"]
    }
  ]
}

Rules:
- Generate exactly ${questionCount} questions.
- Questions should be realistic for campus placements and product-based companies.
- Questions should match the candidate's skills and target role.
- For project questions, include architecture, database, APIs, authentication, scalability, and AI integration.
- For DSA questions, include time complexity, approach explanation, and edge cases.
- category must be one of: hr, dsa, mern, project, behavioral, mixed.
`;
};

export const buildAnswerEvaluationPrompt = ({
  question,
  expectedAnswerPoints,
  userAnswer,
}) => {
  return `
You are an expert interviewer evaluating a candidate's answer.

Question:
${question}

Expected Answer Points:
${expectedAnswerPoints?.length ? expectedAnswerPoints.join(", ") : "Not provided"}

Candidate Answer:
${userAnswer}

Evaluate the candidate answer.

Return response in this exact JSON format only.
Do not add markdown.
Do not add explanation outside JSON.

{
  "score": 7,
  "feedback": "string",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "idealAnswer": "string"
}

Rules:
- score must be from 0 to 10.
- Be strict but helpful.
- Feedback should be practical and interview-focused.
- Mention what was good and what was missing.
- idealAnswer should be concise but complete.
`;
};

export const buildInterviewSummaryPrompt = ({
  title,
  interviewType,
  questions,
}) => {
  const answerSummary = questions
    .map(
      (item, index) => `
Q${index + 1}: ${item.question}
Answer: ${item.userAnswer || "Not answered"}
Score: ${item.score}/10
Feedback: ${item.feedback || "No feedback"}
`
    )
    .join("\n");

  return `
You are an expert placement mentor.

Create final mock interview summary.

Interview:
- Title: ${title}
- Type: ${interviewType}

Candidate performance:
${answerSummary}

Return response in this exact JSON format only.
Do not add markdown.
Do not add explanation outside JSON.

{
  "overallFeedback": "string",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"]
}

Rules:
- Give final feedback useful for placement preparation.
- Identify repeated weaknesses.
- Mention communication, technical depth, examples, clarity, and confidence.
`;
};