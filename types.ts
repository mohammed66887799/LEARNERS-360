export interface Diagnosis {
  isPlant: boolean;
  plantName: string;
  diseaseName: string;
  isHealthy: boolean;
  confidence: number;
  description: string;
  treatments: string[];
}

export interface AnalysisState {
  status: 'idle' | 'uploading' | 'analyzing' | 'success' | 'error';
  imagePreview: string | null;
  result: Diagnosis | null;
  error: string | null;
}

export enum PlantStatus {
  HEALTHY = 'Healthy',
  INFECTED = 'Infected',
  UNKNOWN = 'Unknown'
}