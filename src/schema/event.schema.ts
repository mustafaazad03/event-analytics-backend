import { z } from 'zod';

export const eventSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    type: z.enum(['VIRTUAL', 'HYBRID']),
    capacity: z.number().min(1)
  })
});

export const participantSchema = z.object({
  body: z.object({
    userIds: z.array(z.string())
  })
});