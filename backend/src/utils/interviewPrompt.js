export const buildInterviewQuestionsPrompt = ({
  fullName,
  targetRole,
  skills,
  interviewType,
  difficulty,
  questionCount,
  previousQuestions = [],
}) => {
  const avoidList =
    previousQuestions?.length
      ? previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")
      : "None";

  return `
You are a senior technical interviewer at a product-based company conducting a real
placement interview for an Indian engineering student.

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

Do NOT repeat or closely rephrase any of these previously asked questions:
${avoidList}

Difficulty calibration:
- easy: fundamentals, definitions, straightforward scenarios
- medium: applied reasoning, trade-offs, "why" questions, moderate DSA (O(n log n) range)
- hard: multi-part questions, system-level thinking, edge cases, optimization, follow-up-style depth

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
- Questions must be realistic for campus placements and product-based companies — avoid textbook-generic phrasing like "What is a stack?" unless difficulty is easy.
- Questions should match the candidate's skills and target role specifically, not generic fallback questions.
- For project questions, include architecture, database, APIs, authentication, scalability, and AI integration.
- For DSA questions, include time complexity, approach explanation, and edge cases as part of expectedAnswerPoints.
- For mixed type, distribute categories evenly across hr, dsa, mern, project, behavioral rather than clustering one category.
- expectedAnswerPoints must be specific and checkable — not vague phrases like "explain clearly."
- category must be one of: hr, dsa, mern, project, behavioral, mixed.
`;
};

export const buildAnswerEvaluationPrompt = ({
  question,
  expectedAnswerPoints,
  userAnswer,
}) => {
  return `
You are a strict, experienced technical interviewer evaluating a candidate's answer
in a real placement interview. Do not be encouraging just to be polite — this feedback
is used to help the candidate genuinely improve, so inflated scores are a disservice.

Question:
${question}

Expected Answer Points:
${expectedAnswerPoints?.length ? expectedAnswerPoints.join(", ") : "Not provided"}

Candidate Answer:
${userAnswer}

Evaluate the candidate's answer against the expected points above.

Scoring guide (be strict):
- 9-10: covers nearly all expected points with correct depth and clear structure
- 7-8: covers most points, minor gaps or slight lack of clarity
- 5-6: covers the basic idea but missing significant expected points or has inaccuracies
- 3-4: mostly vague, generic, or only tangentially relevant
- 0-2: incorrect, empty, off-topic, or refuses to answer the question asked

A confident-sounding but shallow answer must still score low if it misses expected points.
A short but technically precise answer can score high.

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
- score must be from 0 to 10, integer only.
- feedback must reference specifically what was present and what was missing from expectedAnswerPoints — not generic praise.
- strengths and improvements must each be non-empty even for a weak answer (e.g. "attempted the question" is not acceptable filler — find something concrete or state clearly if nothing was demonstrated).
- idealAnswer should be concise but complete, and should actually hit the expectedAnswerPoints.
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

  const averageScore =
    questions.length > 0
      ? (
          questions.reduce((sum, q) => sum + (q.score || 0), 0) /
          questions.length
        ).toFixed(1)
      : "0";

  return `
You are a senior placement mentor writing the final assessment for a mock interview.
Be honest and specific, like real interview feedback a mentor would give in a 1-on-1 —
not generic motivational text.

Interview:
- Title: ${title}
- Type: ${interviewType}
- Average Score: ${averageScore}/10

Candidate performance, question by question:
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
- overallFeedback must directly reference patterns seen across the answers above (e.g. repeated weak area, consistent strength) — do not write generic "keep practicing" filler.
- Identify repeated weaknesses across multiple questions, not just per-question issues.
- Mention communication, technical depth, examples, clarity, and confidence where relevant, but only if evidenced by the actual answers — do not invent observations not supported by the transcript.
- If the candidate scored consistently low (average below 4), overallFeedback should be direct about readiness gap, not softened.
- If the candidate scored consistently high (average above 8), still name at least one improvement area — no interview performance is flawless.
`;
};