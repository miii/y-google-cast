<script setup lang="ts">
import { GoogleCastProvider } from '@miii/y-google-cast'
import { doc, mutateState } from '../state'
import { debugProvider, log } from '../utils'

const receiverApplicationId = import.meta.env.VITE_CAST_APPLICATION_ID as string
const castProvider = new GoogleCastProvider(doc, 'sender', { receiverApplicationId })

const sendMessage = () => castProvider.sendMessage('Hello from sender')

castProvider.on('message', (message: string) => log('Got response from receiver:', message))
debugProvider(castProvider)
</script>
<template>
  <button @click="mutateState">Mutate state</button>
  <button @click="sendMessage">Send message</button>
</template>
<style>
button { margin: .5rem .5rem 0 0; }
</style>