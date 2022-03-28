<script setup lang="ts">
const receiverMode = location.pathname === '/receiver'
</script>
<template>
  <span class="statusbar">
    <ConnectionBadge />
    <span v-if="receiverMode">Receiver mode</span>
    <span v-else>Sender mode</span>
  </span>
  <div>
    <slot name="receiver" v-if="receiverMode" />
    <slot name="sender" v-else />
  </div>
</template>
<style>
.statusbar {
  position: fixed;
  bottom: 0;
  right: 0;
  font-family: monospace;
}

.statusbar span {
  padding: 5px 10px;
  display: inline-block;
  background: #333;
}
</style>