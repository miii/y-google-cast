<script setup lang="ts">
import { connected } from '../state'
</script>
<template>
  <span class="connected" v-if="connected">Connected</span>
  <span class="disconnected" v-else>Disconnected</span>
</template>
<style scoped>
.connected { background: #059669 }
.disconnected { background: #e11d48 }
</style>