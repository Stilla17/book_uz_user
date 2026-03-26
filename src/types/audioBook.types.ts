export interface MultiLangField {
  uz: string;
  ru: string;
  en: string;
}

export interface AudioBook {
  _id: string;
  title: MultiLangField;
  slug: string;
  author: MultiLangField;
  narrator: MultiLangField;
  description?: MultiLangField;
  coverImage: string;
  audioUrl?: string;
  audioFileId?: string;
  duration: string;
  durationSeconds?: number;
  category?: string | { _id: string; name: MultiLangField; slug: string };
  tags: string[];
  rating: number;
  reviewsCount: number;
  listens: number;
  downloads: number;
  isNew: boolean;
  isHit: boolean;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AudioBookFormData {
  title: MultiLangField;
  author: MultiLangField;
  narrator: MultiLangField;
  description?: MultiLangField;
  duration: string;
  category?: string;
  tags: string[];
  isNew: boolean;
  isHit: boolean;
  order: number;
  coverImage?: File | string;
  audioFile?: File | string;
}