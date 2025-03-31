let certDataCache = null;

browser.webRequest.onHeadersReceived.addListener(
  async (details) => {
    try {
      const certDetails = await browser.webRequest.getSecurityInfo(
        details.requestId,
        {
          certificateChain: true,
          rawDER: false,
        }
      );

      if (
        certDetails &&
        certDetails.certificates &&
        certDetails.certificates.length > 0
      ) {
        const cert = certDetails.certificates[0];

        console.log("Certificate Details:", cert);

        certDataCache = {
          issuerName: cert.issuer || "ناموجود",
          subjectName: cert.subject || "ناموجود",
          validFrom: cert.validity?.start || "ناموجود",
          validTo: cert.validity?.end || "ناموجود",
          keyAlgorithm: cert.subjectPublicKeyInfo?.algorithm || "ناموجود",
          sigAlgorithm: cert.fingerprint.sha256 || "ناموجود",
          serialNumber: cert.serialNumber || "ناموجود",
        };
      } else {
        console.warn("گواهینامه یافت نشد.");
      }
    } catch (error) {
      console.error("خطا در دریافت گواهینامه:", error);
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]
);

browser.runtime.onMessage.addListener((message) => {
  if (message.type === "initiateCheck") {
    certDataCache = null;
    fetch(message.website).catch((error) =>
      console.error("خطا در واکشی:", error)
    );
  }

  if (message.type === "retrieveCertificate") {
    return Promise.resolve(
      certDataCache || { error: "هیچ اطلاعات گواهینامه‌ای یافت نشد." }
    );
  }
});
