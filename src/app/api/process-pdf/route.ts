import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try to parse PDF
    try {
      // Dynamic import pdf-parse (only available on server)
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(buffer);

      return NextResponse.json({
        success: true,
        content: data.text,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          pages: data.numpages,
          info: data.info,
          processedAt: new Date().toISOString(),
        },
      });
    } catch (parseError: any) {
      console.error('PDF parse error:', parseError);
      
      // If pdf-parse is not installed, return helpful message
      if (parseError.code === 'MODULE_NOT_FOUND') {
        return NextResponse.json({
          success: false,
          error: 'PDF parser not installed. Please run: npm install pdf-parse',
          content: `[PDF File: ${file.name}]\n\nĐể xử lý file PDF, cần cài đặt thư viện:\nnpm install pdf-parse\n\nSau đó khởi động lại server.`,
        });
      }

      throw parseError;
    }
  } catch (error: any) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to process PDF',
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
