import { internal } from "./_generated/api";

export async function callCanvaAPI(
  templateId: string,
  data: any,
  accessToken: string,
  title: string,
) {
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
}
