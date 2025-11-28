import { showAlert2 } from './utility-functions';
import { blobFileDownload } from './blob-file-download';

export const handleMixedResponse = (response, options = {}) => {
  const contentType = response.headers['content-type'];

  if (!contentType?.includes('multipart/mixed')) {
    throw new Error('Invalid multipart response format');
  }

  const boundary = contentType.split('boundary=')[1];
  if (!boundary) {
    throw new Error('Invalid multipart boundary');
  }

  const parts = response.data
    .split(`--${boundary}`)
    .filter((part) => part.trim());

  const jsonPart = parts.find((part) =>
    part.includes('Content-Type: application/json'),
  );
  const jsonMatch = jsonPart?.match(/{.*}/);
  const result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

  if (!result) {
    throw new Error('Failed to parse JSON response');
  }

  const { totalRecords, errorCount, updateCount, createCount } = result;

  let messages = [];
  let additionalMessage = '';
  let errorBlob = null;

  const formatMessage = (count, singular, plural) => {
    return `${count} ${count === 1 ? singular : plural}`;
  };

  if (errorCount > 0) {
    const csvPart = parts.find((part) =>
      part.includes('Content-Type: text/plain'),
    );

    if (csvPart) {
      const csvLines = csvPart.split('\n').map((line) => line.trim());
      const csvContent = csvLines
        .filter(
          (line) =>
            !line.startsWith('Content-Type') &&
            !line.startsWith('Content-Length') &&
            !line.startsWith('Content-Disposition'),
        )
        .join('\n');

      if (csvContent) {
        errorBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        additionalMessage = `You can download a report containing the records that failed. Refer to the last column in the file for the reason of failure.`;
      }
    }

    messages.push(formatMessage(errorCount, 'record failed', 'records failed'));
  }

  if (createCount > 0) {
    messages.push(
      formatMessage(createCount, 'new record created', 'new records created'),
    );
  }

  if (updateCount > 0) {
    messages.push(
      formatMessage(updateCount, 'record updated', 'records updated'),
    );
  }

  let status, title;

  if (errorCount > 0 && (createCount > 0 || updateCount > 0)) {
    status = 'warning';
    title = 'Partial Success';
  } else if (errorCount > 0) {
    status = 'error';
    title = 'Error';
  } else {
    status = 'success';
    title = 'Success';
  }

  if (errorCount > 0 && errorBlob) {
    const errorBlobToDownload = errorBlob;

    if (messages.length > 0) {
      return showAlert2({
        status,
        title,
        html: `${messages.join(', ')}${
          additionalMessage ? `<br><br>${additionalMessage}` : ''
        }`,
        confirmButtonText: 'Close',
        denyButtonText: 'Download',
        showDenyButton: true,
        onDeny: () => {
          blobFileDownload(errorBlobToDownload, 'error_records.csv');
        },
      });
    } else {
      return showAlert2({
        status: 'warning',
        title: 'Warning',
        text: 'No records were processed. Please try again.',
        showDenyButton: false,
        confirmButtonText: 'Close',
      });
    }
  }

  const alertResult =
    messages.length > 0
      ? showAlert2({
          status,
          title,
          html: `${messages.join(', ')}${
            additionalMessage ? `<br><br>${additionalMessage}` : ''
          }`,
          showDenyButton: false,
          confirmButtonText: 'Close',
        })
      : showAlert2({
          status: 'warning',
          title: 'Warning',
          text: 'No records were processed. Please try again.',
          showDenyButton: false,
          confirmButtonText: 'Close',
        });

  return alertResult;
};
