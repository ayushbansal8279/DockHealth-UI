import React, { ForwardedRef, MutableRefObject, RefObject, useRef } from "react";


export type Merger<T> = (value: T) => void

const useMergedRef = <T>(
  initialValue: T | null,
  ...refs: (MutableRefObject<T | null> | ForwardedRef<T | null>)[]
): [
  MutableRefObject<T | null>,
  Merger<T>
] => {
  const ref = useRef<T | null>(initialValue)
  refs.unshift(ref)
  const merger = (value: T) => {
    for (const next of refs) {
      if (next) {
        if (typeof next === "function") {
          next(value)
        } else {
          next.current = value
        }
      }
    }
  }

  return [ ref, merger ]
}


export default useMergedRef