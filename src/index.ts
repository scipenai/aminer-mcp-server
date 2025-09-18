#!/usr/bin/env node

/**
 * AMiner MCP Server
 * Model Context Protocol server providing academic paper and journal search functionality
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { AminerClient } from "./aminer-client.js";
import { AminerConfig } from "./types.js";

// Get configuration from environment variables
const config: AminerConfig = {
  apiKey: process.env.AMINER_API_KEY || '',
  baseUrl: process.env.AMINER_BASE_URL || 'https://datacenter.aminer.cn/gateway/open_platform/api/paper/list/by/search/venue'
};

if (!config.apiKey) {
  console.error('Error: Please set AMINER_API_KEY environment variable');
  process.exit(1);
}

// Create AMiner client
const aminerClient = new AminerClient(config);

// Create MCP server
const server = new McpServer({
  name: "aminer-mcp-server",
  version: "1.0.0"
});

// Register tool: Search papers by keyword
server.registerTool(
  "search_papers_by_keyword",
  {
    title: "Search Papers by Keyword",
    description: "Search academic papers by keyword",
    inputSchema: {
      keyword: z.string().describe("Search keyword"),
      page: z.number().min(0).default(0).describe("Page number, starting from 0"),
      size: z.number().min(1).max(10).default(10).describe("Number of papers per page, maximum 10"),
      order: z.enum(["year", "n_citation"]).optional().describe("Sort order: year (by publication year) or n_citation (by citation count)")
    }
  },
  async ({ keyword, page, size, order }) => {
    try {
      const result = await aminerClient.searchByKeyword(keyword, page, size, order);
      const formattedResult = aminerClient.formatSearchResults(result);
      
      return {
        content: [{
          type: "text",
          text: formattedResult
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

// Register tool: Search papers by venue
server.registerTool(
  "search_papers_by_venue",
  {
    title: "Search Papers by Venue",
    description: "Search papers published in a specific venue/journal",
    inputSchema: {
      venue: z.string().describe("Venue/journal name"),
      page: z.number().min(0).default(0).describe("Page number, starting from 0"),
      size: z.number().min(1).max(10).default(10).describe("Number of papers per page, maximum 10"),
      order: z.enum(["year", "n_citation"]).optional().describe("Sort order: year (by publication year) or n_citation (by citation count)")
    }
  },
  async ({ venue, page, size, order }) => {
    try {
      const result = await aminerClient.searchByVenue(venue, page, size, order);
      const formattedResult = aminerClient.formatSearchResults(result);
      
      return {
        content: [{
          type: "text",
          text: formattedResult
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

// Register tool: Search papers by author
server.registerTool(
  "search_papers_by_author",
  {
    title: "Search Papers by Author",
    description: "Search papers published by a specific author",
    inputSchema: {
      author: z.string().describe("Author name"),
      page: z.number().min(0).default(0).describe("Page number, starting from 0"),
      size: z.number().min(1).max(10).default(10).describe("Number of papers per page, maximum 10"),
      order: z.enum(["year", "n_citation"]).optional().describe("Sort order: year (by publication year) or n_citation (by citation count)")
    }
  },
  async ({ author, page, size, order }) => {
    try {
      const result = await aminerClient.searchByAuthor(author, page, size, order);
      const formattedResult = aminerClient.formatSearchResults(result);
      
      return {
        content: [{
          type: "text",
          text: formattedResult
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

// Register tool: Advanced search (supports multiple parameters)
server.registerTool(
  "search_papers_advanced",
  {
    title: "Advanced Paper Search",
    description: "Advanced paper search functionality supporting multiple search criteria",
    inputSchema: {
      keyword: z.string().optional().describe("Search keyword"),
      venue: z.string().optional().describe("Venue/journal name"),
      author: z.string().optional().describe("Author name"),
      page: z.number().min(0).default(0).describe("Page number, starting from 0"),
      size: z.number().min(1).max(10).default(10).describe("Number of papers per page, maximum 10"),
      order: z.enum(["year", "n_citation"]).optional().describe("Sort order: year (by publication year) or n_citation (by citation count)")
    }
  },
  async ({ keyword, venue, author, page, size, order }) => {
    try {
      // Validate at least one search condition is provided
      if (!keyword && !venue && !author) {
        return {
          content: [{
            type: "text",
            text: "Error: At least one of keyword, venue, or author must be provided"
          }],
          isError: true
        };
      }

      const result = await aminerClient.searchPapers({
        keyword,
        venue,
        author,
        page,
        size,
        order
      });
      
      const formattedResult = aminerClient.formatSearchResults(result);
      
      return {
        content: [{
          type: "text",
          text: formattedResult
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        isError: true
      };
    }
  }
);

// Register prompt template: Paper search assistant
server.registerPrompt(
  "paper_search_assistant",
  {
    title: "Paper Search Assistant",
    description: "AI assistant prompt template to help users search and analyze academic papers",
    argsSchema: {
      research_topic: z.string().describe("Research topic or field"),
      search_focus: z.enum(["recent", "highly_cited", "comprehensive"]).optional().describe("Search focus: recent (latest papers), highly_cited (high citation papers), comprehensive (balanced)")
    }
  },
  ({ research_topic, search_focus }) => {
    let searchStrategy = "";
    let orderParam = "";
    
    const focus = search_focus || "comprehensive";
    switch (focus) {
      case "recent":
        searchStrategy = "Focus on recently published papers to understand the latest developments in the field";
        orderParam = "year";
        break;
      case "highly_cited":
        searchStrategy = "Focus on highly cited papers to understand important contributions and classic works in the field";
        orderParam = "n_citation";
        break;
      case "comprehensive":
        searchStrategy = "Conduct comprehensive search, balancing novelty and impact of papers";
        orderParam = "";
        break;
    }

    return {
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `You are a professional academic research assistant. The user wants to learn about the research topic "${research_topic}".

Please help the user:
1. ${searchStrategy}
2. Use AMiner search tools to find relevant papers
3. Analyze search results and provide valuable insights
4. Recommend important papers and authors
5. Summarize the current research status and development trends in this field

Search suggestions:
- Use keyword search: search_papers_by_keyword
- If you know important venues, use: search_papers_by_venue  
- If you know important authors, use: search_papers_by_author
- Sorting parameter suggestion: ${orderParam ? `order="${orderParam}"` : "use default comprehensive sorting"}

Please start searching and analyzing relevant papers.`
        }
      }]
    };
  }
);

// Start server
async function main() {
  console.error("AMiner MCP Server is starting...");
  console.error(`API Key: ${config.apiKey ? 'Configured' : 'Not configured'}`);
  console.error(`Base URL: ${config.baseUrl}`);
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("AMiner MCP Server started, waiting for connections...");
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled promise rejection:', reason);
  process.exit(1);
});

// Start server
main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
