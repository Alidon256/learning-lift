
import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, BookOpen, TrendingUp, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { UserScore } from "@/models/StudyGroup";
import { userScoreService } from "@/services/UserScoreService";
import ScoreUploadForm from "./ScoreUploadForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PerformanceMetrics = () => {
  const [userScores, setUserScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserScores = async () => {
      try {
        const scores = await userScoreService.getUserScores();
        setUserScores(scores);
      } catch (error) {
        console.error("Error fetching user scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserScores();
  }, []);

  const handleScoreAdded = (score: UserScore) => {
    setUserScores(prev => [...prev, score]);
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 80) {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (percentage >= 60) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  // Group scores by subject
  const scoresBySubject = userScores.reduce((acc, score) => {
    if (!acc[score.subjectName]) {
      acc[score.subjectName] = [];
    }
    acc[score.subjectName].push(score);
    return acc;
  }, {} as Record<string, UserScore[]>);

  // Calculate overall performance for each subject
  const subjectPerformance = Object.entries(scoresBySubject).map(([name, scores]) => {
    const totalPercentage = scores.reduce((sum, score) => sum + (score.gradePercentage || 0), 0);
    const averagePercentage = totalPercentage / scores.length;
    
    // Determine grade based on average percentage
    let grade = 'N/A';
    if (averagePercentage >= 90) grade = 'A';
    else if (averagePercentage >= 80) grade = 'B+';
    else if (averagePercentage >= 75) grade = 'B';
    else if (averagePercentage >= 70) grade = 'B-';
    else if (averagePercentage >= 65) grade = 'C+';
    else if (averagePercentage >= 60) grade = 'C';
    else if (averagePercentage >= 55) grade = 'D+';
    else if (averagePercentage >= 50) grade = 'D';
    else grade = 'F';
    
    return {
      name,
      grade,
      progress: Math.round(averagePercentage),
      scores
    };
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Performance Metrics</h2>
        <ScoreUploadForm onScoreAdded={handleScoreAdded} />
      </div>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Score Details</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism animate-scale-in">
              <h3 className="text-lg font-medium mb-4">Recent Assessments</h3>
              <p className="text-sm text-muted-foreground mb-4">Last {Math.min(5, userScores.length)} assessments</p>
              
              <div className="space-y-4">
                {userScores.length === 0 ? (
                  <div className="text-center py-6">
                    <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No scores available yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Upload your first score to start tracking</p>
                  </div>
                ) : (
                  userScores
                    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                    .slice(0, 5)
                    .map((score, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{score.title}</span>
                          <p className="text-xs text-muted-foreground">{score.subjectName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{score.gradePercentage}%</span>
                          {score.gradePercentage && getStatusIcon(score.gradePercentage)}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism animate-scale-in">
              <h3 className="text-lg font-medium mb-4">Subject Performance</h3>
              <p className="text-sm text-muted-foreground mb-4">Current semester</p>
              
              <div className="space-y-6">
                {subjectPerformance.length === 0 ? (
                  <div className="text-center py-6">
                    <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No subject data available</p>
                    <p className="text-sm text-muted-foreground mt-1">Add scores to see your performance by subject</p>
                  </div>
                ) : (
                  subjectPerformance.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.name}</span>
                        <span className="font-medium">{subject.grade}</span>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{subject.scores.length} {subject.scores.length === 1 ? 'assessment' : 'assessments'}</span>
                        <span>{subject.progress}%</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">All Assessments</h3>
              <Badge variant="outline" className="font-normal">
                {userScores.length} {userScores.length === 1 ? 'result' : 'results'}
              </Badge>
            </div>
            
            {userScores.length === 0 ? (
              <div className="text-center py-10">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No assessment scores available yet</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Upload your scores to track your academic progress</p>
                <ScoreUploadForm onScoreAdded={handleScoreAdded} />
              </div>
            ) : (
              <div className="space-y-4">
                {userScores
                  .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                  .map((score) => (
                    <Card key={score.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {score.title}
                              <Badge variant={score.letterGrade === 'A' ? 'default' : score.letterGrade === 'F' ? 'destructive' : 'outline'}>
                                {score.letterGrade}
                              </Badge>
                            </CardTitle>
                            <CardDescription>{score.subjectName} - {score.category.charAt(0).toUpperCase() + score.category.slice(1)}</CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">{score.gradePercentage}%</p>
                            <p className="text-sm text-muted-foreground">{score.score}/{score.maxScore} points</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {score.description && (
                        <CardContent className="pb-2 pt-0">
                          <p className="text-sm">{score.description}</p>
                        </CardContent>
                      )}
                      
                      <CardFooter className="flex justify-between text-sm text-muted-foreground">
                        <span>Submitted on {new Date(score.submittedAt).toLocaleDateString()}</span>
                        
                        {score.aiInsights && score.aiInsights.length > 0 && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                <Info className="h-4 w-4" />
                                <span>AI Insights</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">AI-Powered Insights</h4>
                                <p className="text-sm">{score.aiInsights[0].content}</p>
                                
                                {score.aiInsights[0].suggestedActions && score.aiInsights[0].suggestedActions.length > 0 && (
                                  <div className="mt-2">
                                    <h5 className="text-sm font-medium">Suggestions:</h5>
                                    <ul className="list-disc list-inside text-sm">
                                      {score.aiInsights[0].suggestedActions.map((action, i) => (
                                        <li key={i}>{action}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism">
            <h3 className="text-lg font-medium mb-4">AI-Powered Performance Insights</h3>
            
            {userScores.length === 0 ? (
              <div className="text-center py-10">
                <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No insights available yet</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Upload your scores to get personalized AI insights</p>
                <ScoreUploadForm onScoreAdded={handleScoreAdded} />
              </div>
            ) : (
              <div className="space-y-6">
                {userScores
                  .filter(score => score.aiInsights && score.aiInsights.length > 0)
                  .map((score) => (
                    <Card key={score.id} className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-base">{score.title} ({score.subjectName})</CardTitle>
                        <CardDescription>{score.gradePercentage}% - Grade {score.letterGrade}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {score.aiInsights?.map((insight, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-start gap-2">
                              {insight.type === 'strength' ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                              ) : insight.type === 'weakness' ? (
                                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                              ) : (
                                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                              )}
                              <div>
                                <h4 className="font-medium capitalize">{insight.type}</h4>
                                <p className="text-sm">{insight.content}</p>
                                
                                {insight.suggestedActions && insight.suggestedActions.length > 0 && (
                                  <div className="mt-2">
                                    <h5 className="text-sm font-medium">Actions to Consider:</h5>
                                    <ul className="list-disc list-inside text-sm pl-1 space-y-1 mt-1">
                                      {insight.suggestedActions.map((action, i) => (
                                        <li key={i}>{action}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {insight.resources && insight.resources.length > 0 && (
                                  <div className="mt-3">
                                    <h5 className="text-sm font-medium">Recommended Resources:</h5>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                      {insight.resources.map((resource, i) => (
                                        <a 
                                          key={i}
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
                                        >
                                          {resource.type === 'article' ? (
                                            <BookOpen className="h-3 w-3" />
                                          ) : (
                                            <Info className="h-3 w-3" />
                                          )}
                                          {resource.title}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMetrics;
