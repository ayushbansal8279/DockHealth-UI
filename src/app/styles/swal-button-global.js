import { createGlobalStyle } from 'styled-components';
import palette from './palette';
import spacing from './spacing';
import { fontWeights } from './font';

export const SwalButtonGlobals = createGlobalStyle`
  .swal2-actions {
    gap: 1rem !important;
  }

  .swal2-deny:not(.swal2-deny-custom) {
    display: none !important;
  }

  .swal2-confirm-custom {
    display: flex !important;
    height: 40px !important;
    padding: 22px 24px !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 10px !important;
    border-radius: 8px !important;
    background-color: ${palette.oPlusRed} !important;
    color: ${palette.white} !important;
    text-align: center !important;
    font-family: Outfit !important;
    font-style: normal !important;
    font-weight: ${fontWeights.regular} !important;
    line-height: 11.189px !important;
    text-transform: none !important;
    min-width: 180px !important;
    width: auto !important;
    border: none !important;
    cursor: pointer !important;
    transition: background-color 0.2s ease !important;

    &:hover {
      background-color: ${palette.oPlusRed} !important;
      color: ${palette.white} !important;
    }

    &:focus {
      outline: 2px solid ${palette.oPlusRed} !important;
      outline-offset: 2px !important;
    }

    &:disabled {
      color: ${palette.white} !important;
      background-color: ${palette.shadowBlue} !important;
      cursor: not-allowed !important;
    }
  }

  .swal2-deny-custom {
    display: flex !important;
    height: 40px !important;
    padding: 22px ${spacing.large} !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 10px !important;
    border-radius: 8px !important;
    border: 1px solid ${palette.oPlusRed} !important;
    color: ${palette.oPlusRed} !important;
    background-color: transparent !important;
    font-family: Outfit !important;
    text-align: center !important;
    font-style: normal !important;
    font-weight: ${fontWeights.regular} !important;
    line-height: 11.189px !important;
    text-transform: none !important;
    min-width: 180px !important;
    width: auto !important;
    cursor: pointer !important;
    transition: border-color 0.2s ease, color 0.2s ease !important;

    &:hover {
      border-color: ${palette.oPlusRed} !important;
      color: ${palette.oPlusRed} !important;
      background-color: transparent !important;
    }

    &:focus {
      outline: 2px solid ${palette.oPlusRed} !important;
      outline-offset: 2px !important;
    }

    &:disabled {
      border-color: ${palette.shadowBlue} !important;
      color: ${palette.shadowBlue} !important;
      cursor: not-allowed !important;
    }
  }
`;

