import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrData } from "@/types/github";

interface PROverviewProps {
  prData: PrData;
}

export default function PROverview({ prData }: PROverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{prData.pr.title}</CardTitle>
        <CardDescription>PR #{prData.pr.number}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="capitalize">{prData.pr.state}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Author</p>
            <p>{prData.pr.user?.login}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Created</p>
            <p>{new Date(prData.pr.created_at).toLocaleDateString()}</p>
          </div>
          {prData.pr.merged_at && (
            <div>
              <p className="text-sm font-medium">Merged</p>
              <p>{new Date(prData.pr.merged_at).toLocaleDateString()}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium">Changes</p>
            <p>+{prData.pr.additions} -{prData.pr.deletions} in {prData.pr.changed_files} files</p>
          </div>
          <div>
            <p className="text-sm font-medium">Branches</p>
            <p>{prData.pr.head.ref} → {prData.pr.base.ref}</p>
          </div>
        </div>
        {prData.pr.body && (
          <div>
            <p className="text-sm font-medium mb-2">Description</p>
            <p className="whitespace-pre-wrap">{prData.pr.body}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
