<script setup lang="ts">
import { GoogleCastProvider } from '@miii/y-google-cast'
import { doc } from '../state'
import { debugProvider, log } from '../utils'

const castProvider = new GoogleCastProvider(doc, 'receiver')

// Debug events
debugProvider(castProvider)

// Receive and reply to incoming messages
castProvider.on('message', (message: string) => {
  log('Got message from sender:', message)
  castProvider.sendMessage(`Hello from receiver`)
})
</script>
<template></template>