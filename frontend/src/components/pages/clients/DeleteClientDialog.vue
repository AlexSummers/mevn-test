<template>
  <VDialog
    :value="value"
    max-width="600px"
    @input="emitInputValue"
  >
    <VCard>
      <VCardTitle class="text-h5">
        Are you sure you want to delete this client?
      </VCardTitle>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue darken-1"
          text
          @click="closeDialog"
        >
          Cancel
        </VBtn>
        <VBtn
          color="blue darken-1"
          text
          @click="deleteClientConfirm"
        >
          <template v-if="!deleteClientInProgress">
            OK
          </template>
          <VFadeTransition leave-absolute>
            <VProgressCircular
              v-if="deleteClientInProgress"
              size="24"
              color="info"
              indeterminate
            />
          </VFadeTransition>
        </VBtn>
        <VSpacer />
      </VCardActions>
    </VCard>
  </VDialog>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    client: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleteClientInProgress: false,
    };
  },
  methods: {
    closeDialog() {
      this.emitInputValue(false);
    },
    emitInputValue(value) {
      this.$emit('input', value);
    },
    async deleteClientConfirm() {
      if (this.deleteClientInProgress) {
        return;
      }
      this.deleteClientInProgress = true;
      try {
        await this.$http.post('clients/delete', { id: this.client.id });
      } catch (err) {
        console.error(err);
        this.$emit('request-error', err);
        this.deleteClientInProgress = false;
        return;
      }
      this.deleteClientInProgress = false;
      this.$emit('deleted-client', this.client);
      this.closeDialog();
    },
  },
};
</script>
