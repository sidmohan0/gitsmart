import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GitPullRequest, GitFork, Timer, Copy, Check } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface PullRequest {
  number: number;
  title: string;
  html_url: string;
}

interface Repository {
  name: string;
  full_name: string;
  open_prs: number;
  updated_at: string;
  html_url: string;
  pull_requests: PullRequest[];
}

const AssignedReposTable = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = async (url: string, prId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedStates(prev => ({ ...prev, [prId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [prId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    const fetchAssignedRepos = async () => {
      try {
        const response = await fetch('/api/github/assigned-repos');
        if (!response.ok) {
          throw new Error('Failed to fetch assigned repositories');
        }
        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedRepos();
  }, []);

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading repositories...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <GitFork className="w-5 h-5" />
          Assigned Repositories
        </CardTitle>
        <CardDescription>Repositories where you have pending reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repository</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4" />
                  Open PRs
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Last Updated
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repos.map((repo) => (
              <TableRow key={repo.full_name}>
                <TableCell>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {repo.full_name}
                  </a>
                </TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" className="p-0 h-auto font-normal hover:bg-transparent">
                        {repo.open_prs}
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Open Pull Requests</h4>
                        <div className="space-y-2">
                          {repo.pull_requests?.map((pr) => (
                            <div key={pr.number} className="flex items-center justify-between gap-2">
                              <a
                                href={pr.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline truncate flex-1"
                              >
                                #{pr.number} {pr.title}
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleCopy(pr.html_url, `${repo.full_name}-${pr.number}`)}
                              >
                                {copiedStates[`${repo.full_name}-${pr.number}`] ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  {new Date(repo.updated_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AssignedReposTable;