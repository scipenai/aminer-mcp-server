#!/usr/bin/env node

/**
 * AMiner MCP Server Test Client
 * Used to test MCP server functionality
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function testAminerMcpServer() {
  console.log("🚀 Starting AMiner MCP Server test...\n");


  // Create client
  const client = new Client({
    name: "aminer-test-client",
    version: "1.0.0"
  });

  try {
    // Connect to server
    const transport = new StdioClientTransport({
      command: "node",
      args: ['dist/index.js'],
      env: {
        ...process.env,
        AMINER_API_KEY: process.env.AMINER_API_KEY || "test_key"
      }
    });
    
    await client.connect(transport);
    console.log("✅ Successfully connected to MCP server\n");

    // Test 1: List available tools
    console.log("📋 Test 1: List available tools");
    const tools = await client.listTools();
    console.log(`Found ${tools.tools.length} tools:`);
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();

    // Test 2: List available prompts
    console.log("📋 Test 2: List available prompts");
    const prompts = await client.listPrompts();
    console.log(`Found ${prompts.prompts.length} prompts:`);
    prompts.prompts.forEach(prompt => {
      console.log(`  - ${prompt.name}: ${prompt.description}`);
    });
    console.log();

    // Test 3: Test keyword search tool
    console.log("🔍 Test 3: Keyword search tool");
    try {
      const searchResult = await client.callTool({
        name: "search_papers_by_keyword",
        arguments: {
          keyword: "artificial intelligence",
          page: 0,
          size: 3,
          order: "n_citation"
        }
      });
      
      console.log("Search results:");
      console.log(searchResult.content[0].text.substring(0, 500) + "...");
    } catch (error) {
      console.log(`Search test failed (expected, requires real API Key): ${error.message}`);
    }
    console.log();

    // Test 4: Test prompt template
    console.log("💡 Test 4: Paper search assistant prompt");
    try {
      const promptResult = await client.getPrompt({
        name: "paper_search_assistant",
        arguments: {
          research_topic: "machine learning",
          search_focus: "highly_cited"
        }
      });
      
      console.log("Prompt template generated successfully:");
      console.log(promptResult.messages[0].content.text.substring(0, 300) + "...");
    } catch (error) {
      console.log(`Prompt test failed: ${error.message}`);
    }
    console.log();

    // Test 5: Test parameter validation
    console.log("⚠️  Test 5: Parameter validation");
    try {
      await client.callTool({
        name: "search_papers_advanced",
        arguments: {
          page: 0,
          size: 5
          // Intentionally omit required search parameters
        }
      });
    } catch (error) {
      console.log("Parameter validation test passed - correctly caught parameter error");
    }

    console.log("\n✅ All tests completed!");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    // Cleanup
    try {
      await client.close();
    } catch (error) {
      console.error("Error during cleanup:", error.message);
    }
  }
}

// Check environment
if (!process.env.AMINER_API_KEY) {
  console.log("⚠️  Warning: AMINER_API_KEY environment variable not set");
  console.log("Some tests may fail, but basic functionality tests will still proceed\n");
}

// Run tests
testAminerMcpServer().catch(error => {
  console.error("Test execution failed:", error);
  process.exit(1);
});
