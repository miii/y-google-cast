import { CastSenderOptions } from "./cast.types"
import { CastManager } from "./manager"

/**
 * Cast manager for sender applications
 */
export class CastSender extends CastManager<CastSenderOptions> {
  constructor (options: CastSenderOptions, namespace: string) {
    super(options, namespace)

    // Saved potentional implementation
    const origImpl = window.__onGCastApiAvailable
    // Add callback on cast ready
    window.__onGCastApiAvailable = () => {
      // Set context
      this._context = window.cast.framework.CastContext.getInstance()
      this._context.setOptions(this._options)

      // Emit ready event
      this.emit('ready', [])

      // Run original implementation
      if (origImpl)
        origImpl(arguments)

      // Manage connection status
      this._context.addEventListener('caststatechanged', ({ castState }: any) => {
        // Detect connected state
        if (castState === 'CONNECTED' && !this._connected) {
          this._connected = true
          this.emit('connected', [])
        }
        // Detect disconnected state
        else if (castState === 'NOT_CONNECTED' && this._connected) {
          this._connected = false
          this.emit('disconnected', [])
        }
      })
    }

    // Add message listener
    const messageListener = (namespace: string, message: any) => this.emit('message', [this._parseMessage(message)])
    this.on('connected', () => this._context.getCurrentSession().addMessageListener(this._namespace, messageListener))
  }

  /**
   * Inject cast sender script
   */
  public inject () {
    const src = '//www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'

    // Prevent multiple injections
    if (document.querySelector(`script[src="${src}"]`))
      return

    const script = document.createElement('script')
    script.src = src
    document.head.appendChild(script)
  }

  /**
   * Broadcast message to receiver
   * @param message Message
   */
  public sendMessage (message: any) {
    this._context.getCurrentSession().sendMessage(this._namespace, message)
    this.emit('broadcast', [message])
  }

  /**
   * Open the cast selection UI, to allow user to start or stop session
   */
  public requestSession (): Promise<null> {
    return this._context.requestSession()
  }
}