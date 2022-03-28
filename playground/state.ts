import { ref } from 'vue'
import { Doc } from 'yjs'

// Yjs document
export const doc = new Doc()
// Example state
export const docArray = doc.getArray<number>('array')

// Track connected state
export const connected = ref(false)
// Sync reactive state to enable automatic DOM rendering
export const state = ref<number[]>([])
docArray.observe(() => state.value = docArray.toArray())

// Mutate
export const mutateState = () => docArray.insert(0, [Math.round(Math.random() * 100)])