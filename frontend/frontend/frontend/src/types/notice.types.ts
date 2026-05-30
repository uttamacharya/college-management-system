// ts id="2um7uh"
export type NoticePriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export type NoticeCategory =
  | "academic"
  | "event"
  | "exam"
  | "general"
  | "holiday";

export interface Notice {

  // BASIC

  id: string;

  title: string;

  content?: string;

  description?: string;

  // IMAGE

  image?: string;

  image_url?: string;

  image_public_id?: string;

  // PRIORITY

  priority?: NoticePriority;

  importance?: NoticePriority;

  // CATEGORY

  category: NoticeCategory;

  // AUTHOR

  authorId?: string;

  authorName?: string;

  teacher_id?: string;
  teacher_name?: string;

  // TARGETS

  targetAudience?: string[];

  target_batches?: number[];

  target_branches?: string[];

  target_student_ids?: string[];

  // STATUS

  isRead?: boolean;

  is_read?: boolean;

  isStarred?: boolean;

  is_starred?: boolean;

  isHidden?: boolean;

  is_hidden?: boolean;

  // DATES

  createdAt?: string;

  created_at?: string;

  updatedAt?: string;

  updated_at?: string;

  expiresAt?: string;

  expires_at?: string;

  // ACTIVE

  is_active?: boolean;

  // ATTACHMENTS

  attachments?: string[];
}

export interface CreateNoticeRequest {

  title: string;

  description?: string;

  image?: File | null;

  importance?: NoticePriority;

  category?: NoticeCategory;

  target_batches?: number[];

  target_branches?: string[];

  target_student_ids?: string[];

  expires_at?: string;
}

export interface UpdateNoticeRequest {

  title?: string;

  description?: string;

  image?: File | null;

  remove_image?: boolean;

  importance?: NoticePriority;

  category?: NoticeCategory;

  target_batches?: number[];

  target_branches?: string[];

  target_student_ids?: string[];

  expires_at?: string;
}

