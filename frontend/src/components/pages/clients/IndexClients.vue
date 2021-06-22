<template>
  <VContainer fluid>
    <VCard>
      <VDataTable
        :headers="headers"
        :items="clients"
        :loading="loadClientsInProgress"
        loading-text="Loading... Please wait"
        sort-by="name"
        class="elevation-1"
      >
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>Clients</VToolbarTitle>
            <VDivider
              class="mx-4"
              inset
              vertical
            />
            <VSpacer />
            <FormClient
              v-model="dialogCreateEdit"
              :client-data="editedClient"
              :providers="providers"
              :is-creation="editedClientIndex === -1"
              @created-client="createdClientHandler"
              @edited-client="editedClientHandler"
              @deleted-client="deletedClientHandler"
              @created-provider="createdProviderHandler"
              @edited-provider="editedProviderHandler"
              @deleted-provider="deletedProviderHandler"
            />
          </VToolbar>
        </template>
        <template #item.actions="{ item }">
          <VIcon
            small
            class="mr-2"
            @click="initClientEditForm(item)"
          >
            mdi-pencil
          </VIcon>
          <VIcon
            small
            @click="initClientDeleteDialog(item)"
          >
            mdi-delete
          </VIcon>
        </template>
        <template #no-data>
          <VBtn
            color="primary"
            @click="loadClients"
          >
            Reload
          </VBtn>
        </template>
      </VDataTable>
      <DeleteClientDialog
        v-model="dialogDeleteClient"
        :client="editedClient"
        @request-error="turnOnErrorMessage"
        @deleted-client="deletedClientHandler"
      />
      <VSnackbar
        v-model="errorMsgEnabled"
        :timeout="5000"
      >
        Request is failed. Please try again.
        <template #action="{ attrs }">
          <VBtn
            color="blue"
            text
            v-bind="attrs"
            @click="errorMsgEnabled = false"
          >
            Close
          </VBtn>
        </template>
      </VSnackbar>
    </VCard>
  </VContainer>
</template>
<script>
import cloneDeep from 'lodash.clonedeep';
import FormClient from './FormClient.vue';
import DeleteClientDialog from './DeleteClientDialog.vue';

export default {
  components: {
    FormClient,
    DeleteClientDialog,
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'name',
        },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Providers', value: 'providerNames', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      clients: [],
      providers: [],
      loadClientsInProgress: false,
      editedClientIndex: -1,
      editedClient: {
        name: '',
        email: '',
        phone: '',
        providerIds: [],
        providerNames: [],
      },
      dialogCreateEdit: false,
      dialogDeleteClient: false,
      errorMsgEnabled: false,
    };
  },
  watch: {
    dialogCreateEdit(value) {
      if (!value) {
        this.closeModalEditCreate();
      }
    },
    dialogDeleteClient(value) {
      if (!value) {
        this.closeModalDeleteClient();
      }
    },
    dialogDeleteProvider(value) {
      if (!value) {
        this.closeModalDeleteProvider();
      }
    },
  },
  created() {
    this.loadClients();
  },
  methods: {
    closeModalEditCreate() {
      this.dialogCreateEdit = false;
      this.clearCreateEditForm();
    },
    closeModalDeleteClient() {
      this.dialogDeleteClient = false;
      this.clearCreateEditForm();
    },
    clearCreateEditForm() {
      this.$nextTick(() => {
        this.editedClient = {
          name: '',
          email: '',
          phone: '',
          providerIds: [],
          providerNames: [],
        };
        this.editedClientIndex = -1;
      });
    },
    async loadClients() {
      if (this.loadClientsInProgress) {
        return;
      }
      this.loadClientsInProgress = true;
      try {
        const { data: response } = await this.$http.get('clients/list');

        this.providers = response.providers;
        this.clients = response.clients.map((clientData) => {
          const providerIds = clientData.providers.map((provider) => provider.id);
          const providerNames = [];
          this.providers.forEach((provider) => {
            if (providerIds.indexOf(provider.id) !== -1) {
              providerNames.push(provider.name);
            }
          });
          return {
            id: clientData.id,
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone,
            providerIds,
            providerNames,
          };
        });
      } catch (err) {
        console.error(err);
        this.turnOnErrorMessage();
      }
      this.loadClientsInProgress = false;
    },
    createdClientHandler(client) {
      this.clients.push(client);
    },
    editedClientHandler(client) {
      this.$set(this.clients, this.editedClientIndex, client);
    },
    deletedClientHandler() {
      this.clients.splice(this.editedClientIndex, 1);
      this.closeModalDeleteClient();
    },
    initClientEditForm(client) {
      this.editedClientIndex = this.clients.indexOf(client);
      this.editedClient = cloneDeep(client);
      this.dialogCreateEdit = true;
    },
    initClientDeleteDialog(client) {
      this.editedClientIndex = this.clients.indexOf(client);
      this.editedClient = cloneDeep(client);
      this.dialogDeleteClient = true;
    },
    createdProviderHandler(provider) {
      this.providers.push(provider);
    },
    editedProviderHandler(providerData) {
      this.$set(this.providers, providerData.index, { id: providerData.id, name: providerData.name });
      this.$nextTick(() => {
        this.renameEditedProviderFromClients();
      });
    },
    deletedProviderHandler(providerData) {
      this.providers.splice(providerData.index, 1);
      this.removeDeletedProviderFromClients(providerData);
    },
    removeDeletedProviderFromClients(providerData) {
      this.clients = this.clients.map((client) => {
        const clientData = cloneDeep(client);
        const providerIdIndex = clientData.providerIds.indexOf(providerData.id);
        const providerNameIndex = clientData.providerNames.indexOf(providerData.name);
        if (providerIdIndex !== -1) {
          clientData.providerIds.splice(providerIdIndex, 1);
          clientData.providerNames.splice(providerNameIndex, 1);
        }
        return clientData;
      });
    },
    renameEditedProviderFromClients() {
      const providerNamesByIds = {};
      this.providers.forEach((provider) => {
        providerNamesByIds[provider.id] = provider.name;
      });
      this.clients = this.clients.map((client) => {
        const clientData = cloneDeep(client);
        const providerNames = [];
        clientData.providerIds.forEach((providerId) => {
          if (Object.keys(providerNamesByIds).indexOf(providerId) !== -1) {
            providerNames.push(providerNamesByIds[providerId]);
          }
        });
        clientData.providerNames = providerNames;
        return clientData;
      });
      if (this.editedClientIndex !== -1) {
        const editedClientProviderNames = [];
        this.editedClient.providerIds.forEach((providerId) => {
          if (Object.keys(providerNamesByIds).indexOf(providerId) !== -1) {
            editedClientProviderNames.push(providerNamesByIds[providerId]);
          }
        });
        this.$set(this.editedClient, 'providerNames', editedClientProviderNames);
      }
    },
    turnOnErrorMessage() {
      this.errorMsgEnabled = true;
    },
  },
};
</script>
