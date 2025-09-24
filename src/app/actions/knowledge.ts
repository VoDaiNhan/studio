'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import type { KnowledgeSource } from '@/lib/knowledge';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'knowledge-sources.json');

// Helper function to read data from the JSON file
async function readData(): Promise<KnowledgeSource[]> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function to write data to the JSON file
async function writeData(data: KnowledgeSource[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Schema for creating a new knowledge source
const CreateKnowledgeSourceSchema = z.object({
  title: z.string().optional(),
  url: z.string().url().optional(),
  content: z.string().optional(),
  effectiveDate: z.string().optional(),
}).refine(data => data.url || data.content, {
  message: "Either URL or content must be provided.",
});


// Schema for updating an existing knowledge source
const UpdateKnowledgeSourceSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  url: z.string().url().optional(),
  content: z.string().optional(),
  effectiveDate: z.string().optional(),
}).refine(data => data.url || data.content, {
    message: "Either URL or content must be provided.",
});


// Action to get all knowledge sources
export async function getKnowledgeSources(): Promise<KnowledgeSource[]> {
  return await readData();
}

// Action to create a new knowledge source
export async function createKnowledgeSource(input: z.infer<typeof CreateKnowledgeSourceSchema>): Promise<KnowledgeSource> {
  const sources = await readData();
  
  let title = input.title;
  // If URL is provided and title is not, try to generate a title
  if (input.url && !title) {
    try {
        const urlPath = new URL(input.url).pathname;
        const fileName = urlPath.split('/').pop() || 'Untitled Document';
        title = fileName.replace(/\.(pdf|txt|doc|docx)$/i, '');
    } catch (e) {
        title = 'Untitled Document';
    }
  } else if (!title) {
    title = 'Untitled Document'
  }


  const newSource: KnowledgeSource = {
    id: Date.now().toString(),
    title,
    type: input.url ? 'url' : 'manual',
    url: input.url,
    content: input.content,
    effectiveDate: input.effectiveDate || new Date().toISOString(),
    status: 'learning', // New sources start with 'learning' status
  };

  sources.push(newSource);
  await writeData(sources);

  // In a real app, you would trigger a background job here to process the URL/content
  // For now, we'll just simulate it by updating the status to 'active' after a delay
  setTimeout(async () => {
    const currentSources = await readData();
    const updatedSources = currentSources.map(s =>
      s.id === newSource.id ? { ...s, status: 'active' } : s
    );
    await writeData(updatedSources);
  }, 3000);


  return newSource;
}

// Action to update an existing knowledge source
export async function updateKnowledgeSource(input: z.infer<typeof UpdateKnowledgeSourceSchema>): Promise<KnowledgeSource | null> {
  const sources = await readData();
  const index = sources.findIndex(s => s.id === input.id);

  if (index === -1) {
    return null;
  }
  
  const originalSource = sources[index];

  const updatedSource: KnowledgeSource = {
    ...originalSource,
    title: input.title || originalSource.title,
    type: input.url ? 'url' : 'manual',
    url: input.url,
    content: input.content,
    effectiveDate: input.effectiveDate || originalSource.effectiveDate,
    status: 'learning'
  };

  sources[index] = updatedSource;
  await writeData(sources);

  // Simulate processing again
   setTimeout(async () => {
    const currentSources = await readData();
    const updatedSources = currentSources.map(s =>
      s.id === updatedSource.id ? { ...s, status: 'active' } : s
    );
    await writeData(updatedSources);
  }, 3000);

  return updatedSource;
}

// Action to delete a knowledge source
export async function deleteKnowledgeSource(id: string): Promise<{ success: boolean }> {
  let sources = await readData();
  const initialLength = sources.length;
  sources = sources.filter(s => s.id !== id);

  if (sources.length < initialLength) {
    await writeData(sources);
    return { success: true };
  }

  return { success: false };
}
