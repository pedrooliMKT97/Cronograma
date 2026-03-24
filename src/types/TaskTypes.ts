export type DayOfWeek = 'Sábado' | 'Domingo' | 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta';
export type ColorTag = 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'yellow';
export type Platform = 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube' | 'Other';
export type ContentType = 'Post' | 'Reels' | 'Story';

export interface Boost {
  enabled: boolean;
  amount: number;
  objective: string;
  platform: Platform;
}

export interface Task {
  id: string;
  day: DayOfWeek;
  time: string; // HH:mm format
  title: string;
  color: ColorTag;
  completed: boolean;
  contentType: ContentType;
  caption?: string;
  boost?: Boost;
}
