import * as syncProtocol from 'y-protocols/sync'
import * as awarenessProtocol from 'y-protocols/awareness'

import { GoogleCastProvider } from '../provider'
import { decodeMessage, encodeMessage, MessageType } from './utils'
import { sendMessage } from './send'

/**
 * Read incoming message from peer
 * @param provider Cast provider
 * @param messageBuffer Message buffer
 * @returns {Uint8Array} Possible response message buffer
 */
export const readMessage = (provider: GoogleCastProvider, messageBuffer: Uint8Array) => {
  const { messageType } = decodeMessage(messageBuffer)

  // Resolve sync messages
  if (messageType === MessageType.SYNC)
    return readSyncMessage(provider, messageBuffer)
  else if (messageType === MessageType.AWARENESS)
    return readAwarenessMessage(provider, messageBuffer)
  else if (messageType === MessageType.CUSTOM)
    return readCustomMessage(provider, messageBuffer)
  else
    console.error('Unable to decode message')
}

/**
 * Read sync message and return prepared response
 * @param provider Cast provider
 * @param messageBuffer Message buffer
 */
const readSyncMessage = (provider: GoogleCastProvider, messageBuffer: Uint8Array) => {
  const { decoder } = decodeMessage(messageBuffer)
  const { encoder, getMessageBuffer, messageBufferLength } = encodeMessage(MessageType.SYNC)
  const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, provider.doc, provider)

  // Set synced state if needed
  if (syncMessageType === syncProtocol.messageYjsSyncStep2 && !provider.synced)
    provider.synced = true

  // Send possible response
  if (messageBufferLength() > 1)
    sendMessage(provider, getMessageBuffer())
}

/**
 * Read awareness message
 * @param provider Cast provider
 * @param messageBuffer Message buffer
 */
const readAwarenessMessage = (provider: GoogleCastProvider, messageBuffer: Uint8Array) => {
  const { getMessagePayload } = decodeMessage(messageBuffer)
  const awarenessState = getMessagePayload()

  awarenessProtocol.applyAwarenessUpdate(provider.awareness, awarenessState, provider)
}

/**
 * Read custom message sent via the cast provider
 * @param provider Cast provider
 * @param messageBuffer Message buffer
 */
const readCustomMessage = (provider: GoogleCastProvider, messageBuffer: Uint8Array) => {
  const { getCustomMessagePayload } = decodeMessage(messageBuffer)
  let message = getCustomMessagePayload()

  // Emit message event
  provider.emit('message', [message])
}