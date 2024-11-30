'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AssignedReposTable from "@/components/features/repo-list/AssignedReposTable";
import { PrData } from "@/types/github";
import PROverview from "@/components/features/pr-review/PROverview";
import PRCommits from "@/components/features/pr-review/PRCommits";
import PRFiles from "@/components/features/pr-review/PRFiles";
import PRReviews from "@/components/features/pr-review/PRReviews";
import { validateGithubPrUrl, extractPrInfo } from "@/lib/github/validation";
import { groupFilesByType, generatePRContext } from "@/lib/github/transform";
import { apiFetch } from "@/lib/api/api";
import { AnalysisResponse, ApiResponse } from "@/types/api";
import { API_ENDPOINTS } from "@/lib/api/api";
import PRSummaryCard from "@/components/features/pr-review/PRSummaryCard";





export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const [url, setUrl] = useState<string>('');
  const [prData, setPrData] = useState<PrData | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prSummary, setPrSummary] = useState<{summary: string, fileGroups: Record<string, any>}>(); 
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleGitHubLogin = async () => {
    const response = await fetch('/api/auth/github');
    const { authUrl } = await response.json();
    window.location.href = authUrl;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPrData(null);
    setAiAnalysis(null);
    
    if (!validateGithubPrUrl(url)) {
      setError('Please enter a valid GitHub PR URL');
      return;
    }

    setIsLoading(true);
    try {
      const { owner, repo, pull_number } = extractPrInfo(url);
      const data = await apiFetch<PrData>({
        url: API_ENDPOINTS.PR_DATA(owner, repo, pull_number)
      });
      setPrData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (prData) {
      const fileGroups = groupFilesByType(prData.files);
      const prContext = generatePRContext(prData, fileGroups);
      
      setIsAnalyzing(true);
      apiFetch<AnalysisResponse>({
        url: API_ENDPOINTS.PR_ANALYSIS,
        method: 'POST',
        body: { prContext }
      })
        .then(data => {
          console.log('AI Analysis Response:', data);
          setAiAnalysis(data.analysis);
        })
        .catch(error => {
          console.error('AI Analysis Error:', error);
          setError('Failed to generate AI analysis');
        })
        .finally(() => setIsAnalyzing(false));

      setPrSummary({ summary: prContext, fileGroups });
    }
  }, [prData]);

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">GitSmart</h1>
        {/* <h2 className="text-xl font-bold mb-4">Assigned Repositories</h2> */}
        <AssignedReposTable />
        <h2 className="text-xl font-bold mb-4">Fetch PR</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Enter GitHub PR URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Fetch PR'}
          </Button>
        </form>

        {error && (
          <div className="p-4 mb-8 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {prData && prSummary && (
          <div className="mb-8">
            <PRSummaryCard 
              summary={prSummary.summary}
              fileGroups={prSummary.fileGroups}
              initialAnalysis={aiAnalysis || ''}
            />
          </div>
        )}

        {prData && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="commits">Commits</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <PROverview prData={prData} />
            </TabsContent>

            <TabsContent value="commits">
              <PRCommits commits={prData.commits} />
            </TabsContent>

            <TabsContent value="files">
              <PRFiles files={prData.files} />
            </TabsContent>

            <TabsContent value="reviews">
              <PRReviews reviews={prData.reviews} comments={prData.comments} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}