/** Auto-join policy determines when the SDK will automatically connect a sender application to an existing session after API initialization. */
enum AutoJoinPolicy {
  /** Automatically connects when the session was started with the same appId, in the same tab and page origin. */
  TAB_AND_ORIGIN_SCOPED = 'tabandoriginscoped',
  /** Automatically connects when the session was started with the same appId and the same page origin (regardless of tab). */
  ORIGIN_SCOPED = 'originscoped',
  /** No automatic connection. */
  PAGE_SCOPED = 'pagescoped',
}

/** Page cast options. */
export interface CastSenderOptions {
  /** Cast application id. */
  receiverApplicationId: string
  /** Indicates if the app is compatible with an Android Receiver. */
  androidReceiverCompatible?: boolean
  /** Indicates if to join a running session on initialization. */
  autoJoinPolicy?: AutoJoinPolicy
  /** Credentials data used to identify the credentials of the sender. */
  credentialsData?: {
    /** The credentials for the user. */
    credentials: string
    /** The credentials type indicating which platform the credentials were sent from. This defaults to web or can be custom-defined. */
    credentialsType?: string
  }
  /** Language to use. */
  language?: string
  /** If true, a session will be re-joined without reloading the page. */
  resumeSavedSession?: boolean
}

/** Types of custom messages. */
enum MessageType {
  /** Messages are free-form strings. The application is responsible for encoding/decoding the information transmitted. */
  STRING = 'string',
  /** Messages are JSON-encoded. The underlying transport will use a JSON encoded string. */
  JSON = 'json',
}

/** Cast receiver context options. */
export interface CastReceiverOptions {
  /** Map of custom message namespaces and their types. Custom message namespaces must be initialized before the application starts, so they must be provided in the receiver options. (The default message type is JSON if not provided here). */
  customNamespaces?: Record<string, MessageType>
  /** If true, prevents the receiver from being closed when it becomes idle after active playback stops. This property should be used only for non-media apps. */
  disableIdleTimeout?: boolean
  /** If true, any media command that is not in the supportedCommands map will generate an error. The cast.framework.messages.ErrorReason will be set to NOT_SUPPORTED. Default value is false, which allows media commands to be executed without checking the map. */
  enforceSupportedCommands?: boolean
  /** Sender ID used for local requests. Default value is 'local'. */
  localSenderId?: string
  /** Maximum time in seconds before closing an idle sender connection. Setting this value enables a heartbeat message to keep the connection alive. Used to detect unresponsive senders faster than typical TCP timeouts. The minimum value is 5 seconds; no upper bound is enforced, but it typically takes minutes before platform TCP timeouts come into play. Default value is 10 seconds. */
  maxInactivity?: number
  /** Media element to play content with. Default behavior is to use the first media element found in the page. */
  mediaElement?: HTMLMediaElement
  /** A playback configuration with custom parameters. */
  playbackConfig?: unknown
  /** If true, a client-stitched break will play even if it was already watched. */
  playWatchedBreak?: boolean
  /** The playback rate to use if unspecified in the load request. Allowable range is 0.5 to 2, with 1 being normal speed. */
  preferredPlaybackRate?: number
  /** Language to use for the text track if the load request does not specify an active track. */
  preferredTextLanguage?: string
  /** Custom queue implementation. */
  queue?: unknown
  /** If true, prevents the receiver from loading the MPL player. */
  skipMplLoad?: boolean
  /** If true, prevents the receiver from loading the MPL or Shaka player libraries. Equivalent to setting both skipMplLoad and skipShakaLoad to true. */
  skipPlayersLoad?: boolean
  /** If true, prevents the receiver from loading the Shaka player. */
  skipShakaLoad?: boolean
  /** Text that represents the application status. It should meet internationalization rules, as it may be displayed by the sender application. */
  statusText?: string
  /** A bitmask of media commands supported by the application. LOAD, PLAY, STOP, GET_STATUS must always be supported. If this value is not provided, then PAUSE, SEEK, STREAM_VOLUME, STREAM_MUTE, EDIT_TRACKS, and PLAYBACK_RATE are also assumed to be supported. */
  supportedCommands?: number
}