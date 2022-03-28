import { Observable } from 'lib0/observable'

export type CastEvent = 'ready' | 'connected' | 'disconnected' | 'message' | 'broadcast'
export type CastMode = 'sender' | 'receiver'

/**
 * Manage Google Cast connections and messaging
 */
export abstract class CastManager<T = any> extends Observable<CastEvent> {
  protected _options: T
  protected _namespace: string
  protected _context: any
  protected _ready = false
  protected _connected = false

  constructor (options: T, namespace: string) {
    super()

    this._options = options
    this._namespace = namespace

    this.once('ready', () => this._ready = true)
  }

  get context () { return this._context }
  get ready () { return this._ready }
  get connected () { return this._connected }
  get disconnected () { return !this._connected }

  public abstract inject (): void
  public abstract sendMessage (message: any): void
  public abstract requestSession (): Promise<null>

  protected _parseMessage (data: any) {
    if (typeof data === 'string')
        data = JSON.parse(data)

    if (!Array.isArray(data))
      data = Object.values<number>(data)

    return new Uint8Array(data)
  }
}