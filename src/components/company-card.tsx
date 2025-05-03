
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Company } from '@/types';

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <img 
          src={company.logo} 
          alt={`${company.name} logo`} 
          className="company-logo"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/60?text=' + encodeURIComponent(company.name.charAt(0));
          }}
        />
        <div>
          <CardTitle className="text-xl">{company.name}</CardTitle>
          <p className="text-sm text-muted-foreground font-medium">{company.sector}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Founded:</span> {company.founded}</p>
          <p><span className="font-medium">Headquarters:</span> {company.headquarters}</p>
          {company.description && (
            <p className="text-muted-foreground mt-2">{company.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-1 text-xs text-muted-foreground">
        <p>Ranked among top Bangladesh companies</p>
      </CardFooter>
    </Card>
  );
};
