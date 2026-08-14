const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-v4-flash';

const SYSTEM_PROMPT = `你是一个任务拆解助手。用户会给你一句话描述一个任务，请将其拆解为 3-7 个具体的子任务（步骤）。

要求：
1. 每个子任务简短清晰，一句话描述
2. 按照执行的先后顺序排列
3. 子任务要具体可执行，不要过于笼统
4. 只返回 JSON 字符串数组，不要包含任何其他文字
5. 使用中文

示例输出格式：["子任务1", "子任务2", "子任务3"]`;

export class DecomposeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DecomposeError';
  }
}

export async function decomposeTask(description: string): Promise<string[]> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

  if (!apiKey || apiKey === 'sk-your-api-key-here') {
    throw new DecomposeError('请先配置 DeepSeek API Key（编辑项目根目录下的 .env 文件）');
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: description },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new DecomposeError(`API 请求失败 (${response.status})：${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new DecomposeError('AI 返回内容为空，请重试');
  }

  // 解析 JSON 数组
  let parsed: unknown;
  try {
    // 尝试提取 JSON 数组（处理模型可能在前后加了说明文字的情况）
    const match = content.match(/\[[\s\S]*\]/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      parsed = JSON.parse(content);
    }
  } catch {
    throw new DecomposeError('AI 返回格式无法解析，请重试');
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new DecomposeError('AI 未返回有效的子任务列表，请重试');
  }

  return parsed.map(item => String(item).trim()).filter(s => s.length > 0);
}
