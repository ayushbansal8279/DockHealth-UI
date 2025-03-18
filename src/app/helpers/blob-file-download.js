export function blobFileDownload(blobData, filename) {
    const url = window.URL.createObjectURL(blobData);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', filename);
    document.body.append(link);
    link.click();
    URL.revokeObjectURL(url);
}