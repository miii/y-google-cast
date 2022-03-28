import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'

/**
 * Each message is prefixed with a message type
 */
export enum MessageType {
  /**
   * Y.Doc sync messages
   */
  SYNC = 0,
  /**
   * Awareness updates
   */
  AWARENESS = 1,
  /**
   * Custom messages
   */
  CUSTOM = 2,
}

/**
 * Encode new message
 * @param messageType Message type
 */
export const encodeMessage = (messageType: MessageType) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageType)
  
  const messageBufferLength = () => encoding.length(encoder)
  const getMessageBuffer = () => encoding.toUint8Array(encoder)

  const addMessagePayload = (bytes: number | Uint8Array) => {
    if (typeof bytes === 'number')
      return encoding.writeVarUint(encoder, bytes)
    else
      return encoding.writeVarUint8Array(encoder, bytes)
  }
  const addCustomMessagePayload = (payload: any) => encoding.writeVarString(encoder, JSON.stringify(payload))

  return {
    encoder,
    getMessageBuffer,
    addMessagePayload,
    addCustomMessagePayload,
    messageBufferLength,
  }
}

/**
 * Decode incoming message
 * @param messageBuffer Message buffer
 * @returns 
 */
export const decodeMessage = (messageBuffer: Uint8Array) => {
  const decoder = decoding.createDecoder(messageBuffer)
  const messageType = decoding.readVarUint(decoder) as MessageType

  function getMessagePayload (): Uint8Array;
  function getMessagePayload (length: 1): number;
  function getMessagePayload (length?: 1) {
    return length === 1 ? decoding.readVarUint(decoder) : decoding.readVarUint8Array(decoder)
  }

  const getCustomMessagePayload = () => {
    const string = decoding.readVarString(decoder)
    return JSON.parse(string)
  }

  return {
    messageType,
    decoder,
    getMessagePayload,
    getCustomMessagePayload,
  }
}