# Environment Variables Setup for AIMM FinAI UI

## Required Environment Variables

Create a `.env` file in the root directory with the following variable:

```bash
# FinAI API Configuration
REACT_APP_FINAI_API_URL=http://localhost:4875
```

## How to Set Up

1. Copy the above content into a new file named `.env` in the project root directory
2. Modify the URL according to your environment:
   - `REACT_APP_FINAI_API_URL`: URL for the FinAI API service (default: http://localhost:4875)

## Usage

The environment variable is used in:
- `react_frontend_example.tsx` - Main React component for API communication

## Note

The `.env` file should be added to `.gitignore` to avoid committing sensitive configuration to version control. 