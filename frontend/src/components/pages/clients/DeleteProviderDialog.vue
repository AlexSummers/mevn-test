<template>
  <VDialog
    :value="value"
    max-width="600px"
    @input="emitInputValue"
  >
    <VCard>
      <VCardTitle class="text-h5">
        Are you sure you want to delete this provider?
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
          @click="deleteProviderConfirm"
        >
          <template v-if="!deleteProviderInProgress">
            OK
          </template>
          <VFadeTransition leave-absolute>
            <VProgressCircular
              v-if="deleteProviderInProgress"
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
    provider: {
      required: true,
      validator: (item) => typeof item === 'object' || item === null,
    },
  },
  data() {
    return {
      deleteProviderInProgress: false,
    };
  },
  methods: {
    closeDialog() {
      this.emitInputValue(false);
    },
    emitInputValue(value) {
      this.$emit('input', value);
    },
    async deleteProviderConfirm() {
      if (this.deleteProviderInProgress || this.provider === null) {
        return;
      }
      this.deleteProviderInProgress = true;
      try {
        await this.$http.post('providers/delete', { id: this.provider.id });
      } catch (err) {
        console.error(err);
        this.$emit('request-error', err);
        this.deleteProviderInProgress = false;
        return;
      }
      this.deleteProviderInProgress = false;
      this.$emit('deleted-provider', this.provider);
      this.closeDialog();
    },
  },
};
</script>
