function showError(message) {
  const errorElem = document.getElementById("errorMessage");
  errorElem.textContent = message;
  errorElem.style.display = "block";
  setTimeout(() => {
    errorElem.style.display = "none";
  }, 3000);
}

document.getElementById("checkBtn").addEventListener("click", async () => {
  const website = document.getElementById("websiteInput").value.trim();
  if (!website.startsWith("https://")) {
    showError("آدرس باید با HTTPS شروع شود!");
    return;
  }

  await browser.runtime.sendMessage({
    type: "initiateCheck",
    website: website,
  });

  setTimeout(async () => {
    const certInfo = await browser.runtime.sendMessage({
      type: "retrieveCertificate",
    });
    if (certInfo.error) {
      showError(certInfo.error);
      return;
    }

    document.getElementById("issuerName").textContent =
      certInfo.issuerName || "ناموجود";
    document.getElementById("subjectName").textContent =
      certInfo.subjectName || "ناموجود";
    document.getElementById("validFrom").textContent = new Date(
      certInfo.validFrom
    ).toLocaleString();
    document.getElementById("validTo").textContent = new Date(
      certInfo.validTo
    ).toLocaleString();
    document.getElementById("keyAlgorithm").textContent =
      certInfo.keyAlgorithm || "ناموجود";
    document.getElementById("sigAlgorithm").textContent =
      certInfo.sigAlgorithm || "ناموجود";
    document.getElementById("serialNumber").textContent =
      certInfo.serialNumber || "ناموجود";

    document.getElementById("certDetails").style.display = "table";
  }, 1200);
});
