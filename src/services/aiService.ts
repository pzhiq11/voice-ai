import { AIProvider, ChatMessage } from "../types";

interface AIServiceOptions {
  provider: AIProvider;
  apiKey?: string;
}

/**
 * AI服务类
 */
class AIService {
  private provider: AIProvider;
  private apiKey: string | undefined;
  private controller: AbortController | null = null;

  constructor({ provider, apiKey }: AIServiceOptions) {
    this.provider = provider;
    this.apiKey = apiKey;
  }

  /**
   * 发送聊天消息
   */
  async sendMessage(messages: ChatMessage[]): Promise<string> {
    if (this.controller) {
      this.controller.abort();
    }

    this.controller = new AbortController();

    try {
      console.log(
        `发送消息到 ${this.provider}，API密钥: ${
          this.apiKey ? "已设置" : "未设置"
        }`
      );
      console.log("消息内容:", messages);

      let response;
      switch (this.provider) {
        case "openai":
          response = await this.sendOpenAIMessage(messages);
          break;
        case "gemini":
          response = await this.sendGeminiMessage(messages);
          break;
        default:
          throw new Error(`不支持的AI提供者: ${this.provider}`);
      }

      console.log("收到响应:", response);
      return response;
    } catch (error) {
      console.error("AI服务错误:", error);
      throw error;
    } finally {
      this.controller = null;
    }
  }

  /**
   * 中止当前请求
   */
  abortRequest() {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  /**
   * 发送OpenAI消息
   */
  private async sendOpenAIMessage(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error("缺少OpenAI API密钥");
    }

    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      console.log(
        "OpenAI请求体:",
        JSON.stringify({
          model: "gpt-4o",
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1000,
          stream: false,
        })
      );

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: formattedMessages,
            temperature: 0.7,
            max_tokens: 1000,
            stream: false,
          }),
          signal: this.controller?.signal,
        }
      );

      const responseData = await response.json();
      console.log("OpenAI响应状态:", response.status, response.statusText);
      console.log("OpenAI响应数据:", responseData);

      if (!response.ok) {
        throw new Error(
          `OpenAI API错误: ${
            responseData.error?.message || response.statusText
          }`
        );
      }

      return responseData.choices[0].message.content;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("请求已中止");
      }
      console.error("OpenAI请求错误:", error);
      throw error;
    }
  }

  /**
   * 发送Gemini消息
   */
  private async sendGeminiMessage(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error("缺少Gemini API密钥");
    }

    // 格式化消息为Gemini API需要的格式
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    try {
      const requestBody = {
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      };

      console.log(
        "Gemini请求URL:",
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey.substring(
          0,
          3
        )}...`
      );
      console.log("Gemini请求体:", JSON.stringify(requestBody));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: this.controller?.signal,
        }
      );

      console.log("Gemini响应状态:", response.status, response.statusText);

      const responseText = await response.text();
      console.log("Gemini原始响应:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("解析Gemini响应失败:", e);
        throw new Error(`Gemini响应解析错误: ${responseText}`);
      }

      console.log("Gemini响应数据:", responseData);

      if (!response.ok) {
        throw new Error(
          `Gemini API错误: ${
            responseData.error?.message || response.statusText
          }`
        );
      }

      if (!responseData.candidates || responseData.candidates.length === 0) {
        throw new Error("Gemini API返回了空结果");
      }

      return responseData.candidates[0].content.parts[0].text;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("请求已中止");
      }
      console.error("Gemini请求错误:", error);
      throw error;
    }
  }

  /**
   * 切换AI提供者
   */
  setProvider(provider: AIProvider) {
    this.provider = provider;
  }

  /**
   * 设置API密钥
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * 获取当前AI提供者
   */
  getProvider(): AIProvider {
    return this.provider;
  }
}

// 创建默认实例
const defaultProvider =
  (process.env.REACT_APP_DEFAULT_AI_PROVIDER as AIProvider) || "gemini";
const defaultApiKey =
  defaultProvider === "openai"
    ? process.env.REACT_APP_OPENAI_API_KEY
    : process.env.REACT_APP_GEMINI_API_KEY;

const aiService = new AIService({
  provider: defaultProvider,
  apiKey: defaultApiKey,
});

export default aiService;
