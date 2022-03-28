import * as Y from 'yjs'
import * as awarenessProtocol  from 'y-protocols/awareness'
import { Observable } from 'lib0/observable'

import { CastManager, CastMode } from './cast/manager'
import { createCastManager } from './cast/create'
import { CastReceiverOptions, CastSenderOptions } from './cast/cast.types'
import { sendAwarenessMessage, sendSyncMessage, readMessage } from './messages'
import { sendCustomMessage } from './messages/send'

/** Observable events emitted by the provider */
type GoogleCastProviderEvent = 'ready' | 'connected' | 'disconnected' | 'synced' | 'message'

interface GoogleCastProviderOptions {
  /**
   * Auto-inject Google Cast SDK scripts
   * @default true
   */
  inject?: boolean
  /**
   * Customize awareness instance
   */
  awareness?: awarenessProtocol.Awareness
  /**
   * Namespace for cast messages
   * @default urn:x-cast:y-google-cast
   */
  namespace?: string
}

export class GoogleCastProvider extends Observable<GoogleCastProviderEvent> {
  /** Manage cast-specific implement */
  cast: CastManager
  /** Yjs document */
  doc: Y.Doc
  /** Awareness instance to hold connection status etc. */
  awareness: awarenessProtocol.Awareness
  /** If client document is synced */
  _synced = false

  constructor (doc: Y.Doc, mode: 'sender', castOptions: CastSenderOptions, options?: GoogleCastProviderOptions)
  constructor (doc: Y.Doc, mode: 'receiver', castOptions?: CastReceiverOptions, options?: GoogleCastProviderOptions)
  constructor (doc: Y.Doc, mode: CastMode, castOptions?: CastSenderOptions | CastReceiverOptions, { inject = true, awareness = new awarenessProtocol.Awareness(doc), namespace = 'urn:x-cast:y-google-cast' } = {}) {
    super()
    
    // Initiate cast integration
    const castManager = createCastManager(mode, castOptions, namespace)

    // Save doc and awareness
    this.doc = doc
    this.awareness = awareness
    this.cast = castManager

    // Inject scripts
    if (inject)
      castManager.inject()

    // Forward ready event
    castManager.on('ready', () => this.emit('ready', []))

    // Broadcast sync message on document updates
    doc.on('update', (data: Uint8Array, origin: any) => {
      if (origin !== this)
        sendSyncMessage(this, 'update', data)
    })

    // Sync awareness
    awareness.on('update', ({ added, updated, removed }: any) => {
      sendAwarenessMessage(this, [...added, ...updated, ...removed])
    })

    castManager.on('connected', () => {
      // Start sync process
      sendSyncMessage(this, 'step1')

      // Send awareness
      if (this.awareness.getLocalState() !== null)
        sendAwarenessMessage(this, [this.doc.clientID])
    
      this.emit('connected', [])
    })

    // Notify offline status
    window.addEventListener('beforeunload', () => awarenessProtocol.removeAwarenessStates(this.awareness, [doc.clientID], 'window unload'))
    castManager.on('disconnected', () => {
      awarenessProtocol.removeAwarenessStates(this.awareness, [doc.clientID], 'cast disconnected')
      this.emit('disconnected', [])
      
      this.synced = false
    })

    // Handle incoming messages
    castManager.on('message', (data: any) => readMessage(this, data))
  }

  /**
   * Whether document is in sync
   */
  public get synced () {
    return this._synced
  }


  /**
   * Set document sync state
   */
  public set synced (synced: boolean) {
    this._synced = synced
    this.emit('synced', [synced])
  }

  /**
   * Get cast context
   * @type {cast.framework.CastContext | cast.framework.CastReceiverContext}
   */
  public get context () {
    return this.cast.context
  }

  /**
   * Open the cast selection UI, to allow user to start or stop session
   */
  public requestSession () {
    this.cast.requestSession()
  }

  /**
   * Send message to receiver
   * @param message Message
   */
  public sendMessage <T>(message: T) {
    if (this.cast.connected)
      sendCustomMessage(this, message)
    else
      console.error('[y-google-cast] Cannot send message, not connected to receiver')

    return this.cast.connected
  }
}