
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Company } from '@/types';
import { companyService } from '@/services/company-service';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/protected-route';

const Admin = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    sector: '',
    logo: '',
    headquarters: '',
    founded: '',
    description: ''
  });

  // Load companies
  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load companies on component mount
  useEffect(() => {
    loadCompanies();
  }, []);

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      sector: '',
      logo: '',
      headquarters: '',
      founded: '',
      description: ''
    });
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open add dialog
  const openAddDialog = () => {
    resetFormData();
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (company: Company) => {
    setCurrentCompany(company);
    setFormData({ ...company });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (company: Company) => {
    setCurrentCompany(company);
    setIsDeleteDialogOpen(true);
  };

  // Add company
  const handleAddCompany = async () => {
    // Validate required fields
    if (!formData.name || !formData.sector || !formData.headquarters || !formData.founded) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await companyService.addCompany(formData as Omit<Company, 'id'>);
      setIsAddDialogOpen(false);
      loadCompanies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add company");
    }
  };

  // Update company
  const handleUpdateCompany = async () => {
    if (!currentCompany) return;

    // Validate required fields
    if (!formData.name || !formData.sector || !formData.headquarters || !formData.founded) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await companyService.updateCompany(currentCompany.id, formData);
      setIsEditDialogOpen(false);
      loadCompanies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update company");
    }
  };

  // Delete company
  const handleDeleteCompany = async () => {
    if (!currentCompany) return;
    
    try {
      await companyService.deleteCompany(currentCompany.id);
      setIsDeleteDialogOpen(false);
      loadCompanies();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete company");
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button 
              onClick={openAddDialog}
              className="bg-bangladesh-green hover:bg-green-800"
            >
              Add New Company
            </Button>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bangladesh-green"></div>
            </div>
          ) : (
            <>
              {/* Companies table */}
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sector
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Headquarters
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Founded
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companies.map((company) => (
                      <tr key={company.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 object-contain" 
                                src={company.logo} 
                                alt={`${company.name} logo`}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://via.placeholder.com/40?text=' + encodeURIComponent(company.name.charAt(0));
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {company.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.sector}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.headquarters}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{company.founded}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => openEditDialog(company)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => openDeleteDialog(company)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* No companies message */}
              {companies.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">No companies found</h3>
                  <p className="text-muted-foreground mt-2">
                    Click on "Add New Company" to add your first company.
                  </p>
                </div>
              )}
            </>
          )}
        </main>
        
        {/* Add Company Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Beximco Group"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector *</Label>
                  <Input
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    placeholder="e.g. Conglomerate"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headquarters">Headquarters *</Label>
                  <Input
                    id="headquarters"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                    placeholder="e.g. Dhaka"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founded">Founded Year *</Label>
                  <Input
                    id="founded"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                    placeholder="e.g. 1985"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the company"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddCompany}
                className="bg-bangladesh-green hover:bg-green-800"
              >
                Add Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Company Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Company</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Company Name *</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sector">Sector *</Label>
                  <Input
                    id="edit-sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-headquarters">Headquarters *</Label>
                  <Input
                    id="edit-headquarters"
                    name="headquarters"
                    value={formData.headquarters}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-founded">Founded Year *</Label>
                  <Input
                    id="edit-founded"
                    name="founded"
                    value={formData.founded}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-logo">Logo URL</Label>
                <Input
                  id="edit-logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateCompany}
                className="bg-bangladesh-green hover:bg-green-800"
              >
                Update Company
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Company Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Company</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete{" "}
              <strong>{currentCompany?.name}</strong>? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCompany}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
};

export default Admin;
