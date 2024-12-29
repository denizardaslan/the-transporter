import { z } from 'zod';

// Custom transformer for timestamps
const timestampSchema = z.union([
  z.number(),
  z.string().datetime()
]).transform((val) => {
  if (typeof val === 'number') {
    // Convert Unix timestamp from seconds to milliseconds
    const milliseconds = val * 1000;
    return new Date(milliseconds).toISOString();
  }
  return val;
});

const DrivingDataPoint = z.object({
  index: z.number().int(),
  timestamp: timestampSchema,
  longitude: z.number(),
  latitude: z.number(),
  speed: z.number(),
  distance: z.number(),
});

export const DrivingDataSchema = z.object({
  id: z.string().uuid(),
  session_id: z.number().int(),
  session_start: timestampSchema,
  session_end: timestampSchema.nullable(),
  driverName: z.string().nullable(),
  tyreType: z.enum(['Winter', 'Summer', 'All-Season']).nullable(),
  data: z.array(DrivingDataPoint),
});

export type DrivingData = z.infer<typeof DrivingDataSchema>;

export function validateDrivingData(jsonString: string): { 
  success: boolean; 
  data?: DrivingData; 
  error?: string; 
} {
  try {
    const jsonData = JSON.parse(jsonString);
    const result = DrivingDataSchema.safeParse(jsonData);

    if (!result.success) {
      return {
        success: false,
        error: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (e) {
    return {
      success: false,
      error: 'Invalid JSON format',
    };
  }
} 