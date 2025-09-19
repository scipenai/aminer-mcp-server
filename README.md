# AMiner MCP 服务器

> **语言 / Language:** [🇨🇳 中文](README.md) | [🇺🇸 English](README.en.md)

基于模型上下文协议（MCP）的服务器，通过 AMiner API 提供强大的学术论文搜索和分析功能。

## 🌟 功能特性

### 🔍 搜索工具
- **关键词搜索** (`search_papers_by_keyword`) - 通过关键词搜索论文
- **期刊搜索** (`search_papers_by_venue`) - 搜索特定期刊/会议的论文
- **作者搜索** (`search_papers_by_author`) - 搜索特定作者的论文
- **高级搜索** (`search_papers_advanced`) - 多条件组合搜索

### 🤖 AI 助手
- **论文搜索助手** (`paper_search_assistant`) - 学术研究辅助的 AI 提示模板

### ⚙️ 搜索选项
- 分页支持（页码、每页数量）
- 排序选项（按年份或引用数）
- 详细论文信息展示
- 专业学术格式的英文界面

## 🚀 快速开始

### 1. 安装

```bash
git clone <repository-url>
cd aminer-mcp
pnpm install
```

### 2. 配置

设置您的 AMiner API 密钥：

```bash
export AMINER_API_KEY="your_aminer_api_key_here"
```

### 3. 构建和运行

```bash
# 构建项目
pnpm run build

# 启动服务器（传统方式）
pnpm start

# 使用 npx 启动（推荐）
npx -y aminer-mcp-server

# 或使用 npm 脚本
pnpm run start:npx
```

### 4. 开发模式

```bash
pnpm run dev
```

### 5. NPX 使用方式（推荐）

构建项目后，您可以使用 npx 直接启动服务器：

```bash
# 确保项目已构建
pnpm run build

# 使用 npx 启动（无需全局安装）
npx -y aminer-mcp-server

# 或在 MCP 客户端配置中使用
# npx 命令会自动使用正确的包
```

**使用 npx 的优势：**
- ✅ 无需全局安装
- ✅ 始终使用正确版本
- ✅ 更清洁的命令行界面
- ✅ 与 MCP 客户端更好集成

## 🔧 MCP 客户端配置

添加到您的 MCP 客户端配置文件：

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

## 📚 工具参考

### search_papers_by_keyword

通过关键词搜索学术论文。

**参数：**
- `keyword` (字符串，必需): 搜索关键词
- `page` (数字，可选): 页码，默认 0
- `size` (数字，可选): 每页论文数，默认 10，最大 10
- `order` (字符串，可选): 排序方式：'year' 或 'n_citation'

**示例：**
```json
{
  "keyword": "深度学习",
  "page": 0,
  "size": 5,
  "order": "n_citation"
}
```

### search_papers_by_venue

搜索特定期刊/会议发表的论文。

**参数：**
- `venue` (字符串，必需): 期刊/会议名称
- `page` (数字，可选): 页码，默认 0
- `size` (数字，可选): 每页论文数，默认 10，最大 10
- `order` (字符串，可选): 排序方式：'year' 或 'n_citation'

**示例：**
```json
{
  "venue": "Nature",
  "page": 0,
  "size": 10,
  "order": "year"
}
```

### search_papers_by_author

搜索特定作者发表的论文。

**参数：**
- `author` (字符串，必需): 作者姓名
- `page` (数字，可选): 页码，默认 0
- `size` (数字，可选): 每页论文数，默认 10，最大 10
- `order` (字符串，可选): 排序方式：'year' 或 'n_citation'

**示例：**
```json
{
  "author": "Geoffrey Hinton",
  "page": 0,
  "size": 10
}
```

### search_papers_advanced

支持多条件的高级搜索。

**参数：**
- `keyword` (字符串，可选): 搜索关键词
- `venue` (字符串，可选): 期刊/会议名称
- `author` (字符串，可选): 作者姓名
- `page` (数字，可选): 页码，默认 0
- `size` (数字，可选): 每页论文数，默认 10，最大 10
- `order` (字符串，可选): 排序方式：'year' 或 'n_citation'

**注意：** 必须提供 keyword、venue 或 author 中的至少一个。

**示例：**
```json
{
  "keyword": "自然语言处理",
  "author": "Yann LeCun",
  "page": 0,
  "size": 5,
  "order": "n_citation"
}
```

## 🎯 提示模板

### paper_search_assistant

学术研究的 AI 助手提示模板。

**参数：**
- `research_topic` (字符串，必需): 研究主题或领域
- `search_focus` (字符串，可选): 搜索重点
  - `recent`: 关注最新论文
  - `highly_cited`: 关注高引用论文
  - `comprehensive`: 平衡搜索（默认）

**示例：**
```json
{
  "research_topic": "计算机视觉中的注意力机制",
  "search_focus": "highly_cited"
}
```

## 🛠️ 开发

### 项目结构

```
src/
├── index.ts          # 主服务器文件
├── aminer-client.ts  # AMiner API 客户端
└── types.ts          # 类型定义
```

### 可用脚本

- `pnpm run build` - 构建项目
- `pnpm run dev` - 开发模式
- `pnpm run lint` - 代码检查
- `pnpm test` - 运行测试
- `pnpm run setup` - 安装和构建

### 技术栈

- **运行时**: Node.js 18+
- **语言**: TypeScript
- **框架**: Model Context Protocol SDK
- **包管理器**: pnpm
- **API**: AMiner 开放平台 API
- **协议**: JSON-RPC 2.0 (MCP)

## 🔍 错误处理

服务器处理各种错误情况：

- 缺失或无效的 API 密钥
- 网络连接问题
- API 频率限制（40306）
- 参数验证错误
- 服务器内部错误

所有错误消息均以英文返回，并提供清晰的描述。

## ❓ 常见问题

### 如何获取 AMiner API 密钥？
访问 [AMiner 开放平台控制台](https://www.aminer.cn/)，注册账户并获取您的 API 密钥。

### 为什么搜索结果为空？
请检查以下内容：
1. API 密钥配置正确
2. 网络连接稳定
3. 搜索关键词合适
4. 未超出 API 频率限制

### 如何调试服务器？
使用开发模式：
```bash
pnpm run dev
```

### 支持哪些排序选项？
- `year`: 按发表年份排序
- `n_citation`: 按引用数排序
- 默认: 综合排序

## 🚀 性能建议

1. **合理的页面大小**: 建议每页不超过 10 条记录
2. **使用缓存**: 考虑对热门查询进行客户端缓存
3. **错误重试**: 实现指数退避重试机制
4. **监控频率限制**: 注意 API 调用频率限制

## 🔮 未来增强

考虑的潜在功能：
- 论文详情检索
- 作者信息查询
- 引用关系分析
- 研究趋势分析
- 期刊影响因子查询

## 📄 许可证

MIT 许可证

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

## 📞 支持

如有问题和支持需求：
1. 查看 [AMiner API 文档](https://www.aminer.cn/open/docs)
2. 查阅 [模型上下文协议规范](https://modelcontextprotocol.io/docs/getting-started/intro)
3. 访问项目 Issues 页面