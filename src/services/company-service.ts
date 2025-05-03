
import { companies as initialCompanies } from "@/data/companies";
import { Company } from "@/types";
import { toast } from "sonner";

// Simulate storage for our SPA (would be replaced by API calls in a real app)
let companies = [...initialCompanies];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const companyService = {
  // Get all companies
  getCompanies: async (): Promise<Company[]> => {
    await delay(300); // Simulate network delay
    return [...companies];
  },
  
  // Search companies by name or sector
  searchCompanies: async (query: string): Promise<Company[]> => {
    await delay(200);
    const normalizedQuery = query.toLowerCase();
    return companies.filter(company => 
      company.name.toLowerCase().includes(normalizedQuery) || 
      company.sector.toLowerCase().includes(normalizedQuery)
    );
  },
  
  // Get a company by ID
  getCompanyById: async (id: string): Promise<Company | undefined> => {
    await delay(200);
    return companies.find(company => company.id === id);
  },
  
  // Add a new company (admin only)
  addCompany: async (company: Omit<Company, "id">): Promise<Company> => {
    await delay(400);
    const newCompany = {
      ...company,
      id: String(companies.length + 1)
    };
    companies = [...companies, newCompany];
    toast.success("Company added successfully!");
    return newCompany;
  },
  
  // Update a company (admin only)
  updateCompany: async (id: string, updatedCompany: Partial<Company>): Promise<Company> => {
    await delay(400);
    const index = companies.findIndex(company => company.id === id);
    if (index === -1) {
      toast.error("Company not found");
      throw new Error("Company not found");
    }
    
    companies[index] = { ...companies[index], ...updatedCompany };
    toast.success("Company updated successfully!");
    return companies[index];
  },
  
  // Delete a company (admin only)
  deleteCompany: async (id: string): Promise<void> => {
    await delay(400);
    const index = companies.findIndex(company => company.id === id);
    if (index === -1) {
      toast.error("Company not found");
      throw new Error("Company not found");
    }
    
    companies = companies.filter(company => company.id !== id);
    toast.success("Company deleted successfully!");
  }
};
