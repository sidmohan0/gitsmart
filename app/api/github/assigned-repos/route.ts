import { Octokit } from "octokit";
import { NextResponse } from 'next/server';

export async function GET() {
  if (!process.env.GITHUB_TOKEN) {
    console.error('GITHUB_TOKEN is not set');
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    );
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  try {
    const assignedIssues = await octokit.rest.issues.list({
      filter: 'assigned', 
      state: 'open'
    }).catch(err => {
      console.error('Issues fetch error:', err.response?.data || err);
      throw err;
    });

    if (!assignedIssues.data) {
      throw new Error('Invalid issues response format');
    }

    const uniqueRepos = new Map();
    
    for (const issue of assignedIssues.data) {
      if (!issue.repository) continue;
      
      const repoFullName = issue.repository.full_name;
      if (!uniqueRepos.has(repoFullName)) {
        uniqueRepos.set(repoFullName, {
          name: issue.repository.name,
          full_name: repoFullName,
          open_prs: 0,
          updated_at: issue.repository.updated_at,
          html_url: issue.repository.html_url,
          pull_requests: []
        });
      }
    }

    // Get PRs for each repository
    await Promise.all(
      Array.from(uniqueRepos.values()).map(async (repo) => {
        const [owner, name] = repo.full_name.split('/');
        const prs = await octokit.rest.pulls.list({
          owner,
          repo: name,
          state: 'open'
        }).catch(err => {
          console.error(`PR fetch error for ${repo.full_name}:`, err.response?.data || err);
          throw err;
        });

        if (!prs.data) {
          throw new Error(`Invalid PR response format for ${repo.full_name}`);
        }
        
        repo.pull_requests = prs.data.map(pr => ({
          number: pr.number,
          title: pr.title,
          html_url: pr.html_url
        }));
        repo.open_prs = prs.data.length;
      })
    );

    return NextResponse.json(Array.from(uniqueRepos.values()));
  } catch (error: any) {
    console.error('GitHub API Error:', {
      status: error.status,
      message: error.message,
      response: error.response?.data,
      headers: error.response?.headers
    });

    if (error.status === 401) {
      return NextResponse.json(
        { error: 'GitHub authentication failed. Check your token.' },
        { status: 401 }
      );
    }
    if (error.status === 403) {
      return NextResponse.json(
        { error: 'Rate limit exceeded or token permissions issue' },
        { status: 403 }
      );
    }
    if (error.status === 404) {
      return NextResponse.json(
        { error: 'Repository not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch assigned repositories' },
      { status: error.status || 500 }
    );
  }
}