import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrData } from "@/types/github";

interface PRFilesProps {
  files: PrData['files'];
}

export default function PRFiles({ files }: PRFilesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Changed Files</CardTitle>
        <CardDescription>{files.length} files changed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.filename} className="border-b pb-4">
              <p className="font-medium">{file.filename}</p>
              <p className="text-sm">
                <span className="capitalize">{file.status}</span> ·{' '}
                <span className="text-green-600">+{file.additions}</span>{' '}
                <span className="text-red-600">-{file.deletions}</span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
