# @miii/y-google-cast
> Google Cast connection provider for Yjs

## ✨ Features
- Automatic syncronization of Yjs documents between sender and receiver
- Automatic exchange of awareness information (e.g. cursors)
- Auto-injection of necessary scripts (enabled by default)
- Hassle-free custom messaging

Try it out [yourself](https://y-google-cast.netlify.app).

## 🤔 What is Yjs?
[Yjs](https://github.com/yjs/yjs) is a CRDT implementation that can be used to share states (called Yjs documents) between multiple peers in a network. It handles conflicts, offline mutations and all the things necessary to merge states from multiple peers. This package implements the transport layer to syncronize these changes through the Google Cast API. Yjs has a fantastic ecosystem and can be integrated with Vue, React etc.

## 🚀 Get started
### Install
```sh
$ pnpm add @miii/y-google-cast # or use yarn/npm
```
### Receiver application
```js
import * as Y from 'yjs'
import { GoogleCastProvider } from '@miii/y-google-cast'

const doc = new Y.Doc()
const castProvider = new GoogleCastProvider(doc, 'receiver')
```

### Sender application
```js
import * as Y from 'yjs'
import { GoogleCastProvider } from '@miii/y-google-cast'

const doc = new Y.Doc()
const receiverApplicationId = '<app-id>'
const castProvider = new GoogleCastProvider(doc, 'sender', { receiverApplicationId })
```
Your application ID can be found in the [Cast SDK Developer Console](https://cast.google.com/publish/#/overview).

## 🖥️ Confirmed devices
Unfortunately, [testing Cast integrations is currently manual](https://developers.google.com/cast/docs/testing#cast) which makes it hard to guarantee support on every possible device. The list below contains devices which are tested and should work as expected. Please submit a PR if you have further information about other devices.

| Device            | Latest confirmed version |
| ---               | ---                      |
| Google TV         | `v1.0.4`                 |
| Chromecast gen 1  | `v1.0.4`                 |

## 🛠️ API
```ts
/**
 * Initiate the Google Cast provider
 * @param {Y.Doc} doc Yjs document
 * @param {CastMode} mode Cast mode ('sender' or 'receiver')
 * @param {CastReceiverOptions | CastSenderOptions} castOptions Provide custom options to the Google Cast API
 * @param {CastProviderOptions} options Advanced provider options
 */
new GoogleCastProvider(doc, mode, castOptions, options)
```

### 💬 Send custom messages
It is possible to send messages through the provider without having the data stored inside the Yjs document.
This is especially useful to interchange events between clients and trigger callbacks.
```ts
// In sender application
castProvider.sendMessage({ joke: 'Two tomatoes were crossing a road' })

// In receiver application
castProvider.on('message', payload => console.log('Received a joke', payload.joke))
```

### ⛳ Events:
```ts
castProvider.on('ready', () => {
  console.log('Google Cast is ready')
})

castProvider.on('connected', () => {
  console.log('Receiver/sender connected')
})

castProvider.on('disconnected', () => {
  console.log('Receiver/sender disconnected')
})

castProvider.on('synced', (synced: boolean) => {
  console.log('Document synced:', synced)
})

castProvider.on('message', (message: any) => {
  console.log('Received custom message:', message)
})
```