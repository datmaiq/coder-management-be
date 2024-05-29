interface CreateUserRequest {
  name: string;
}

interface GetUsersRequest {
  name: string;
}

interface CreateTaskRequest {
  name: string;
  description: string;
  status: 'pending' | 'working' | 'review' | 'done' | 'archive';
  userId?: string;
}

interface GetTasksRequest {
  userId: string;
  status: 'pending' | 'working' | 'review' | 'done' | 'archive';
}

interface UpdateTasksRequest {
  name: string;
  description: string;
  status: 'pending' | 'working' | 'review' | 'done' | 'archive';
  userId: string;
}