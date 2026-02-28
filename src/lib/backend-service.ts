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

    async addAnimal(animal: Omit<Animal, 'id' | 'medicalRecords'>) {
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

    // Rescue Requests Methods
    async submitRescueRequest(request: { petName?: string; species: string; breed: string; location: string; description: string; image?: string }) {
        const res = await fetch('/api/rescue-requests', {
            method: 'POST',
            body: JSON.stringify(request),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('Failed to submit rescue request');
        return res.json();
    }

    async getRescueRequests() {
        const res = await fetch('/api/rescue-requests');
        if (!res.ok) throw new Error('Failed to fetch rescue requests');
        return res.json();
    }

    async updateRescueRequestStatus(id: string, status: 'APPROVED' | 'REJECTED') {
        const res = await fetch(`/api/rescue-requests/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('Failed to update rescue request status');
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

    async deleteMedicalRecord(id: string) {
        const res = await fetch(`/api/medical-records/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete medical record');
        return res.json();
    }

    // Notification Methods
    async getNotifications() {
        const res = await fetch('/api/notifications');
        return res.json();
    }

    // Product Methods
    async getProducts(view?: 'public') {
        const url = view ? `/api/products?view=${view}` : '/api/products';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
    }

    async addProduct(product: { name: string, price: number, image: string, stock?: number }) {
        const res = await fetch('/api/products', {
            method: 'POST',
            body: JSON.stringify(product),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('Failed to add product');
        return res.json();
    }

    async deleteProduct(id: number) {
        const res = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to delete product');
        return res.json();
    }

    async purchaseProducts(items: { id: number, quantity: number }[]) {
        const res = await fetch('/api/products/purchase', {
            method: 'POST',
            body: JSON.stringify({ items }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to complete purchase');
        }
        return res.json();
    }

    // Favorites Methods
    async toggleFavorite(animalId: string) {
        const res = await fetch('/api/favorites', {
            method: 'POST',
            body: JSON.stringify({ animalId }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) throw new Error('Failed to toggle favorite');
        return res.json();
    }

    async getFavorites() {
        const res = await fetch('/api/favorites');
        if (res.status === 401) return [];
        if (!res.ok) throw new Error('Failed to fetch favorites');
        return res.json();
    }

    // User Management Methods
    async getUsers() {
        const res = await fetch('/api/admin/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    }

    async createUser(userData: any) {
        const res = await fetch('/api/admin/users', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to create user');
        }
        return res.json();
    }
}



export const backendService = new BackendService();
