# AMiner MCP Server

> **Language / 语言:** [🇺🇸 English](README.en.md) | [🇨🇳 中文](README.md)

A Model Context Protocol (MCP) server providing powerful academic paper search and analysis functionality through the AMiner API.

## 🌟 Features

### 🔍 Search Tools
- **Keyword Search** (`search_papers_by_keyword`) - Search papers by keywords
- **Venue Search** (`search_papers_by_venue`) - Search papers from specific journals/venues
- **Author Search** (`search_papers_by_author`) - Search papers by specific authors
- **Advanced Search** (`search_papers_advanced`) - Multi-criteria combined search

### 🤖 AI Assistant
- **Paper Search Assistant** (`paper_search_assistant`) - AI prompt template for academic research assistance

### ⚙️ Search Options
- Pagination support (page, size)
- Sorting options (by year or citation count)
- Detailed paper information display
- English interface with professional academic formatting

## 🔧 MCP Client Configuration

Add to your MCP client configuration file:

```json
{
  "mcpServers": {
    "aminer": {
      "command": "npx",
      "args": ["-y", "@scipen/aminer-mcp-server"],
      "env": {
        "AMINER_API_KEY": "YOUR_AMINER_API_KEY"
      }
    }
  }
}
```

## 🚀 Manual Run

```bash
# Set your AMiner API key:
export AMINER_API_KEY="your_aminer_api_key_here"
# Start with npx
npx -y @scipen/aminer-mcp-server
```

## 📚 Tools Reference

### search_papers_by_keyword

Search academic papers by keyword.

**Parameters:**
- `keyword` (string, required): Search keyword
- `page` (number, optional): Page number, default 0
- `size` (number, optional): Papers per page, default 10, max 10
- `order` (string, optional): Sort order: 'year' or 'n_citation'

**Example:**
```json
{
  "keyword": "deep learning",
  "page": 0,
  "size": 5,
  "order": "n_citation"
}
```

### search_papers_by_venue

Search papers published in a specific venue/journal.

**Parameters:**
- `venue` (string, required): Venue/journal name
- `page` (number, optional): Page number, default 0
- `size` (number, optional): Papers per page, default 10, max 10
- `order` (string, optional): Sort order: 'year' or 'n_citation'

**Example:**
```json
{
  "venue": "Nature",
  "page": 0,
  "size": 10,
  "order": "year"
}
```

### search_papers_by_author

Search papers published by a specific author.

**Parameters:**
- `author` (string, required): Author name
- `page` (number, optional): Page number, default 0
- `size` (number, optional): Papers per page, default 10, max 10
- `order` (string, optional): Sort order: 'year' or 'n_citation'

**Example:**
```json
{
  "author": "Geoffrey Hinton",
  "page": 0,
  "size": 10
}
```

### search_papers_advanced

Advanced search supporting multiple criteria.

**Parameters:**
- `keyword` (string, optional): Search keyword
- `venue` (string, optional): Venue/journal name
- `author` (string, optional): Author name
- `page` (number, optional): Page number, default 0
- `size` (number, optional): Papers per page, default 10, max 10
- `order` (string, optional): Sort order: 'year' or 'n_citation'

**Note:** At least one of keyword, venue, or author must be provided.

**Example:**
```json
{
  "keyword": "natural language processing",
  "author": "Yann LeCun",
  "page": 0,
  "size": 5,
  "order": "n_citation"
}
```

## 🎯 Prompt Templates

### paper_search_assistant

AI assistant prompt template for academic research.

**Parameters:**
- `research_topic` (string, required): Research topic or field
- `search_focus` (string, optional): Search focus
  - `recent`: Focus on latest papers
  - `highly_cited`: Focus on highly cited papers
  - `comprehensive`: Balanced search (default)

**Example:**
```json
{
  "research_topic": "attention mechanisms in computer vision",
  "search_focus": "highly_cited"
}
```

## 🛠️ Development

### Project Structure

```
src/
├── index.ts          # Main server file
├── aminer-client.ts  # AMiner API client
└── types.ts          # Type definitions
```

### Available Scripts

- `pnpm run build` - Build the project
- `pnpm run start` - Start the server
- `pnpm run dev` - Development mode
- `pnpm run lint` - Code linting
- `pnpm test` - Run tests

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Model Context Protocol SDK
- **Package Manager**: pnpm
- **API**: AMiner Open Platform API
- **Protocol**: JSON-RPC 2.0 (MCP)

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📞 Support

For questions and support:
1. Check [AMiner API documentation](https://www.aminer.cn/open/docs)
2. Review [Model Context Protocol specification](https://modelcontextprotocol.io/docs/getting-started/intro)
3. Visit project Issues page
