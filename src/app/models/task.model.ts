export interface ITask {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    status: string;
    priority: string;
    isComplete: boolean;
  }