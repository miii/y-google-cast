import { ref } from 'vue'

export interface Message {
  type: 'log' | 'info' | 'warn' | 'error'
  args: any[]
}

export const logs = ref<Message[]>([])

/**
 * Monkey-patch browser console to capture output
 */
export const patchConsole = () => {
  patchLog('log')
  patchLog('info')
  patchLog('warn')
  patchLog('error')
  window.addEventListener('error', error => logs.value.push({ type: 'error', args: [error.message] }))
}

/**
 * Patch console.* and capture output
 * @param key 
 * @returns 
 */
const patchLog = (key: Message['type']) => {
  const f = console[key] as Function
  const pf = (...args: any[]) => {
    logs.value.push({ type: key, args })
    if (f) f(...args)
  }
  
  console[key] = pf
}