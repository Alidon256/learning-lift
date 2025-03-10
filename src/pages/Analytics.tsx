
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NavigationDrawer from "@/components/layout/NavigationDrawer";
import { 
  BarChart2, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Calendar as CalendarIcon,
  Download,
  Share2,
  Filter
} from "lucide-react";

// Mock data for analytics
const studyTimeData = [
  { name: 'Monday', hours: 2.5 },
  { name: 'Tuesday', hours: 3.2 },
  { name: 'Wednesday', hours: 1.8 },
  { name: 'Thursday', hours: 4.0 },
  { name: 'Friday', hours: 2.7 },
  { name: 'Saturday', hours: 1.5 },
  { name: 'Sunday', hours: 2.0 },
];

const subjectPerformanceData = [
  { name: 'Mathematics', score: 87 },
  { name: 'Physics', score: 76 },
  { name: 'Chemistry', score: 92 },
  { name: 'Biology', score: 83 },
  { name: 'History', score: 79 },
  { name: 'Literature', score: 88 },
];

const studyGroupActivityData = [
  { name: 'Group 1: Physics', sessions: 12, resources: 24, messages: 145 },
  { name: 'Group 2: Chemistry', sessions: 8, resources: 15, messages: 98 },
  { name: 'Group 3: Literature', sessions: 6, resources: 18, messages: 67 },
  { name: 'Group 4: Math Club', sessions: 10, resources: 31, messages: 203 },
];

const weeklyProgressData = [
  {
    name: 'Week 1',
    quizzes: 2,
    score: 75,
    study: 10,
  },
  {
    name: 'Week 2',
    quizzes: 3,
    score: 80,
    study: 12,
  },
  {
    name: 'Week 3',
    quizzes: 2,
    score: 78,
    study: 8,
  },
  {
    name: 'Week 4',
    quizzes: 4,
    score: 85,
    study: 15,
  },
  {
    name: 'Week 5',
    quizzes: 3,
    score: 88,
    study: 14,
  },
  {
    name: 'Week 6',
    quizzes: 5,
    score: 90,
    study: 18,
  },
];

const resourceUsageData = [
  { name: 'Textbooks', value: 35 },
  { name: 'Videos', value: 25 },
  { name: 'Notes', value: 20 },
  { name: 'Flashcards', value: 15 },
  { name: 'Quizzes', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [period, setPeriod] = useState('week');
  
  return (
    <>
      <NavigationDrawer />
      <div className="container max-w-7xl py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your study progress and performance across subjects</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="semester">This Semester</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" /> Subjects
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" /> Study Groups
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" /> Calendar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title="Study Hours" 
                value="18.5h" 
                description="This week" 
                change="+2.3h" 
                trend="up" 
              />
              <MetricCard 
                title="Resources Used" 
                value="24" 
                description="This week" 
                change="+8" 
                trend="up" 
              />
              <MetricCard 
                title="Quiz Score" 
                value="86%" 
                description="Average" 
                change="+3%" 
                trend="up" 
              />
              <MetricCard 
                title="Study Groups" 
                value="4" 
                description="Active" 
                change="0" 
                trend="neutral" 
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>
                    Your study time, quiz scores, and assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={weeklyProgressData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="quizzes" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="score" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                      <Area type="monotone" dataKey="study" stackId="3" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                  <CardDescription>
                    Distribution of learning resources used
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={resourceUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {resourceUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Your scores across different subjects</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={subjectPerformanceData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#8884d8" name="Performance Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Highest performance: Chemistry (92%)
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="groups" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Study Group Activity</CardTitle>
                <CardDescription>
                  Sessions, resources, and messages per group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={studyGroupActivityData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sessions" fill="#8884d8" name="Study Sessions" />
                    <Bar dataKey="resources" fill="#82ca9d" name="Shared Resources" />
                    <Bar dataKey="messages" fill="#ffc658" name="Chat Messages" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Most active: Group 4: Math Club
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Study Calendar</CardTitle>
                  <CardDescription>
                    View and manage your study schedule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Daily Study Time</CardTitle>
                  <CardDescription>
                    Hours spent studying by day of week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={studyTimeData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="hours" stroke="#8884d8" activeDot={{ r: 8 }} name="Study Hours" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Total study time this week: 17.7 hours
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

const MetricCard = ({ title, value, description, change, trend }: MetricCardProps) => {
  const trendColor = 
    trend === 'up' ? 'text-green-500' : 
    trend === 'down' ? 'text-red-500' : 
    'text-gray-500';
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
          {change !== '0' && (
            <span className={`ml-2 ${trendColor}`}>
              {change}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default Analytics;
