// @agri-packages/schemas
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'FARMER', 'EXPERT', 'GUEST']),
});

export const DiagnosisSchema = z.object({
  id: z.string().uuid(),
  farmer_id: z.string(),
  image_url: z.string().url(),
  disease_detected: z.string(),
  confidence_score: z.number().min(0).max(1),
  severity: z.enum(['Low', 'Medium', 'High']),
  expert_reviewed: z.boolean(),
  expert_notes: z.string().optional(),
  created_at: z.string(),
});

export const NotificationSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(['info', 'warning', 'critical', 'emergency']),
  target_role: z.enum(['all', 'farmer', 'user']),
  is_read: z.boolean().default(false),
  created_at: z.string(),
});

export const ProfileSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  role: z.enum(['admin', 'farmer', 'user']),
  is_verified: z.boolean(),
  district: z.string(),
  upazila: z.string().optional(),
  language: z.enum(['en', 'bn']),
  onboarding_completed: z.boolean(),
});

export type UserDTO = z.infer<typeof UserSchema>;
export type DiagnosisDTO = z.infer<typeof DiagnosisSchema>;
export type NotificationDTO = z.infer<typeof NotificationSchema>;
export type ProfileDTO = z.infer<typeof ProfileSchema>;
