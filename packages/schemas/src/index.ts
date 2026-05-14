// @agri-packages/schemas
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'FARMER', 'EXPERT', 'GUEST']),
});

export type UserDTO = z.infer<typeof UserSchema>;
