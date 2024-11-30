export interface PrData {
  pr: {
    title: string;
    number: number;
    state: string;
    user: {
      login: string;
    };
    created_at: string;
    merged_at?: string;
    additions: number;
    deletions: number;
    changed_files: number;
    head: {
      ref: string;
    };
    base: {
      ref: string;
    };
    body?: string;
  };
  commits: Array<{
    sha: string;
    commit: {
      message: string;
      author: {
        name: string;
        date: string;
      };
    };
  }>;
  files: Array<{
    filename: string;
    status: string;
    additions: number;
    deletions: number;
  }>;
  reviews: Array<{
    user: {
      login: string;
    };
    state: string;
    body?: string;
  }>;
  comments: Array<{
    user: {
      login: string;
    };
    created_at: string;
    body: string;
  }>;
}