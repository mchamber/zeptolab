import { IFile } from '@src/models/File';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';


export const RequestBodySchema = z.object({
  type: z.string().optional().default('core'),
  version: z.string().optional().default('1.0.0'),
  hash: z.string().nullable().optional().default(null),
});

const c = initContract();
export const contract = c.router({
  saveFileRpc: {
    method: 'POST',
    path: '/api/saveFileRpc',
    responses: {
      200: c.type<IFile>(),
      400: c.type<{ error: string }>(),
    },
    body: RequestBodySchema,
    summary: 'RPC function to process file and return content',
    metadata: { role: 'user' } as const,
  },
});

