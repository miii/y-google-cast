<script setup lang="ts">
import { watch } from 'vue'
import { logs } from './state'
import type { Message } from './state'

const colorByType = (type: Message['type']) => {
  if (type === 'error') return 'red'
  if (type === 'warn') return 'orange'
}

watch(logs, () => window.scrollTo(0, document.body.scrollHeight), { deep: true, flush: 'post' })
</script>
<template>
  <div class="console">
    <strong>Console log:</strong>
    <div v-for="log in logs">
      <span v-for="arg in log.args" :style="{ color: colorByType(log.type) }">{{ arg }}&nbsp;</span>
    </div>
  </div>
</template>
<style>
.console { margin: .5rem 0; }
</style>