import { apiClient } from '../api/client';

export interface Pet {
  id?: number;
  cliente_id: number;
  nome_pet: string;
  especie: string;
  raca: string;
  porte: string;
  data_aniversario: string;
  idade: number;
}

export interface CreatePetResponse {
  message: string;
  id_pet: number;
}

class PetsService {
  // Criar um novo pet
  async createPet(pet: Omit<Pet, 'id'>): Promise<CreatePetResponse> {
    try {
      console.log('[PetsService] Criando pet:', pet);
      const response = await apiClient.post<CreatePetResponse>('/api/pets', pet);
      console.log('[PetsService] Pet criado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pet:', error);
      throw new Error('Erro ao criar pet');
    }
  }

  // Buscar pets de um cliente
  async getPetsByCliente(clienteId: number): Promise<Pet[]> {
    try {
      console.log('[PetsService] Buscando pets do cliente:', clienteId);
      const response = await apiClient.get<Pet[]>(`/api/clientes/${clienteId}/pets`);
      console.log('[PetsService] Pets encontrados:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pets:', error);
      throw new Error('Erro ao carregar pets');
    }
  }
}

export const petsService = new PetsService();