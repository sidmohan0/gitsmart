import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const fetchPRData = async (owner: string, repo: string, pull_number: number) => {
  const [pr, commits, files, reviews, comments] = await Promise.all([
    octokit.pulls.get({ owner, repo, pull_number }),
    octokit.pulls.listCommits({ owner, repo, pull_number }),
    octokit.pulls.listFiles({ owner, repo, pull_number }),
    octokit.pulls.listReviews({ owner, repo, pull_number }),
    octokit.issues.listComments({ owner, repo, issue_number: pull_number })
  ]);

  return {
    pr: pr.data,
    commits: commits.data,
    files: files.data,
    reviews: reviews.data,
    comments: comments.data
  };
}; 