
export async function callCanvaAutofillAPI(
  templateId: string,
  data: any,
  accessToken: string,
  title: string,
) {
  const maxRetries = 3;
  let attempts = 0;

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (attempts < maxRetries) {
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
