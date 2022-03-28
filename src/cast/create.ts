import { CastReceiver } from "./receiver"
import { CastSender } from "./sender"
import type { CastManager, CastMode } from "./manager"

declare global {
  var ygooglecast_castmanager: CastManager<any>
}

/**
 * Save singleton instance of cast manager
 * @param factory Function to create instance
 */
const getSingletonInstance = <T extends CastManager>(factory: () => T) => {
  const gt = globalThis || window

  if (!gt.ygooglecast_castmanager)
    gt.ygooglecast_castmanager = factory()

  return gt.ygooglecast_castmanager
}

/**
 * Create cast manager to manage cast events
 * @param mode Cast mode, either 'sender' or 'receiver'
 * @param options Cast options
 * @param namespace Namespace for messages
 */
function createCastManager (mode: CastMode, options: any, namespace: string) {
  if (mode === 'receiver' || document.querySelector('script[src*="cast_receiver"]') !== null)
    return getSingletonInstance(() => new CastReceiver(options, namespace))

  if (mode === 'sender' || document.querySelector('script[src*="cast_sender"]') !== null)
    return getSingletonInstance(() => new CastSender(options, namespace))

  throw new Error('[y-google-cast] Unable to auto-detect cast mode')
}

export { createCastManager }