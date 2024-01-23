import React, { useRef } from "react"


export type Payload = Record<string, unknown>
export type Listener = (payload: Payload) => void
export type ChannelMap = Map<string, Listener[]>
export type EventMap = Map<string, ChannelMap>

class EventEmitter {
  private readonly _debug: boolean;
  private _events: EventMap = new Map();

  constructor(debug = true) {
    this._debug = debug
  }

  emit(event: string, payload: Payload): void
  emit(channel: string, event: string, payload: Payload): void
  emit(channel: string, event: string | Payload, payload: Payload = event as Payload) {
    if (typeof event === "object") {
      event = channel
      channel = "*"
    }
    const channels = this._events.get(event)
    if (channels) {
      if (channel === "*") {
        for (const [, listeners] of channels) {
          for (const listener of listeners) {
            listener(payload)
          }
          if (this._debug) {
            console.debug("EventEmitter#emit", { channel, event, payload })
          }
        }
      } else {
        const listeners = channels.get(channel)
        if (listeners) {
          for (const listener of listeners) {
            listener(payload)
          }
          if (this._debug) {
            console.debug("EventEmitter#emit", { channel, event, payload })
          }
        }
      }
    }
  }

  on(event: string, listener: Listener): void
  on(channel: string, event: string, listener: Listener): void
  on(channel: string, event: string | Listener, listener: Listener = event as Listener) {
    if (typeof event === "function") {
      event = channel
      channel = "*"
    }
    if (!this._events.has(event)) {
      this._events.set(event, new Map())
    }
    const channels = this._events.get(event) as ChannelMap
    if (!channels.has(channel)) {
      channels.set(channel, [])
    }
    const listeners = channels.get(channel) as Listener[]
    if (!listeners.includes(listener)) {
      listeners.push(listener)
      if (this._debug) {
        console.debug("EventEmitter#on", { channel, event, listener })
      }
    }
  }

  off(event: string, listener: Listener) {
    const channels = this._events.get(event)
    if (channels) {
      for (const [, listeners] of channels) {
        listeners.splice(listeners.indexOf(listener), 1)
        if (this._debug) {
          console.debug("EventEmitter#off", { event, listener })
        }
      }
    }
  }
}


const useEventEmitter = () => {
  return useRef(new EventEmitter())
}


export default useEventEmitter