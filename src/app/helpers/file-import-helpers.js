export function getImportMessage(type, uploadResponse) {
  switch (type) {
    case "Profile":
      return uploadResponse?.statusCode === "SUCCESS"
        ? "Profile records are successfully uploaded. Please refresh the page after some time."
        : "File upload failed. Please check the template and try again.";

    case "User":
      return "Invitation sent successfully."

    default:
      return "File upload completed.";
  }
}