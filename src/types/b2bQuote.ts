export interface ITradeLicense {
  imageUrl?: string;
  public_id?: string;
}

export interface IB2BQuote {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  role?: string | null;
  quantity: string;
  productRequired?: string[] | null;
  projectStatus?: string | null;
  budgetRange?: string | null;
  additionalInfo?: string | null;
  tradeLicense?: ITradeLicense | null;
  trnNumber: string;
  createdAt?: string | null;
}
