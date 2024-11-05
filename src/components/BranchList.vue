<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between mb-6">
      <h1 class="text-2xl font-bold">Restaurant Branches</h1>
      <div class="space-x-4">
        <button
          @click="openAddBranchModal"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          :disabled="loading"
        >
          Add Branches
        </button>
        <button
          @click="confirmDisableAll"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          :disabled="loading || !reservationBranches.length"
        >
          Disable Reservations
        </button>
      </div>
    </div>

    <loading-spinner v-if="loading" />

    <template v-else>
      <div v-if="!reservationBranches.length" class="text-center py-8">
        <p class="text-gray-500">No branches with reservations enabled.</p>
        <button
          @click="openAddBranchModal"
          class="mt-4 text-blue-500 hover:text-blue-700"
        >
          Enable reservations for branches
        </button>
      </div>

      <table v-else class="w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-6 py-3 text-left">Branch Name</th>
            <th class="px-6 py-3 text-left">Reference</th>
            <th class="px-6 py-3 text-left">Tables with Reservations</th>
            <th class="px-6 py-3 text-left">Reservation Duration</th>
            <th class="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="branch in reservationBranches"
            :key="branch.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-6 py-4">{{ branch.name }}</td>
            <td class="px-6 py-4">{{ branch.reference }}</td>
            <td class="px-6 py-4">{{ getReservationTablesCount(branch) }}</td>
            <td class="px-6 py-4">{{ branch.reservation_duration }} minutes</td>
            <td class="px-6 py-4">
              <button
                @click="openSettingsModal(branch)"
                class="text-blue-500 hover:text-blue-700"
              >
                Settings
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- Add Branch Modal -->
    <modal
      v-if="showAddBranchModal"
      @close="closeAddBranchModal"
      :loading="loading"
    >
      <template #header>Add Branches</template>
      <template #body>
        <div v-if="!nonReservationBranches.length" class="text-center py-4">
          <p class="text-gray-500">No branches available to add.</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="branch in nonReservationBranches" :key="branch.id">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                v-model="selectedBranches"
                :value="branch.id"
                class="form-checkbox"
                :disabled="loading"
              >
              <span>{{ branch.name }}</span>
            </label>
          </div>
        </div>
      </template>
      <template #footer>
        <button
          @click="enableReservations"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          :disabled="loading || !selectedBranches.length"
        >
          Save
        </button>
      </template>
    </modal>

    <!-- Settings Modal -->
    <modal
      v-if="showSettingsModal"
      @close="closeSettingsModal"
      :loading="loading"
    >
      <template #header>Branch Settings - {{ selectedBranch?.name }}</template>
      <template #body>
        <branch-settings-form
          v-if="selectedBranch"
          :branch="selectedBranch"
          :loading="loading"
          @save="saveSettings"
        />
      </template>
    </modal>

    <!-- Confirmation Modal -->
    <modal
      v-if="showConfirmModal"
      @close="closeConfirmModal"
      :loading="loading"
    >
      <template #header>Confirm Action</template>
      <template #body>
        <p class="text-gray-700">
          Are you sure you want to disable reservations for all branches?
          This action cannot be undone.
        </p>
      </template>
      <template #footer>
        <button
          @click="disableAllReservations"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          :disabled="loading"
        >
          Confirm
        </button>
      </template>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState, mapGetters } from 'vuex';
import Modal from './Modal.vue';
import BranchSettingsForm from './BranchSettingsForm.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import { Branch } from '@/types';

@Component({
  components: {
    Modal,
    BranchSettingsForm,
    LoadingSpinner
  },
  computed: {
    ...mapState(['loading']),
    ...mapGetters(['reservationBranches', 'nonReservationBranches'])
  }
})
export default class BranchList extends Vue {
  showAddBranchModal = false;
  showSettingsModal = false;
  showConfirmModal = false;
  selectedBranches: string[] = [];
  selectedBranch: Branch | null = null;

  async created() {
    await this.$store.dispatch('fetchBranches');
  }
  getReservationTablesCount(branch: Branch): number {
    return branch?.sections?.reduce((count, section) => {
      return count + section.tables.filter(table => table.accepts_reservations).length;
    }, 0);
  }

  openAddBranchModal() {
    this.showAddBranchModal = true;
  }

  closeAddBranchModal() {
    this.showAddBranchModal = false;
    this.selectedBranches = [];
  }

  async enableReservations() {
    try {
      await Promise.all(
        this.selectedBranches?.map(branchId =>
          this.$store.dispatch('updateBranch', {
            branchId,
            data: { accepts_reservations: true }
          })
        )
      );
      this.closeAddBranchModal();
    } catch (error) {
      this.$store.commit('SET_ERROR', 'Failed to enable reservations');
    }
  }

  openSettingsModal(branch: Branch) {
    console.log("🚀 ~ BranchList ~ openSettingsModal ~ branch:", branch)
    this.selectedBranch = branch;
    this.showSettingsModal = true;
  }

  closeSettingsModal() {
    this.showSettingsModal = false;
    this.selectedBranch = null;
  }

  confirmDisableAll() {
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  async disableAllReservations() {
    try {
      await this.$store.dispatch('disableAllReservations');
      this.closeConfirmModal();
    } catch (error) {
      this.$store.commit('SET_ERROR', 'Failed to disable reservations');
    }
  }

  async saveSettings(updatedBranch: Branch) {
    try {
      await this.$store.dispatch('updateBranch', {
        branchId: updatedBranch.id,
        data: updatedBranch
      });
      this.closeSettingsModal();
    } catch (error) {
      this.$store.commit('SET_ERROR', 'Failed to save branch settings');
    }
  }
}

</script>