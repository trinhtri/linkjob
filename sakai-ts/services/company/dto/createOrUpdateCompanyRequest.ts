export interface CreateOrUpdateCompanyRequest {
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
  fieldOfActivity: string | null;
}
