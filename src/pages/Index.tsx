
import React, { useState, useEffect } from 'react';
import { CompanyCard } from '@/components/company-card';
import { SearchBar } from '@/components/search-bar';
import { Navbar } from '@/components/navbar';
import { Company } from '@/types';
import { companyService } from '@/services/company-service';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Index = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalCompanies / itemsPerPage);

  // Fetch companies on component mount or when page changes
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        // Only fetch paginated data when not searching
        if (!searchQuery) {
          const { data, total } = await companyService.getCompanies(currentPage, itemsPerPage);
          setCompanies(data);
          setFilteredCompanies(data);
          setTotalCompanies(total);
        } else {
          const results = await companyService.searchCompanies(searchQuery);
          setFilteredCompanies(results);
        }
      } catch (err) {
        setError('Failed to load companies. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, [currentPage, searchQuery]);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
    
    if (!query.trim()) {
      const { data, total } = await companyService.getCompanies(1, itemsPerPage);
      setCompanies(data);
      setFilteredCompanies(data);
      setTotalCompanies(total);
      return;
    }
    
    try {
      setIsLoading(true);
      const results = await companyService.searchCompanies(query);
      setFilteredCompanies(results);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;
    
    // Start and end page calculation
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Top Bangladeshi Companies</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover Bangladesh's most successful businesses across various sectors
          </p>
          
          {/* Search bar */}
          <div className="mt-6 flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
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
          <div>
            {/* Search results info */}
            {searchQuery && (
              <p className="mb-4">
                {filteredCompanies.length === 0
                  ? `No results found for "${searchQuery}"`
                  : `Showing ${filteredCompanies.length} result${filteredCompanies.length !== 1 ? 's' : ''} for "${searchQuery}"`}
              </p>
            )}

            {/* Company cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {/* No results message */}
            {filteredCompanies.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium">No companies found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your search terms or browse all companies.
                </p>
              </div>
            )}
            
            {/* Pagination - only show when not searching */}
            {!searchQuery && totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {renderPaginationItems()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Bangladesh Top Companies | Inspired by Forbes Real-Time Billionaires</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
