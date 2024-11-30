import { PrData } from "@/types/github";

export const groupFilesByType = (files: PrData['files']) => {
  return files.reduce((acc, file) => {
    const extension = file.filename.split('.').pop() || 'other';
    if (!acc[extension]) {
      acc[extension] = [];
    }
    acc[extension].push(file);
    return acc;
  }, {} as Record<string, typeof files>);
};

export const generatePRContext = (prData: PrData, fileGroups: Record<string, any>) => {
  return `This PR "${prData.pr.title}" by ${prData.pr.user.login} modifies ${
    prData.pr.changed_files
  } files with ${prData.pr.additions} additions and ${
    prData.pr.deletions
  } deletions. The changes span across ${
    Object.keys(fileGroups).length
  } different file types, primarily affecting ${Object.keys(fileGroups)
    .slice(0, 3)
    .join(', ')} files. The PR has received ${prData.reviews.length} reviews and ${
    prData.comments.length
  } comments.`;
}; 