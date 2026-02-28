export type UserRole = 'ADMIN' | 'RESCUE' | 'VET' | 'USER' | 'ADVERTISER';

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface MedicalRecord {
    id: string;
    date: string;
    diagnosis: string;
    treatment: string;
    veterinarianName: string;
}

export interface Animal {
    id: string;
    name: string;
    species: string; // Dog, Cat, etc.
    breed: string;
    age: number; // in years
    gender: 'Male' | 'Female';
    status: 'AVAILABLE' | 'ADOPTED' | 'PENDING' | 'RESCUED';
    location: string;
    description: string;
    images: string[];
    medicalRecords: MedicalRecord[];
    fee: number;
    createdAt: string;
    updatedAt: string;
}

export interface AdoptionRequest {
    id: string;
    animalId: string;
    userId: string;
    userName: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    applicationDate: string;
    message: string;
}

export interface RescueRequest {
    id: string;
    userId: string;
    petName: string;
    species: string;
    breed: string;
    location: string;
    description: string;
    image?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
}

export interface Donation {
    id: string;
    userId: string;
    amount: number;
    message?: string;
    date: string;
    type: 'ONE_TIME' | 'MONTHLY';
    targetRaw?: string; // "General" or Animal Name
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    stock: number;
}
