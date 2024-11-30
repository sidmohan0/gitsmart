// Common API response structure
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// GitHub API specific types
export interface GitHubApiConfig {
  owner: string;
  repo: string;
  pull_number: number;
}

// OpenAI API specific types
export interface AnalysisRequest {
  prContext: string;
  conversation?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface AnalysisResponse {
  analysis: string;
}
