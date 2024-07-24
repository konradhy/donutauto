export async function callCanvaAutofillAPI(
  templateId: string,
  data: any,
  accessToken: string,
  title: string,
) {
  // TODO: increase maxRetries at the end of development. No need to overly stress the Canva API during development.
  const maxRetries = 1;
  let attempts = 0;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (attempts < maxRetries) {
    console.log(`Calling Canva API with contenwwwt:`, data);
    console.log("the templaqte id is", templateId);
    try {
      const response = await fetch("https://api.canva.com/rest/v1/autofills", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand_template_id: templateId,
          data: data,
          title: title,
        }),
      });

      if (!response.ok) {
        console.log("response", response);
        throw new Error(`Canva API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      attempts++;
      if (attempts >= maxRetries) {
        throw new Error(
          `Failed to call Canva API after ${maxRetries} attempts: ${(error as Error).message}`,
        );
      }
      console.error(
        `Failed to call Canva API: ${(error as Error).message}, attempt: ${attempts} out of ${maxRetries}`,
      );
      console.log(`Retrying in ${Math.pow(2, attempts) * 1000}ms...`);
      const backoffTime = Math.pow(2, attempts) * 1000; // Exponential backoff: 1s, 2s, 4s
      await delay(backoffTime);
    }
  }
}

export async function uploadCanvaAsset(
  canvaAccessToken: string,
  imageData: string,
): Promise<string> {
  // Convert base64 to Uint8Array
  const binaryData = Uint8Array.from(atob(imageData), (c) => c.charCodeAt(0));

  const uploadResponse = await fetch(
    "https://api.canva.com/rest/v1/asset-uploads",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${canvaAccessToken}`,
        "Content-Type": "application/octet-stream",
        "Asset-Upload-Metadata": JSON.stringify({
          name_base64: btoa("DALLE_Generated_Image"),
          mime_type: "image/png", // Specify the MIME type
        }),
      },
      body: binaryData,
    },
  );

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(
      `Asset upload failed: ${uploadResponse.statusText}. Details: ${errorText}`,
    );
  }

  const { job } = await uploadResponse.json();
  console.log("Asset upload job:", job);
  return job.id; // This is both the job ID and the asset ID but could change in the future
}

async function checkAssetUploadStatus(
  canvaAccessToken: string,
  jobId: string,
): Promise<string | null> {
  const response = await fetch(
    `https://api.canva.com/rest/v1/asset-uploads/${jobId}`,
    {
      headers: { Authorization: `Bearer ${canvaAccessToken}` },
    },
  );

  const data = await response.json();

  if (data.job.status === "success") {
    return data.job.asset.id; // Return the asset ID
  } else if (data.job.status === "failed") {
    throw new Error(data.job.error.message);
  }

  return null; // Still in progress
}

export async function waitForAssetUpload(
  canvaAccessToken: string,
  jobId: string,
  maxAttempts = 5,
  delay = 5000,
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const assetId = await checkAssetUploadStatus(canvaAccessToken, jobId);
    console.log(`Asset upload check ${i + 1}/${maxAttempts}:`, assetId);
    if (assetId) return assetId;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("Asset upload timed out");
}
