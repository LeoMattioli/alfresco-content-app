export interface DocumentsConfig {
  id: string;
  label: string;
  query: string;
  formFields: DocumentsFormConfig[];
}

export interface DocumentsFormConfig {
  key: string;
  label: string;
  type: string;
  required: boolean;
}
