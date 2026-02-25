export class ApiError extends Error {
  message: string;
  statusCode: number;
  isNetworkError: boolean;
  isTimeout: boolean;
  isRaceCondition: boolean;

  constructor(
    message: string,
    statusCode: number,
    isNetworkError: boolean = false,
    isTimeout: boolean = false,
    isRaceCondition: boolean = false
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.isNetworkError = isNetworkError;
    this.isTimeout = isTimeout;
    this.isRaceCondition = isRaceCondition;
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'No connection. Check your internet.';
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return 'Request timed out, please try again';
    }
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message.includes('fetch');
}

export function isTimeout(error: unknown): boolean {
  return (
    error instanceof DOMException && error.name === 'AbortError'
  ) || (error instanceof Error && error.message.includes('timeout'));
}

export function isRaceCondition(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.isRaceCondition;
  }
  return false;
}
