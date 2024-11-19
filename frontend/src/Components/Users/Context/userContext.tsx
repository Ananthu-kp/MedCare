import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { BASE_URL } from '../../../Config/baseURL';

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImg: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUserData: () => void;
  updateUserData: (userData: Partial<User>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const storedToken = sessionStorage.getItem('userToken');
    if (storedToken) {
      try {
        const response = await axios.get(`${BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to fetch user data');
        logout();
      }
    }
  };

  const updateUserData = async (userData: Partial<User>) => {
    const storedToken = sessionStorage.getItem('userToken');
    if (storedToken) {
      try {
        await axios.put(
          `${BASE_URL}/personal`,
          userData,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        setUser((prevUser) => prevUser ? { ...prevUser, ...userData } : null);
        toast.success('Personal details updated successfully!');
      } catch (error) {
        console.error('Error updating user data:', error);
        toast.error('Failed to update user details');
      }
    }
  };

  const logout = () => {
    sessionStorage.removeItem('userToken');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      fetchUserData,
      updateUserData,
      logout
    }),
    [user]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
