import axios from 'axios';
import { Branch } from '@/types';


const api = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.VUE_APP_API_TOKEN}`
  }
});

export const branchService = {
  async getBranches(): Promise<Branch[]> {
    const response = await api.get('/api/branches?include[0]=sections&include[1]=sections.tables');
    return response.data.data;
  },

  async updateBranch(branchId: string, data: Partial<Branch>): Promise<Branch> {
    const response = await api.put(`/api/branches/${branchId}`, data);
    return response.data.data;
  },

  async disableAllReservations(branches: Branch[]): Promise<void> {
    await Promise.all(
      branches.map(branch =>
        this.updateBranch(branch.id, { accepts_reservations: false })
      )
    );
  }
};