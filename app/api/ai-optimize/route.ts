import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { type OptimizeSection, isOptimizeSection } from "@/lib/schema";

const DASHSCOPE_API_URL =
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

/** 上游超时保护：避免 AI 服务无响应时请求长期挂起，占用连接资源。 */
const UPSTREAM_TIMEOUT_MS = 30_000;

const sectionPrompts: Record<OptimizeSection, string> = {
  selfEvaluation: `你是一位资深HR和简历优化专家。请优化以下自我评价内容，使其更加专业、简洁和有说服力。要求：
1. 语言精练，避免空泛和套话
2. 突出个人核心竞争力
3. 尽量使用可量化的描述
4. 保持真实、不夸大
5. 保持原文的大致方向和含义
请直接返回优化后的内容，不要添加任何解释说明。`,

  workExperience: `你是一位资深HR和简历优化专家。请优化以下工作经历描述，使其更加专业和有冲击力。要求：
1. 使用STAR法则（情境-任务-行动-结果）来组织描述
2. 用动词开头描述工作内容
3. 尽量加入量化数据（如提升了XX%、管理了XX人）
4. 突出个人贡献和成果
5. 保持真实、不夸大
请直接返回优化后的内容，不要添加任何解释说明。`,

  internship: `你是一位资深HR和简历优化专家。请优化以下实习经历描述，使其更加专业。要求：
1. 使用动词开头描述工作内容      
2. 突出学习成长和实际贡献
3. 加入具体的技术或业务成果
4. 语言简洁有力
5. 保持真实、不夸大
请直接返回优化后的内容，不要添加任何解释说明。`,

  project: `你是一位资深HR和简历优化专家。请优化以下项目经历描述，使其更加突出技术深度和个人贡献。要求：
1. 清晰描述项目背景和你的角色
2. 突出技术选型和架构设计能力
3. 强调个人职责和解决的关键问题
4. 用数据量化项目成果
5. 保持真实、不夸大
请直接返回优化后的内容，不要添加任何解释说明。`,

  campusExperience: `你是一位资深HR和简历优化专家。请优化以下校园经历描述，使其更加突出领导力和组织能力。要求：
1. 突出组织协调和领导能力
2. 强调活动规模和影响力
3. 用数据量化成果
4. 语言简洁有力
5. 保持真实、不夸大
请直接返回优化后的内容，不要添加任何解释说明。`,

  fullResume: `你是一位资深HR和简历优化专家。请对以下简历内容进行整体分析和优化建议。请从以下维度给出具体建议：
1. **内容完整性**：是否缺少关键信息
2. **表达专业度**：用词是否专业、是否有错别字或语病
3. **量化程度**：是否有足够的数据支撑
4. **亮点突出**：个人核心竞争力是否清晰
5. **整体建议**：针对简历的3-5条具体改进建议

请用markdown格式返回分析报告。`,
};

export async function POST(request: NextRequest) {
  // 鉴权必须放在最前面：这是一个会产生真实调用费用的付费接口，
  // 任何未登录的裸请求都能触发上游消耗。
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const apiKey = process.env.ALIYUN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI服务未配置，请联系管理员" },
      { status: 500 },
    );
  }

  // 请求体来自客户端，不做信任假设：section 交给 isOptimizeSection 做运行时白名单校验。
  let body: { section: string; content: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const { section, content } = body;

  if (!section || !content?.trim()) {
    return NextResponse.json(
      { error: "缺少必要参数：section 和 content" },
      { status: 400 },
    );
  }

  const systemPrompt = isOptimizeSection(section) ? sectionPrompts[section] : undefined;
  if (!systemPrompt) {
    return NextResponse.json(
      { error: "不支持的优化类型" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DashScope API error:", response.status, errorText);
      return NextResponse.json(
        { error: "AI服务暂时不可用，请稍后重试" },
        { status: 502 },
      );
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    if (!result) {
      return NextResponse.json(
        { error: "AI未能生成有效结果，请重试" },
        { status: 500 },
      );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("AI optimize error:", error);
    return NextResponse.json(
      { error: "AI服务请求失败，请检查网络后重试" },
      { status: 500 },
    );
  }
}
