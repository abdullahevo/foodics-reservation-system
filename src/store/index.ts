import Vue from 'vue';
import Vuex from 'vuex';
import { Branch } from '@/types';
import { branchService } from '@/api/branchService';

Vue.use(Vuex);

interface State {
  branches: Branch[];
  loading: boolean;
  error: string | null;
}

export default new Vuex.Store({
  state: {
    branches: [],
    loading: false,
    error: null
  } as State,

  mutations: {
    SET_BRANCHES(state, branches: Branch[]) {
      state.branches = branches;
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },
    SET_ERROR(state, error: string | null) {
      state.error = error;
    }
  },

  actions: {
    async fetchBranches({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const branches = await branchService.getBranches();
        console.log("🚀 ~ fetchBranches ~ branches:", branches)
        commit('SET_BRANCHES', branches);
      } catch (error) {
        commit('SET_ERROR', 'Failed to fetch branches');
        console.error('Error fetching branches:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateBranch({ dispatch }, { branchId, data }: { branchId: string; data: Partial<Branch> }) {
      try {
        await branchService.updateBranch(branchId, data);
        await dispatch('fetchBranches');
      } catch (error) {
        console.error('Error updating branch:', error);
        throw error;
      }
    },

    async disableAllReservations({ state, dispatch }) {
      try {
        const reservationBranches = state.branches.filter(b => b.accepts_reservations);
        await branchService.disableAllReservations(reservationBranches);
        await dispatch('fetchBranches');
      } catch (error) {
        console.error('Error disabling reservations:', error);
        throw error;
      }
    }
  },

  getters: {
    reservationBranches: state => state.branches.filter(b => b.accepts_reservations),
    nonReservationBranches: state => state.branches.filter(b => !b.accepts_reservations)
  }
});