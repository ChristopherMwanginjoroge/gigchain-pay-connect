import { DocumentType, SubmitKycInput } from "@/types/supabase";

const DOCUMENT_MAX_SIZE = 5 * 1024 * 1024;
const SELFIE_MAX_SIZE = 2 * 1024 * 1024;
const DOCUMENT_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
const SELFIE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export function buildStoragePath(userId: string, filename: string, now = Date.now()): string {
  return `${userId}/${now}-${sanitizeFilename(filename)}`;
}

export function validateDocumentFile(file: File) {
  if (!DOCUMENT_MIME_TYPES.includes(file.type)) {
    throw new Error("Document must be JPG, PNG, or PDF.");
  }
  if (file.size > DOCUMENT_MAX_SIZE) {
    throw new Error("Document exceeds 5MB limit.");
  }
}

export function validateSelfieFile(file: File) {
  if (!SELFIE_MIME_TYPES.includes(file.type)) {
    throw new Error("Selfie must be JPG or PNG.");
  }
  if (file.size > SELFIE_MAX_SIZE) {
    throw new Error("Selfie exceeds 2MB limit.");
  }
}

export function validateKycPayload(payload: SubmitKycInput) {
  if (!payload.documentType) {
    throw new Error("Document type is required.");
  }
  validateDocumentFile(payload.documentFile);
  validateSelfieFile(payload.selfieFile);
}

export const DOCUMENT_TYPES: DocumentType[] = ["passport", "national_id", "military_id"];
