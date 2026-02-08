import { Animal, User, AdoptionRequest, Donation } from './types';

// Initial Mock Data
const INITIAL_ANIMALS: Animal[] = [
    {
        id: '1',
        name: 'Bella',
        species: 'Dog',
        breed: 'Golden Retriever',
        age: 2,
        gender: 'Female',
        status: 'AVAILABLE',
        location: 'Central Shelter',
        description: 'Friendly and energetic Golden Retriever who loves to play fetch.',
        images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'],
        medicalHistory: [],
        fee: 150
    },
    {
        id: '2',
        name: 'Oliver',
        species: 'Cat',
        breed: 'Siamese',
        age: 1,
        gender: 'Male',
        status: 'AVAILABLE',
        location: 'North Haven Rescue',
        description: 'Calm and affectionate Siamese cat looking for a quiet home.',
        images: ['https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=600&q=80'],
        medicalHistory: [],
        fee: 80
    },
    {
        id: '3',
        name: 'Max',
        species: 'Dog',
        breed: 'German Shepherd',
        age: 4,
        gender: 'Male',
        status: 'RESCUED',
        location: 'Westside Vet Clinic',
        description: 'Loyal companion, currently recovering from a minor leg injury.',
        images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80'],
        medicalHistory: [
            { id: 'm1', date: '2023-10-01', diagnosis: 'Leg Fracture', treatment: 'Splint and Rest', veterinarianName: 'Dr. Smith' }
        ],
        fee: 200
    }
];

const INITIAL_REQUESTS: AdoptionRequest[] = [];
const INITIAL_DONATIONS: Donation[] = [];

// Simple in-memory store that can be easily swapped for LocalStorage or API
class MockService {
    private animals: Animal[] = [...INITIAL_ANIMALS];
    private requests: AdoptionRequest[] = [...INITIAL_REQUESTS];
    private donations: Donation[] = [...INITIAL_DONATIONS];

    // Animal Methods
    getAnimals() {
        return this.animals;
    }

    getAnimalById(id: string) {
        return this.animals.find(a => a.id === id);
    }

    addAnimal(animal: Omit<Animal, 'id'>) {
        const newAnimal = { ...animal, id: Math.random().toString(36).substr(2, 9) };
        this.animals.push(newAnimal);
        return newAnimal;
    }

    updateAnimalStatus(id: string, status: Animal['status']) {
        const animal = this.animals.find(a => a.id === id);
        if (animal) {
            animal.status = status;
        }
        return animal;
    }

    updateAnimal(id: string, data: Partial<Animal>) {
        const index = this.animals.findIndex(a => a.id === id);
        if (index !== -1) {
            this.animals[index] = { ...this.animals[index], ...data };
            return this.animals[index];
        }
        return null;
    }

    // Adoption Methods
    submitAdoptionRequest(request: Omit<AdoptionRequest, 'id' | 'status' | 'applicationDate'>) {
        const newRequest: AdoptionRequest = {
            ...request,
            id: Math.random().toString(36).substr(2, 9),
            status: 'PENDING',
            applicationDate: new Date().toISOString().split('T')[0]
        };
        this.requests.push(newRequest);
        return newRequest;
    }

    getAdoptionRequests() {
        return this.requests;
    }

    updateRequestStatus(id: string, status: AdoptionRequest['status']) {
        const req = this.requests.find(r => r.id === id);
        if (req) {
            req.status = status;
            // If approved, update animal status
            if (status === 'APPROVED') {
                this.updateAnimalStatus(req.animalId, 'ADOPTED');
            }
        }
        return req;
    }

    // Donation Methods
    addDonation(donation: Omit<Donation, 'id' | 'date'>) {
        const newDonation: Donation = {
            ...donation,
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0]
        };
        this.donations.push(newDonation);
        return newDonation;
    }

    getDonations() {
        return this.donations;
    }
}

export const mockService = new MockService();
