import { Task } from '../types/TaskTypes';

export const sortTasksByTime = (tasks: Task[]) => {
  return [...tasks].sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    if (timeA[0] !== timeB[0]) {
      return timeA[0] - timeB[0];
    }
    return timeA[1] - timeB[1];
  });
};
