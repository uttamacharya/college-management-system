"use client";


import { useState, useEffect } from "react";
import { Notice, CreateNoticeRequest, NoticePriority, NoticeCategory } from "@/types/notice.types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface NoticeFormProps {
  notice?: Notice;
  onSubmit: (data: CreateNoticeRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const priorities: { value: NoticePriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const categories: { value: NoticeCategory; label: string }[] = [
  { value: "academic", label: "Academic" },
  { value: "event", label: "Event" },
  { value: "exam", label: "Exam" },
  { value: "general", label: "General" },
  { value: "holiday", label: "Holiday" },
];

export function NoticeForm({ notice, onSubmit, onCancel, isLoading }: NoticeFormProps) {
    const [image, setImage] =
    useState<File | null>(null);
  const [title, setTitle] = useState(notice?.title || "");
  const [content, setContent] = useState(notice?.content || "");
  const [priority, setPriority] = useState<NoticePriority>(notice?.priority || "medium");
  const [category, setCategory] = useState<NoticeCategory>(notice?.category || "general");

  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
      setContent(notice.content);
      setPriority(notice.priority);
      setCategory(notice.category);
    }
  }, [notice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({

  title,

  content,

  priority,

  category,

  image,

  targetAudience: [
    "all-students",
  ],
});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        placeholder="Enter notice title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-dark-200 mb-1.5">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter notice content"
          rows={5}
          required
          className="w-full rounded-lg border border-dark-600 bg-dark-800 px-4 py-2.5 text-white placeholder-dark-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-1.5">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as NoticePriority)}
            className="w-full rounded-lg border border-dark-600 bg-dark-800 px-4 py-2.5 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-200 mb-1.5">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as NoticeCategory)}
            className="w-full rounded-lg border border-dark-600 bg-dark-800 px-4 py-2.5 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {notice ? "Update Notice" : "Create Notice"}
        </Button>
      </div>
    </form>
  );
}
