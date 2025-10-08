'use server';

import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'appearance-config.json');

// Schema for appearance configuration defined here for validation, but not exported.
const AppearanceConfigSchema = z.object({
  displayName: z.string(),
  welcomeMessage: z.string(),
  aiPersona: z.enum(['expert', 'friendly', 'professional']),
});

export type AppearanceConfig = z.infer<typeof AppearanceConfigSchema>;

// Helper function to read data from the JSON file
async function readData(): Promise<AppearanceConfig> {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    // If the file doesn't exist or has an error, return a default config
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      const defaultConfig = {
        displayName: 'Trợ lý Luật Giao thông',
        welcomeMessage: 'Chào bạn! Tôi có thể giúp gì cho bạn về Luật Giao thông?',
        aiPersona: 'expert' as const,
      };
      await writeData(defaultConfig);
      return defaultConfig;
    }
    throw error;
  }
}

// Helper function to write data to the JSON file
async function writeData(data: AppearanceConfig): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Action to get the current appearance configuration
export async function getAppearanceConfig(): Promise<AppearanceConfig> {
  return await readData();
}

// Action to update the appearance configuration
export async function updateAppearanceConfig(input: AppearanceConfig): Promise<{ success: boolean, error?: string }> {
  const validatedData = AppearanceConfigSchema.safeParse(input);
  if (!validatedData.success) {
    console.error("Invalid configuration data:", validatedData.error.flatten());
    return { success: false, error: 'Dữ liệu cấu hình không hợp lệ.' };
  }
  try {
    await writeData(validatedData.data);
    // Revalidate the home page to reflect the changes immediately
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("Failed to write appearance config:", error);
    return { success: false, error: 'Không thể ghi tệp cấu hình.' };
  }
}
