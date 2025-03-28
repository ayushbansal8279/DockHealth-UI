export function getImportMessage(type) {
  switch (type) {
    case "User":
      return "Invitation sent successfully."

    default:
      return "File upload completed.";
  }
}