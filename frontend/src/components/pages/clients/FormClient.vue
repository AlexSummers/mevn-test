<template>
  <VDialog
    :value="value"
    max-width="600px"
    @input="emitInputValue"
  >
    <template #activator="{ on, attrs }">
      <VBtn
        color="primary"
        dark
        class="mb-2"
        v-bind="attrs"
        v-on="on"
      >
        <VIcon left>
          mdi-plus
        </VIcon>
        New Client
      </VBtn>
    </template>
    <VCard>
      <VCardTitle>
        <span class="text-h5">{{ formTitle }}</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VTextField
            v-model="clientData.name"
            :error-messages="nameErrors"
            :counter="50"
            label="Name"
            required
            @input="$v.clientData.name.$touch()"
            @blur="$v.clientData.name.$touch()"
          />
          <VTextField
            v-model="clientData.email"
            :error-messages="emailErrors"
            :counter="50"
            label="E-mail"
            required
            @input="$v.clientData.email.$touch()"
            @blur="$v.clientData.email.$touch()"
          />
          <VTextField
            v-model="clientData.phone"
            :error-messages="phoneErrors"
            label="Phone"
            required
            @input="$v.clientData.phone.$touch()"
            @blur="$v.clientData.phone.$touch()"
          />
          <VTextField
            v-model="newProviderName"
            :error-messages="newProviderErrors"
            :counter="50"
            label="Providers"
          >
            <template #append>
              <VFadeTransition leave-absolute>
                <VProgressCircular
                  v-if="addProviderInProgress"
                  size="24"
                  color="info"
                  indeterminate
                />
              </VFadeTransition>
            </template>
            <template #append-outer>
              <VBtn
                large
                text
                color="primary"
                @click="saveNewProvider"
              >
                <VIcon left>
                  mdi-plus
                </VIcon>
                Add Provider
              </VBtn>
            </template>
          </VTextField>
          <VCard
            v-if="providers.length !== 0"
            class="elevation-0"
          >
            <VCardText>
              <VRow
                v-for="(provider, providerIndex) in providers"
                :key="provider.id"
                align="center"
              >
                <VTextField
                  v-model="provider.name"
                  :readonly="editedProviderIndex !== providerIndex"
                  :hint="editedProviderIndex === providerIndex ? 'Press Enter to save provider\'s name' : ''"
                  @blur="cancelEditProviderName(provider, providerIndex)"
                  @keypress.enter="saveEditedProvider(provider, providerIndex)"
                >
                  <template #prepend>
                    <VCheckbox
                      :input-value="clientData.providerIds.indexOf(provider.id) !== -1"
                      hide-details
                      class="shrink mr-2 mt-0"
                      @change="providerCheckboxInputHandler(provider)"
                    />
                  </template>
                  <template #append>
                    <VFadeTransition leave-absolute>
                      <VProgressCircular
                        v-if="editProviderInProgress && editedProviderIndex === providerIndex"
                        size="24"
                        color="info"
                        indeterminate
                      />
                    </VFadeTransition>
                    <VIcon
                      small
                      class="mr-2"
                      @click="editProviderName(provider, providerIndex)"
                    >
                      mdi-pencil
                    </VIcon>
                    <VIcon
                      small
                      @click="deleteProvider(provider, providerIndex)"
                    >
                      mdi-delete
                    </VIcon>
                  </template>
                </VTextField>
              </VRow>
            </VCardText>
          </VCard>
        </VContainer>
      </VCardText>
      <VCardActions>
        <VBtn
          v-if="!isCreation"
          color="red darken-1"
          text
          @click="initClientDeleteDialog"
        >
          Delete
        </VBtn>
        <VSpacer />
        <VBtn
          color="blue darken-1"
          text
          @click="closeForm"
        >
          Cancel
        </VBtn>
        <VBtn
          color="blue darken-1"
          text
          @click="saveClient"
        >
          <template v-if="!saveClientInProgress">
            Save
          </template>
          <VFadeTransition leave-absolute>
            <VProgressCircular
              v-if="saveClientInProgress"
              size="24"
              color="info"
              indeterminate
            />
          </VFadeTransition>
        </VBtn>
      </VCardActions>
    </VCard>
    <DeleteClientDialog
      v-model="dialogDeleteClient"
      :client="clientData"
      @request-error="turnOnErrorMessage"
      @deleted-client="deletedClientHandler"
    />
    <DeleteProviderDialog
      v-model="dialogDeleteProvider"
      :provider="providerToDelete"
      @request-error="turnOnErrorMessage"
      @deleted-provider="deletedProviderHandler"
    />
  </VDialog>
</template>
<script>
import { validationMixin } from 'vuelidate';
import {
  required,
  minLength,
  maxLength,
  email,
  numeric,
} from 'vuelidate/lib/validators';
import cloneDeep from 'lodash.clonedeep';
import DeleteClientDialog from './DeleteClientDialog.vue';
import DeleteProviderDialog from './DeleteProviderDialog.vue';

export default {
  components: {
    DeleteClientDialog,
    DeleteProviderDialog,
  },
  mixins: [validationMixin],
  validations: {
    newProviderName: { required, maxLength: maxLength(50) },
    clientData: {
      name: { required, maxLength: maxLength(50) },
      email: { required, email, maxLength: maxLength(50) },
      phone: {
        required,
        numeric,
        maxLength: maxLength(7),
        minLength: minLength(7),
      },
    },
  },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    clientData: {
      type: Object,
      required: true,
    },
    providers: {
      type: Array,
      required: true,
    },
    isCreation: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      newProviderName: '',
      providerToDelete: null,
      providerToEdit: null,
      addProviderInProgress: false,
      editProviderInProgress: false,
      saveClientInProgress: false,
      editedProviderIndex: -1,
      editedOldProviderName: '',
      dialogDeleteClient: false,
      dialogDeleteProvider: false,
    };
  },
  computed: {
    formTitle() {
      return this.isCreation ? 'New Client' : 'Edit Client';
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.clientData.name.$dirty) {
        return errors;
      }
      if (!this.$v.clientData.name.maxLength) {
        errors.push('Name must be at most 50 characters long.');
      }
      if (!this.$v.clientData.name.required) {
        errors.push('Name is required.');
      }
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.clientData.email.$dirty) {
        return errors;
      }
      if (!this.$v.clientData.email.maxLength) {
        errors.push('Name must be at most 50 characters long.');
      }
      if (!this.$v.clientData.email.email) {
        errors.push('Must be valid e-mail.');
      }
      if (!this.$v.clientData.email.required) {
        errors.push('E-mail is required.');
      }
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.clientData.phone.$dirty) {
        return errors;
      }
      if (!this.$v.clientData.phone.maxLength || !this.$v.clientData.phone.minLength) {
        errors.push('Phone must be at 7 characters long.');
      }
      if (!this.$v.clientData.phone.numeric) {
        errors.push('Followed only digits.');
      }
      if (!this.$v.clientData.phone.required) {
        errors.push('Phone is required.');
      }
      return errors;
    },
    newProviderErrors() {
      const errors = [];
      if (!this.$v.newProviderName.$dirty) {
        return errors;
      }
      if (!this.$v.newProviderName.maxLength) {
        errors.push('Provider name must be at most 50 characters long.');
      }
      if (!this.$v.newProviderName.required) {
        errors.push('Provider name is required.');
      }
      return errors;
    },
  },
  methods: {
    emitInputValue(value) {
      this.$emit('input', value);
    },
    closeForm() {
      this.$v.$reset();
      this.emitInputValue(false);
    },
    closeModalDeleteProvider() {
      this.dialogDeleteProvider = false;
      this.providerToDelete = null;
      this.providerToEdit = null;
    },
    deletedClientHandler() {
      this.$emit('deleted-client', this.clientData);
      this.closeForm();
    },
    deletedProviderHandler(providerData) {
      const providerIndex = this.clientData.providerIds.indexOf(providerData.id);
      if (providerIndex !== -1) {
        this.toggleClientsProvider(this.providerToDelete);
      }
      this.$emit('deleted-provider', providerData);
    },
    initClientDeleteDialog() {
      this.dialogDeleteClient = true;
    },
    async saveClient() {
      this.$v.clientData.$touch();
      if (this.$v.clientData.$invalid || this.saveClientInProgress) {
        return;
      }

      const requestParams = {
        name: this.clientData.name,
        email: this.clientData.email,
        phone: this.clientData.phone,
        providerIds: this.clientData.providerIds,
      };
      this.saveClientInProgress = true;
      try {
        if (this.isCreation) {
          const { data: response } = await this.$http.post('clients/create', requestParams);
          this.$emit('created-client', { id: response.id, ...cloneDeep(this.clientData) });
        } else {
          requestParams.id = this.clientData.id;
          await this.$http.post('clients/edit', requestParams);
          this.$emit('edited-client', cloneDeep(this.clientData));
        }
      } catch (err) {
        console.error(err);
        this.turnOnErrorMessage(err);
        this.saveClientInProgress = false;
        return;
      }
      this.saveClientInProgress = false;
      this.closeForm();
    },
    async saveNewProvider() {
      if (this.addProviderInProgress) {
        return;
      }
      this.$v.newProviderName.$touch();
      if (this.$v.newProviderName.$invalid) {
        return;
      }
      this.addProviderInProgress = true;
      try {
        const { data: response } = await this.$http.post('providers/create', { name: this.newProviderName });
        const newProvider = {
          id: response.id,
          name: response.name,
        };
        this.$emit('created-provider', newProvider);
        this.newProviderName = '';
        this.$v.newProviderName.$reset();
      } catch (err) {
        console.error(err);
        this.turnOnErrorMessage(err);
      }
      this.addProviderInProgress = false;
    },
    providerCheckboxInputHandler(providerData) {
      this.toggleClientsProvider(providerData);
    },
    toggleClientsProvider(providerData) {
      const providerIdIndex = this.clientData.providerIds.indexOf(providerData.id);
      const providerNameIndex = this.clientData.providerNames.indexOf(providerData.name);
      if (providerIdIndex === -1) {
        this.clientData.providerIds.push(providerData.id);
        this.clientData.providerNames.push(providerData.name);
      } else {
        this.clientData.providerIds.splice(providerIdIndex, 1);
        this.clientData.providerNames.splice(providerNameIndex, 1);
      }
    },
    editProviderName(provider, providerIndex) {
      this.editedOldProviderName = provider.name;
      this.editedProviderIndex = providerIndex;
    },
    cancelEditProviderName() {
      if (this.editedProviderIndex === -1) {
        return;
      }
      this.clearEditProviderForm();
    },
    clearEditProviderForm() {
      this.editedOldProviderName = '';
      this.editedProviderIndex = -1;
    },
    async saveEditedProvider(provider, providerIndex) {
      if (this.editedProviderIndex === -1 || this.editProviderInProgress) {
        return;
      }
      if (this.editedOldProviderName === provider.name.trim()) {
        this.clearEditProviderForm();
        return;
      }
      this.editProviderInProgress = true;
      try {
        await this.$http.post('providers/edit', { id: provider.id, name: provider.name });
      } catch (err) {
        console.error(err);
        this.editProviderInProgress = false;
        this.turnOnErrorMessage(err);
        return;
      }
      this.editProviderInProgress = false;
      const updatedProviderData = { ...provider, index: providerIndex };
      this.$emit('edited-provider', updatedProviderData);
      this.clearEditProviderForm();
    },
    deleteProvider(provider, providerIndex) {
      this.providerToDelete = { ...provider, index: providerIndex };
      this.dialogDeleteProvider = true;
    },
    turnOnErrorMessage(err) {
      this.$emit('request-error', err);
    },
  },
};
</script>
