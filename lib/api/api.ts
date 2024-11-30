import { ApiResponse } from '@/types/api';

// Helper to handle API responses
export async function handleApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json() as ApiResponse<T>;
  
  if (!response.ok || data.error) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data.data as T;
}

// Type-safe fetch wrapper
export async function apiFetch<T>({
  url,
  method = 'GET',
  body,
  headers = {}
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  return handleApiResponse<T>(response);
}

// API endpoints constants
export const API_ENDPOINTS = {
  PR_DATA: (owner: string, repo: string, pull_number: number) => 
    `/api/github/pull-requests?owner=${owner}&repo=${repo}&pull_number=${pull_number}`,
  PR_ANALYSIS: '/api/llm'
} as const; 