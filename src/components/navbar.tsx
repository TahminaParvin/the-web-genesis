
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';

export const Navbar = () => {
  const { authState, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-bangladesh-green text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold">
            Bangladesh Top Companies
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {authState.isAuthenticated ? (
            <>
              {isAdmin() && (
                <Link to="/admin">
                  <Button variant="outline" className="bg-white text-bangladesh-green hover:bg-gray-100">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Button 
                variant="ghost" 
                onClick={() => logout()}
                className="text-white hover:bg-green-800"
              >
                Logout
              </Button>
              <span className="text-sm">Welcome, {authState.user?.username}</span>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="bg-white text-bangladesh-green hover:bg-gray-100">
                Admin Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
