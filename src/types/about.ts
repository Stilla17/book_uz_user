export interface TeamMember {
  id: string;
  name: string;
  position: string;
  positionRu: string;
  positionEn: string;
  bio: string;
  bioRu: string;
  bioEn: string;
  image: string;
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface Statistic {
  icon: React.ReactNode;
  value: string;
  label: string;
  labelRu: string;
  labelEn: string;
  color: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  titleRu: string;
  titleEn: string;
  description: string;
  descriptionRu: string;
  descriptionEn: string;
  icon: React.ReactNode;
}