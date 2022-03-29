import { CastReceiverOptions } from "./cast.types"
import { CastManager } from "./manager"

/**
 * Cast manager for receiver applications
 */
export class CastReceiver extends CastManager<CastReceiverOptions> {
  /**
   * List of active senders
   */
  private _senders: string[] = []

  constructor (options: CastReceiverOptions, namespace: string) {
    super(options, namespace)

    // Check ready state
    this._awaitReadyState().then(() => {
      // Use proxied context which auto-injects custom namespaces
      const context = window.cast.framework.CastReceiverContext.getInstance()
      const proxy = new Proxy(context, {
        get: (target, prop) => {
          if (prop === 'start')
            return (opt: any) => {
              const options = Object.assign({}, opt)
              
              if (!options.customNamespaces)
                options.customNamespaces = {}
                
              // Add custom namespace
              options.customNamespaces[this._namespace] = 'JSON'

              // Auto-disable idle timeout unless explicitly set
              if (!options.disableIdleTimeout)
                options.disableIdleTimeout = true

              return target.start(options)
            }

          return target[prop]
        }
      })
      window.cast.framework.CastReceiverContext = this._context = proxy
      proxy.start(this._options)

      // Emit ready event
      this.emit('ready', [])

      // Add message listener
      this._context.addCustomMessageListener(
        this._namespace,
        (event: any) => this.emit('message', [this._parseMessage(event.data)])
      )

      // Manage connection status
      this._context.addEventListener('senderconnected', ({ senderId }: any) => {
        this._connected = true
        this._senders.push(senderId)
        this.emit('connected', [senderId])
      })
      this._context.addEventListener('senderdisconnected', ({ senderId }: any) => {
        this._senders = this._senders.filter(id => id !== senderId)
        this._connected = this._senders.length > 0
        this.emit('disconnected', [senderId])
      })
    })
  }

  /**
   * Inject cast receiver script
   */
  public inject () {
    const src = '//www.gstatic.com/cast/sdk/libs/caf_receiver/v3/cast_receiver_framework.js'

    // Prevent multiple injections
    if (document.querySelector(`script[src="${src}"]`))
      return

    const script = document.createElement('script')
    script.src = src
    document.head.appendChild(script)
  }

  /**
   * Broadcast message to all senders
   * @param message Message
   */
  public sendMessage(message: any): void {
    this._context.sendCustomMessage(this._namespace, undefined, message)
    this.emit('broadcast', [message])
  }

  /**
   * Cast session cannot be initiated from receiver application
   */
  public requestSession (): Promise<null> {
    throw new Error('Cannot request session from receiver')
  }

  /**
   * Get list of active senders
   */
  public get senders () { return this._senders }

  /**
   * Recursively check ready state and emit ready event
   */
  private _awaitReadyState (): Promise<void> {
    // Skip optional chaining even in dev since it's not supported by older cast devices
    if (window.cast && window.cast.framework && window.cast.framework.CastReceiverContext)
      return Promise.resolve()
    
    return new Promise(resolve => setTimeout(() => this._awaitReadyState().then(resolve), 100))
  }
}