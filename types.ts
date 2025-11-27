export enum DraftMode {
  EMAIL_REPLY = 'Email Reply',
  NEW_EMAIL = 'New Email',
  LINKEDIN_POST = 'LinkedIn Post',
}

export interface RefinedResponse {
  transcription: string;
  refinedContent: string;
  toneAnalysis: string;
  savedTime: string; // e.g., "Saved ~2 mins"
}

export interface ProcessingState {
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
  result: RefinedResponse | null;
}
