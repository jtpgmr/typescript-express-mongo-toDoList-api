import { ObjectId } from 'mongodb';
import * as z from 'zod';

export const IdParams = z.object({
  id: z.string().min(1).refine((value) => {
    try {
      return new ObjectId(value);
    } catch (error) {
      return false;
    }
  }, 
  // "message" is a Zod property
  {
    message: 'Invalid ObjectId',
  }),
});

export type IdParams = z.infer<typeof IdParams>;