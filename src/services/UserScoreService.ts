
import { UserScore, UserScoreInsight, GradingScale } from "@/models/StudyGroup";
import { v4 as uuidv4 } from "uuid";
import { aiService } from "./AIService";

// Default grading scale
const DEFAULT_GRADING_SCALE: GradingScale = {
  id: "default-scale",
  name: "Standard Grading Scale",
  scale: [
    { minPercentage: 90, maxPercentage: 100, grade: "A" },
    { minPercentage: 80, maxPercentage: 89.99, grade: "B" },
    { minPercentage: 70, maxPercentage: 79.99, grade: "C" },
    { minPercentage: 60, maxPercentage: 69.99, grade: "D" },
    { minPercentage: 0, maxPercentage: 59.99, grade: "F" },
  ],
  isDefault: true,
  createdBy: "system",
  createdAt: new Date().toISOString(),
};

// Mock data for user scores
const MOCK_USER_SCORES: UserScore[] = [
  {
    id: "score-1",
    userId: "current-user",
    userName: "John Doe",
    subjectId: "subj-1",
    subjectName: "Artificial Intelligence",
    score: 92,
    maxScore: 100,
    submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    gradePercentage: 92,
    letterGrade: "A",
    category: "quiz",
    title: "AI Ethics Quiz",
    description: "A quiz covering the ethical implications of AI",
    aiInsights: [
      {
        id: "insight-1",
        type: "strength",
        content: "Strong understanding of AI ethics principles.",
        suggestedActions: ["Continue exploring case studies in AI ethics"],
        resources: [
          {
            title: "AI Ethics: Global Perspectives",
            url: "https://example.com/ai-ethics",
            type: "article",
          },
        ],
      },
    ],
  },
];

let userScores = [...MOCK_USER_SCORES];
let gradingScales = [DEFAULT_GRADING_SCALE];

export const userScoreService = {
  getUserScores: (userId: string = "current-user") => {
    return Promise.resolve(userScores.filter(score => score.userId === userId));
  },

  getScoreById: (scoreId: string) => {
    const score = userScores.find(score => score.id === scoreId);
    return Promise.resolve(score ? { ...score } : null);
  },

  addUserScore: async (score: Omit<UserScore, "id" | "gradePercentage" | "letterGrade" | "submittedAt" | "aiInsights">) => {
    // Calculate grade percentage
    const gradePercentage = (score.score / score.maxScore) * 100;
    
    // Determine letter grade based on the default grading scale
    const letterGrade = gradingScales[0].scale.find(
      s => gradePercentage >= s.minPercentage && gradePercentage <= s.maxPercentage
    )?.grade || "N/A";
    
    const newScore: UserScore = {
      ...score,
      id: uuidv4(),
      submittedAt: new Date().toISOString(),
      gradePercentage,
      letterGrade,
      aiInsights: [],
    };
    
    // Generate AI insights
    const insights = await generateAIInsights(newScore);
    newScore.aiInsights = insights;
    
    userScores = [...userScores, newScore];
    return Promise.resolve({ ...newScore });
  },
  
  updateUserScore: (scoreId: string, updates: Partial<UserScore>) => {
    const scoreIndex = userScores.findIndex(score => score.id === scoreId);
    if (scoreIndex === -1) {
      return Promise.reject(new Error("Score not found"));
    }
    
    const updatedScore = {
      ...userScores[scoreIndex],
      ...updates,
    };
    
    userScores = userScores.map(score => 
      score.id === scoreId ? updatedScore : score
    );
    
    return Promise.resolve({ ...updatedScore });
  },
  
  deleteUserScore: (scoreId: string) => {
    const scoreIndex = userScores.findIndex(score => score.id === scoreId);
    if (scoreIndex === -1) {
      return Promise.reject(new Error("Score not found"));
    }
    
    userScores = userScores.filter(score => score.id !== scoreId);
    return Promise.resolve(true);
  },
  
  getGradingScales: () => {
    return Promise.resolve([...gradingScales]);
  },
  
  addGradingScale: (scale: Omit<GradingScale, "id" | "createdAt">) => {
    const newScale: GradingScale = {
      ...scale,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    gradingScales = [...gradingScales, newScale];
    return Promise.resolve({ ...newScale });
  },
};

// Function to generate AI insights for a score
const generateAIInsights = async (score: UserScore): Promise<UserScoreInsight[]> => {
  try {
    // In a real implementation, this would call the AI service
    // For now, we'll generate some mock insights
    const mockInsights: UserScoreInsight[] = [];
    
    // Generate a strength insight
    if (score.gradePercentage && score.gradePercentage >= 80) {
      mockInsights.push({
        id: uuidv4(),
        type: "strength",
        content: `You've shown excellent understanding of ${score.subjectName}, especially in this ${score.category}.`,
        suggestedActions: ["Consider mentoring other students in this subject"],
        resources: [
          {
            title: "Advanced topics in " + score.subjectName,
            url: "https://example.com/advanced-topics",
            type: "article",
          },
        ],
      });
    }
    
    // Generate a weakness insight
    if (score.gradePercentage && score.gradePercentage < 80) {
      mockInsights.push({
        id: uuidv4(),
        type: "weakness",
        content: `There's room for improvement in your understanding of ${score.subjectName}.`,
        suggestedActions: ["Review the core concepts", "Practice with additional exercises"],
        resources: [
          {
            title: "Core concepts in " + score.subjectName,
            url: "https://example.com/core-concepts",
            type: "article",
          },
        ],
      });
    }
    
    // Generate an improvement insight
    mockInsights.push({
      id: uuidv4(),
      type: "improvement",
      content: `To further enhance your performance in ${score.subjectName}, focus on consistent study patterns and active recall techniques.`,
      suggestedActions: ["Create a study schedule", "Use spaced repetition for review"],
      resources: [
        {
          title: "Effective study techniques",
          url: "https://example.com/study-techniques",
          type: "video",
        },
      ],
    });
    
    // Try to get an AI-generated insight if possible
    try {
      const promptTemplate = `
        Based on a student's performance in ${score.subjectName} (scoring ${score.gradePercentage}% on a ${score.category} titled "${score.title}"), 
        provide one specific insight about their performance and 2-3 actionable suggestions to improve.
        Format your response in a helpful, encouraging tone, focusing on growth mindset.
        Keep your response to 2-3 sentences for the insight and bullet points for suggestions.
      `;
      
      const aiResponse = await aiService.queryGemini(promptTemplate);
      
      if (aiResponse && typeof aiResponse === 'string' && aiResponse.length > 0) {
        // Parse AI response and add it as an insight
        mockInsights.push({
          id: uuidv4(),
          type: "improvement",
          content: aiResponse.split('\n')[0] || "AI generated insight",
          suggestedActions: aiResponse.split('\n').slice(1).map(line => line.replace(/^- /, '')),
        });
      }
    } catch (error) {
      console.error("Error generating AI insight:", error);
      // Continue with mock insights if AI fails
    }
    
    return mockInsights;
  } catch (error) {
    console.error("Error in generateAIInsights:", error);
    return [];
  }
};
