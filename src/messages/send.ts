import { writeSyncStep1, writeUpdate } from 'y-protocols/sync'
import * as awarenessProtocol from 'y-protocols/awareness'

import { GoogleCastProvider } from '../provider'
import { encodeMessage, MessageType } from './utils'

type SyncStep = 'step1' | 'update'

/**
 * Send sync message to peer(s)
 * @param provider Cast provider
 * @param syncStep Current sync step
 */
function sendSyncMessage (provider: GoogleCastProvider, syncStep: 'step1'): void;
function sendSyncMessage (provider: GoogleCastProvider, syncStep: 'update', data: Uint8Array): void;
function sendSyncMessage (provider: GoogleCastProvider, syncStep: SyncStep, data?: Uint8Array) {
  // Create sync message
  const { encoder, getMessageBuffer } = encodeMessage(MessageType.SYNC)

  // Add message payload
  if (syncStep === 'step1')
    writeSyncStep1(encoder, provider.doc)
  else if (syncStep === 'update')
    writeUpdate(encoder, data!)

  // Send message
  const message = getMessageBuffer()
  sendMessage(provider, message!)
}

/**
 * Send awareness message to peer(s)
 * @param provider Cast provider
 * @param clients Known clients
 */
function sendAwarenessMessage (provider: GoogleCastProvider, clients: number[]) {
  const { addMessagePayload, getMessageBuffer } = encodeMessage(MessageType.AWARENESS)
  addMessagePayload(awarenessProtocol.encodeAwarenessUpdate(provider.awareness, clients))

  // Send message
  const message = getMessageBuffer()
  sendMessage(provider, message!)
}

/**
 * Send custom message via the cast provider
 * @param provider Cast provider
 * @param data Custom message data
 */
export const sendCustomMessage = <T extends Object>(provider: GoogleCastProvider, data: T) => {
  const { getMessageBuffer, addCustomMessagePayload } = encodeMessage(MessageType.CUSTOM)
  addCustomMessagePayload(data)
  
  // Send message
  const message = getMessageBuffer()
  sendMessage(provider, message!)
}

/**
 * Send message using cast manager
 * @param provider Cast provider
 * @param message Message buffer
 */
export const sendMessage = (provider: GoogleCastProvider, message: Uint8Array) => {
  if (provider.cast.connected)
    provider.cast.sendMessage(message)
}

export { sendSyncMessage, sendAwarenessMessage }