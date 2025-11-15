import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-relevant-laws.ts';
import '@/ai/flows/interpret-traffic-query.ts';
import '@/ai/flows/retrieve-traffic-documents.ts';