import { GoogleCastProvider } from '@miii/y-google-cast'
import { connected } from './state'

/**
 * Log with prefix
 * @param args Args passed to console.log
 */
export const log = (...args: any[]) => {
  console.log('[y-google-cast]', ...args)
}

/**
 * Log events emitted by the provider
 * @param castProvider Cast provider
 */
export const debugProvider = (castProvider: GoogleCastProvider) => {
  castProvider.on('ready', () => log('Cast SDK is ready, cast the page to try it out!'))
  castProvider.on('connected', () => log('Cast connected'))
  castProvider.on('disconnected', () => log('Cast disconnected'))
  castProvider.on('synced', (synced: boolean) => synced ? log('Sync is active') : log('Sync is inactive'))

  castProvider.on('connected', () => connected.value = true)
  castProvider.on('disconnected', () => connected.value = false)
}