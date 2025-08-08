import { showAlert } from "./utility-functions";

export function handleApiError(error) {
  showAlert({
    status: 'error',
    title: 'Error',
    text:
      error?.response?.data?.errorMessage ??
      error?.message ??
      'Something went wrong, please try again later.',
  });
  throw error;
}