import type { Request } from 'express';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'teacher';
export type ImportanceLevel = 'low' | 'medium' | 'high';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  id: string;
  college_id: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  teacher?: TeacherRecord;
  student?: StudentRecord;
}

// ─── DB Records ───────────────────────────────────────────────────────────────

export interface TeacherRecord {
  id: string;
  user_id: string;
  department: string;
  designation: string;
}

export interface StudentRecord {
  id: string;
  user_id: string;
  year: number;
  branch: string;
}

export interface Notice {
  id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  target_years: number[];
  target_branches: string[];
  importance: ImportanceLevel;
  expires_at: Date | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  is_read?: boolean;
  is_starred?: boolean;
}

export interface NoticeWithMeta extends Notice {
  teacher_name: string;
  teacher_department: string;
  target_student_ids?: string[];
}

// ─── Service Inputs ───────────────────────────────────────────────────────────

export interface CreateNoticeInput {
  title: string;
  description?: string;
  image_url?: string;
  image_public_id?: string;
  target_years?: number[];
  target_branches?: string[];
  target_student_ids?: string[];
  importance?: ImportanceLevel;
  expires_at?: string;
}

export interface UpdateNoticeInput {
  title?: string;
  description?: string;
  image_url?: string;
  image_public_id?: string;
  remove_image?: boolean;
  target_years?: number[];
  target_branches?: string[];
  target_student_ids?: string[];
  importance?: ImportanceLevel;
  expires_at?: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta extends PaginationParams {
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

// ─── Cloudinary ───────────────────────────────────────────────────────────────

export interface UploadedImageResult {
  url: string;
  public_id: string;
}
