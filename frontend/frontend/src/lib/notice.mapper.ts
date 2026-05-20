
export function mapNotice(notice: any) {

  return {

    id: notice.id,

    title: notice.title,

    content:
      notice.description,

    image:
      notice.image_url,

    priority:
      notice.importance,

    category:
      notice.category ||
      "general",

    createdAt:
      notice.created_at,

    authorName:
      notice.teacher_name ||
      notice.authorName ||
      "Teacher",

    isRead:
      notice.is_read,

    isStarred:
      notice.is_starred,
  };
}

