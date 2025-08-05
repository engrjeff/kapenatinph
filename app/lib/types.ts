export type SuccessResponse<T = unknown> = {
  success: true;
  intent: 'create' | 'update' | 'delete';
  data: T;
};

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  field?: string;
}

export type ActionResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;
