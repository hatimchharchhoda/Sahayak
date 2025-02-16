// Service related types
export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  categoryName: string;
  categoryId: string;
}

// Props types for components
export interface ServiceCardProps {
  service: Service;
  categoryId: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

// API response types
export interface ServiceResponse {
  success: boolean;
  data: Service[];
}

export interface SingleServiceResponse {
  success: boolean;
  data: Service;
}

export interface Category {
  name: string;
  id: string;
}

export interface User {
  id: string;
  role: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  specialization?: string;
}

export interface BookedService {
  id: string;
  userId: string;
  serviceId: string;
  providerId: string | null;
  serviceCategoryId: string;
  date: string;
  status: string;
  basePrice: number | null;
  Service: {
    name: string;
    description: string;
  };
  User: {
    name: string;
    address: string;
  };
}

export interface BookedServicesListProps {
  bookedServices: BookedService[];
}

export interface ServiceDetails {
  id: string;
  userId: string;
  serviceId: string;
  providerId: string | null;
  serviceCategoryId: string;
  date: string;
  status: string;
  basePrice: number | null;
  User: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export interface Category {
  name: string;
  id: string;
  icon: React.ElementType;
}

export interface Review {
  id: string;
  stars: number;
  review: string | null;
  User: {
    name: string;
  };
}
