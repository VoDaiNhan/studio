/**
 * File processor utilities for knowledge sources
 */

export interface ProcessedFile {
  content: string;
  metadata: {
    fileName: string;
    fileSize: number;
    fileType: string;
    processedAt: string;
    pages?: number;
  };
}

/**
 * Process text file
 */
export async function processTextFile(file: File): Promise<ProcessedFile> {
  const content = await file.text();
  
  return {
    content,
    metadata: {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      processedAt: new Date().toISOString(),
    },
  };
}

/**
 * Process PDF file using server-side API
 * Requires pdf-parse to be installed: npm install pdf-parse
 */
export async function processPDFFile(file: File): Promise<ProcessedFile> {
  try {
    // Create form data to send to API
    const formData = new FormData();
    formData.append('file', file);

    // Call API to process PDF on server
    const response = await fetch('/api/process-pdf', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      // If pdf-parse not installed, return helpful message
      if (result.content) {
        return {
          content: result.content,
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            processedAt: new Date().toISOString(),
          },
        };
      }
      throw new Error(result.error || 'Failed to process PDF');
    }

    return {
      content: result.content,
      metadata: {
        fileName: result.metadata.fileName,
        fileSize: result.metadata.fileSize,
        fileType: file.type,
        processedAt: result.metadata.processedAt,
        pages: result.metadata.pages,
      },
    };
  } catch (error: any) {
    console.error('Error processing PDF:', error);
    throw new Error(error.message || 'Không thể xử lý file PDF');
  }
}

/**
 * Process any supported file
 */
export async function processFile(file: File): Promise<ProcessedFile> {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size > maxSize) {
    throw new Error('File quá lớn. Kích thước tối đa là 10MB');
  }
  
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return processTextFile(file);
  }
  
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    return processPDFFile(file);
  }
  
  throw new Error('Định dạng file không được hỗ trợ. Chỉ hỗ trợ .txt và .pdf');
}

/**
 * Validate file before processing
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['text/plain', 'application/pdf'];
  const allowedExtensions = ['.txt', '.pdf'];
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File quá lớn. Kích thước tối đa là 10MB' };
  }
  
  const hasValidType = allowedTypes.includes(file.type);
  const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  
  if (!hasValidType && !hasValidExtension) {
    return { valid: false, error: 'Định dạng file không được hỗ trợ. Chỉ hỗ trợ .txt và .pdf' };
  }
  
  return { valid: true };
}
