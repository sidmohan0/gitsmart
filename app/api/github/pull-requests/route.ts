import { NextRequest, NextResponse } from 'next/server';
import { fetchPRData } from '@/lib/api/github';
import { ApiResponse } from '@/types/api';
import { PrData } from '@/types/github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');
  const pull_number = searchParams.get('pull_number');

  if (!owner || !repo || !pull_number) {
    return NextResponse.json({
      error: 'Missing required parameters',
      status: 400
    } as ApiResponse);
  }

  try {
    const prData = await fetchPRData(owner, repo, parseInt(pull_number));
    return NextResponse.json({
      data: prData,
      status: 200
    } as ApiResponse<PrData>);
  } catch (error) {
    console.error('Error fetching PR data:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to fetch PR data',
      status: 500
    } as ApiResponse);
  }
}