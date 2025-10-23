export interface PieDataPoint {
  label: string;
  value: number;
}

export interface SeriesDataPoint {
  label: string;
  data: number[];
}

export interface SeriesResponse {
  labels: string[];
  datasets: SeriesDataPoint[];
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: 'connected' | 'disconnected';
}
