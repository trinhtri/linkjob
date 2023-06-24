export interface CompanyResponse {
  id: string;
  name: string;
  address: string;
  connecter: string | null;
  email: string | null;
  landline: string | null;
  phoneNumber: string | null;
  lastCall: Date | null;
  nextCall: Date | null;
  note: string | null;
  isRuningJob: boolean;
  isContracted: boolean;
}
