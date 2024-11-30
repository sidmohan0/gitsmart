export const validateGithubPrUrl = (url: string): boolean => {
  const regex = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+$/;
  return regex.test(url);
};

export const extractPrInfo = (url: string) => {
  const parts = url.split('/');
  return {
    owner: parts[3],
    repo: parts[4],
    pull_number: parseInt(parts[6])
  };
}; 