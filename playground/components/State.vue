<script setup lang="ts">
import { state } from '../state'
</script>
<template>
  <section class="state">
    <strong>Local state:</strong>
    {{ state }}
  </section>
</template>
<style>
.state { margin: .5rem 0; }
</style>