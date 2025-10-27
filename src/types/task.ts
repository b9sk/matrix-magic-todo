export type QuadrantType = 
  | 'urgent-important' 
  | 'urgent-not-important' 
  | 'not-urgent-important' 
  | 'not-urgent-not-important';

export interface Task {
  id: string;
  text: string;
  quadrant: QuadrantType;
  completed: boolean;
  createdAt: number;
}

export interface QuadrantInfo {
  id: QuadrantType;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
