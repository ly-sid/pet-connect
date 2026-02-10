import { Animal, AdoptionRequest, Donation } from './types';

class BackendService {
    // Animal Methods
    async getAnimals(species?: string) {
        const url = species && species !== 'All' ? `/api/animals?species=${species}` : '/api/animals';
        const res = await fetch(url);
        return res.json();
    }

    async getAnimalById(id: string) {
        const res = await fetch(`/api/animals/${id}`);
        if (!res.ok) return null;
        return res.json();
    }

    async addAnimal(animal: Omit<Animal, 'id' | 'medicalHistory'>) {
        const res = await fetch('/api/animals', {
            method: 'POST',
            body: JSON.stringify(animal),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
            const text = await res.text();
            console.error('Failed to add animal:', text);
            throw new Error(`Failed to add animal: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    async updateAnimal(id: string, data: Partial<Animal>) {
        const res = await fetch(`/api/animals/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
            const text = await res.text();
            console.error('Failed to update animal:', text);
            throw new Error(`Failed to update animal: ${res.status} ${res.statusText}`);
        }
        return res.json();
    }

    // Adoption Methods
    async submitAdoptionRequest(request: { animalId: string, message: string }) {
        const res = await fetch('/api/adoption-requests', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: { 'Content-Type': 'application/json' }
        });
        return res.json();
    }

    async getAdoptionRequests() {
        const res = await fetch('/api/adoption-requests');
        return res.json();
    }

    async updateRequestStatus(id: string, status: 'APPROVED' | 'REJECTED') {
        const res = await fetch(`/api/adoption-requests/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
            headers: { 'Content-Type': 'application/json' }
        });
        return res.json();
    }


    // Donation Methods
    async addDonation(donation: Omit<Donation, 'id' | 'date' | 'userId'>) {
        const res = await fetch('/api/donations', {
            method: 'POST',
            body: JSON.stringify(donation),
            headers: { 'Content-Type': 'application/json' }
        });
        return res.json();
    }

    async getDonations() {
        const res = await fetch('/api/donations');
        return res.json();
    }

    async addMedicalRecord(record: { animalId: string, diagnosis: string, treatment: string, veterinarianName: string }) {
        const res = await fetch('/api/medical-records', {
            method: 'POST',
            body: JSON.stringify(record),
            headers: { 'Content-Type': 'application/json' }
        });
        return res.json();
    }

    async getDashboardStats() {
        const res = await fetch('/api/dashboard/stats');
        return res.json();
    }

    // Notification Methods
    async getNotifications() {
        const res = await fetch('/api/notifications');
        return res.json();
    }
}



export const backendService = new BackendService();
