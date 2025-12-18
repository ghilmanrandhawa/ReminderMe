export type User = {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
  };
};

export type Tag = {
  id: string;
  name: string;
  color: string; // Hex code
  ownerId: string;
};

export type RecurringInterval = 'daily' | 'weekly' | 'monthly';

export type RecurringPattern = {
  id: string;
  taskId: string;
  interval: RecurringInterval;
  lastInstanceDate: string; // ISO date string
};

export type TaskStatus = 'pending' | 'completed' | 'archived';

export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  dueTime: string; // HH:mm
  tags: string[]; // Array of Tag IDs
  status: TaskStatus;
  completedAt?: string; // ISO date string
  reminderOffset: number; // Minutes before due time
  recurringPatternId?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};
