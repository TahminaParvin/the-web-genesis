
export interface Company {
  id: string;
  name: string;
  sector: string;
  logo: string;
  headquarters: string;
  founded: string;
  description?: string;
}

export interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}
