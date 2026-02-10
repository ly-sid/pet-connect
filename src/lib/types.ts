export type UserRole = 'ADMIN' | 'RESCUE' | 'VET' | 'USER' | 'DONOR' | 'ADVERTISER';

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
    medicalHistory: MedicalRecord[];
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
