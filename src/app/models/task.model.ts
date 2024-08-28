export interface ITask {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    status?: string;
    priority: string;
    createdDate?: Date;
    userId?: string;
    userName?: string;
  }
