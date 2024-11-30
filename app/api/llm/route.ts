// app/api/llm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { analyzePR } from '@/lib/api/openai';
import { ApiResponse, AnalysisRequest, AnalysisResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalysisRequest;
    console.log('Received request body:', body);
    
    if (!body.prContext) {
      return NextResponse.json({
        error: 'Missing PR context',
        status: 400
      } as ApiResponse);
    }

    const analysis = await analyzePR(body);
    console.log('Generated analysis:', analysis);
    
    return NextResponse.json({
      data: { analysis },
      status: 200
    } as ApiResponse<AnalysisResponse>);
  } catch (error) {
    console.error('LLM API Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to analyze PR',
      status: 500
    } as ApiResponse);
  }
}