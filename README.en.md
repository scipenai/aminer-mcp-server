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

## 🚀 Quick Start

### 1. Installation

```bash
git clone <repository-url>
cd aminer-mcp
pnpm install
```

### 2. Configuration

Set your AMiner API Key:

```bash
export AMINER_API_KEY="your_aminer_api_key_here"
```

### 3. Build and Run

```bash
# Build the project
pnpm run build

# Start the server (traditional way)
pnpm start

# Start with npx (recommended)
npx -y aminer-mcp-server

# Or use the npm script
pnpm run start:npx
```

### 4. Development Mode

```bash
pnpm run dev
```

### 5. NPX Usage (Recommended)

After building the project, you can use npx to start the server directly:

```bash
# Make sure the project is built first
pnpm run build

# Start with npx (no need to install globally)
npx -y aminer-mcp-server

# Or use it in MCP client configurations
# The npx command will automatically use the correct package
```

**Benefits of using npx:**
- ✅ No need for global installation
- ✅ Always uses the correct version
- ✅ Cleaner command line interface
- ✅ Better integration with MCP clients

## 🔧 MCP Client Configuration

Add to your MCP client configuration file:

```json
{
  "mcpServers": {
    "aminer": {
      "command": "npx",
      "args": ["-y", "aminer-mcp-server"],
      "env": {
        "npm_config_registry": "YOUR_NPM_REGISTRY", 
        "AMINER_API_KEY": "YOUR_AMINER_API_KEY"
      }
    }
  }
}
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
- `pnpm run dev` - Development mode
- `pnpm run lint` - Code linting
- `pnpm test` - Run tests
- `pnpm run setup` - Install and build

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Model Context Protocol SDK
- **Package Manager**: pnpm
- **API**: AMiner Open Platform API
- **Protocol**: JSON-RPC 2.0 (MCP)

## 🔍 Error Handling

The server handles various error conditions:

- Missing or invalid API Key
- Network connection issues
- API rate limiting (40306)
- Parameter validation errors
- Server internal errors

All error messages are returned in English with clear descriptions.

## ❓ FAQ

### How to get AMiner API Key?
Visit the [AMiner Open Platform console](https://www.aminer.cn/), register an account, and obtain your API Key.

### Why are search results empty?
Check the following:
1. API Key is correctly configured
2. Network connection is stable
3. Search keywords are appropriate
4. API rate limits are not exceeded

### How to debug the server?
Use development mode:
```bash
pnpm run dev
```

### What sorting options are supported?
- `year`: Sort by publication year
- `n_citation`: Sort by citation count
- Default: Comprehensive sorting

## 🚀 Performance Tips

1. **Reasonable page size**: Recommend no more than 10 records per page
2. **Use caching**: Consider client-side caching for popular queries
3. **Error retry**: Implement exponential backoff retry mechanism
4. **Monitor rate limits**: Pay attention to API call frequency limits

## 🔮 Future Enhancements

Potential features to consider:
- Paper detail retrieval
- Author information queries
- Citation relationship analysis
- Research trend analysis
- Journal impact factor queries

## 📄 License

MIT License

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📞 Support

For questions and support:
1. Check [AMiner API documentation](https://www.aminer.cn/open/docs)
2. Review [Model Context Protocol specification](https://modelcontextprotocol.io/docs/getting-started/intro)
3. Visit project Issues page
