# GitSmart
<p align="center">
  <img src="public/logo.png" alt="GitSmart Logo" width="200">
</p>

GitSmart is an AI-powered GitHub PR review assistant that helps you analyze and understand pull requests more effectively.

<p align="center">
  <a href="https://youtu.be/lgWR2QTmFzA">
    <img src="https://img.youtube.com/vi/lgWR2QTmFzA/maxresdefault.jpg" alt="GitSmart Demo Video" width="600">
  </a>
</p>

## Features

- 🔍 Instant PR analysis with AI-generated insights
- 💬 Interactive chat interface for asking follow-up questions
- 📊 Visual breakdown of file changes by type
- 📝 Comprehensive PR overview with commits, files, and reviews
- 🤖 LLM support for analysis and responses

## Prerequisites

Before you begin, you'll need:

1. A GitHub Personal Access Token (Classic) with the following permissions:
   - `repo` (Full control of private repositories)
   - `read:user` (Read access to user profile data)
   - `user:email` (Access to user email addresses)

2. An OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/sidmohan0/GitSmart.git
cd GitSmart
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your API keys:
```env
GITHUB_TOKEN=your_github_personal_access_token
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser

## How to Use

1. Navigate to the application
2. Paste a GitHub PR URL in the format: `https://github.com/owner/repo/pull/number`
3. Click "Fetch PR" to analyze
4. Review the AI-generated analysis
5. Ask follow-up questions using the chat interface
6. Explore different tabs for detailed PR information:
   - Overview: Basic PR information
   - Commits: List of commits
   - Files: Changed files
   - Reviews: PR reviews and comments

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub Personal Access Token |
| `OPENAI_API_KEY` | OpenAI API Key |

## Getting API Keys

### GitHub Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Click "Generate new token (classic)"
3. Select the required permissions:
   - `repo`
   - `read:user`
   - `user:email`
4. Copy the generated token

### OpenAI API Key
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (it will only be shown once)


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
