import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrData } from "@/types/github";

interface PRCommitsProps {
  commits: PrData['commits'];
}

export default function PRCommits({ commits }: PRCommitsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commits</CardTitle>
        <CardDescription>{commits.length} commits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {commits.map((commit) => (
            <div key={commit.sha} className="border-b pb-4">
              <p className="font-medium">{commit.commit.message}</p>
              <p className="text-sm text-muted-foreground">
                {commit.commit.author.name} committed on {' '}
                {new Date(commit.commit.author.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
