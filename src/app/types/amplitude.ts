export interface IAmplitudeSdk {
  /** Amplitude browser sdk initialized state.  */
  initialized: boolean;
}

export interface IAmplitudeContext {
  /** The Amplitude browser sdk context. */
  amplitudeSdk: IAmplitudeSdk;
}
