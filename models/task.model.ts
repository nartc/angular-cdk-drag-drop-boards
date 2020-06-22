export type TaskLabelColor = 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';

export interface Task {
  description?: string;
  label?: TaskLabelColor;
}
