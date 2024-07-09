import { internal } from "./_generated/api";

export async function callCanvaAPI(
  templateId: string,
  data: Record<string, { type: string; text?: string; asset_id?: string }>,
  accessToken: string,
  title?: string,
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
    const errorText = await response.text();
    console.error("Canva API error response:", errorText);
    throw new Error(
      `Canva API error: ${response.statusText}. Details: ${errorText}`,
    );
  }

  const result = await response.json();
  console.log("Canva API response:", result);
  return result;
}
