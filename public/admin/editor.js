/* No access tokens or OAuth secrets are stored in this file. */
window.CMS_MANUAL_INIT = true;
fetch("/api/cms/config", { cache: "no-store" })
  .then(async (response) => {
    if (!response.ok)
      throw new Error(
        "Editorial access has not been configured. The site administrator must connect the content repository and authentication service.",
      );
    const config = await response.json();
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/decap-cms@3.17.1/dist/decap-cms.js";
    script.onload = () => {
      document.getElementById("status").remove();
      window.CMS.init({ config });
      window.CMS.registerPreviewStyle("/admin/preview.css");
    };
    script.onerror = () =>
      showError("The editor could not load. Please try again later.");
    document.head.appendChild(script);
  })
  .catch((error) => showError(error.message));
function showError(message) {
  document.querySelector("#status p").textContent = message;
}
