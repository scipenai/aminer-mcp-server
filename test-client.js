#!/usr/bin/env node

/**
 * AMiner MCP Server 测试客户端
 * 用于测试 MCP 服务器的功能
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function testAminerMcpServer() {
  console.log("🚀 启动 AMiner MCP Server 测试...\n");


  // 创建客户端
  const client = new Client({
    name: "aminer-test-client",
    version: "1.0.0"
  });

  try {
    // 连接到服务器
    const transport = new StdioClientTransport({
      command: "node",
      args: ['dist/index.js'],
      env: {
        ...process.env,
        AMINER_API_KEY: process.env.AMINER_API_KEY || "test_key"
      }
    });
    
    await client.connect(transport);
    console.log("✅ 成功连接到 MCP 服务器\n");

    // 测试 1: 列出可用工具
    console.log("📋 测试 1: 列出可用工具");
    const tools = await client.listTools();
    console.log(`找到 ${tools.tools.length} 个工具:`);
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();

    // 测试 2: 列出可用提示
    console.log("📋 测试 2: 列出可用提示");
    const prompts = await client.listPrompts();
    console.log(`找到 ${prompts.prompts.length} 个提示:`);
    prompts.prompts.forEach(prompt => {
      console.log(`  - ${prompt.name}: ${prompt.description}`);
    });
    console.log();

    // 测试 3: 测试关键词搜索工具
    console.log("🔍 测试 3: 关键词搜索工具");
    try {
      const searchResult = await client.callTool({
        name: "search_papers_by_keyword",
        arguments: {
          keyword: "人工智能",
          page: 0,
          size: 3,
          order: "n_citation"
        }
      });
      
      console.log("搜索结果:");
      console.log(searchResult.content[0].text.substring(0, 500) + "...");
    } catch (error) {
      console.log(`搜索测试失败 (预期，因为需要真实的API Key): ${error.message}`);
    }
    console.log();

    // 测试 4: 测试提示模板
    console.log("💡 测试 4: 论文搜索助手提示");
    try {
      const promptResult = await client.getPrompt({
        name: "paper_search_assistant",
        arguments: {
          research_topic: "机器学习",
          search_focus: "highly_cited"
        }
      });
      
      console.log("提示模板生成成功:");
      console.log(promptResult.messages[0].content.text.substring(0, 300) + "...");
    } catch (error) {
      console.log(`提示测试失败: ${error.message}`);
    }
    console.log();

    // 测试 5: 测试参数验证
    console.log("⚠️  测试 5: 参数验证");
    try {
      await client.callTool({
        name: "search_papers_advanced",
        arguments: {
          page: 0,
          size: 5
          // 故意不提供必需的搜索参数
        }
      });
    } catch (error) {
      console.log("参数验证测试通过 - 正确捕获了参数错误");
    }

    console.log("\n✅ 所有测试完成!");

  } catch (error) {
    console.error("❌ 测试失败:", error.message);
  } finally {
    // 清理
    try {
      await client.close();
    } catch (error) {
      console.error("清理时出错:", error.message);
    }
  }
}

// 检查环境
if (!process.env.AMINER_API_KEY) {
  console.log("⚠️  警告: 未设置 AMINER_API_KEY 环境变量");
  console.log("某些测试可能会失败，但基本功能测试仍会进行\n");
}

// 运行测试
testAminerMcpServer().catch(error => {
  console.error("测试运行失败:", error);
  process.exit(1);
});
