import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/ai/openai';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build context from history
    let contextPrompt = '';
    if (history && history.length > 0) {
      contextPrompt = 'Lịch sử cuộc trò chuyện:\n';
      history.forEach((msg: any) => {
        contextPrompt += `${msg.role === 'user' ? 'Người dùng' : 'AI'}: ${msg.content}\n`;
      });
      contextPrompt += '\n';
    }

    const systemInstruction = `Bạn là một chuyên gia tư vấn pháp luật AI chuyên sâu tại Việt Nam. 

Nhiệm vụ của bạn:
1. Phân tích tình huống pháp lý một cách chi tiết và chuyên sâu
2. Xác định các vấn đề pháp lý liên quan
3. Tư vấn về quyền và nghĩa vụ của các bên
4. Đề xuất các bước hành động cụ thể
5. Cảnh báo về rủi ro pháp lý có thể xảy ra
6. Gợi ý khi nào cần tìm luật sư chuyên nghiệp

Phong cách trả lời:
- Chuyên nghiệp, chi tiết và dễ hiểu
- Có cấu trúc rõ ràng (phân tích, tư vấn, hành động)
- Dẫn chiếu luật cụ thể khi có thể
- Thực tế và khách quan
- Luôn nhắc nhở người dùng tham khảo luật sư cho các vấn đề phức tạp

Trả lời bằng tiếng Việt, không dùng markdown.`;

    const fullPrompt = `${contextPrompt}Người dùng hỏi: ${message}

Hãy phân tích tình huống và tư vấn chi tiết.`;

    let response = await generateText(fullPrompt, systemInstruction);

    // Remove markdown formatting (asterisks, hashtags, etc.)
    response = response
      .replace(/\*\*/g, '')  // Remove bold **text**
      .replace(/\*/g, '')    // Remove italic *text*
      .replace(/#{1,6}\s/g, '') // Remove headers # ## ###
      .replace(/`{1,3}/g, '') // Remove code blocks
      .replace(/^\s*[-*+]\s/gm, '• ') // Convert markdown lists to bullet points
      .replace(/^\s*\d+\.\s/gm, (match) => match.replace(/\d+\./, (num) => num + ' ')) // Keep numbered lists
      .trim();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI Consultant API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
