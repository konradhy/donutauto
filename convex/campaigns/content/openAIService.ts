import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 second
const MAX_BACKOFF = 10000; // 10 seconds

function getBackoffTime(attempt: number): number {
  const exponentialBackoff = Math.min(
    MAX_BACKOFF,
    INITIAL_BACKOFF * Math.pow(2, attempt - 1),
  );
  const jitter = Math.random() * exponentialBackoff * 0.1; // 10% jitter
  return exponentialBackoff + jitter;
}

export async function callOpenAI<T>(
  messages: Array<OpenAI.Chat.ChatCompletionMessageParam>,
  functionName: string,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Attempt ${attempt}: Calling OpenAI with messages:`,
        messages,
      );
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      if (
        response.choices &&
        response.choices.length > 0 &&
        response.choices[0].message.content
      ) {
        try {
          const jsonResponse = JSON.parse(response.choices[0].message.content);
          return jsonResponse as T;
        } catch (parseError) {
          console.error(`Error parsing JSON in ${functionName}:`, parseError);
          throw new Error(`Failed to parse JSON response in ${functionName}`);
        }
      } else {
        throw new Error(`No valid response from OpenAI in ${functionName}`);
      }
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed in ${functionName}:`, error);

      if (attempt < MAX_RETRIES) {
        const backoffTime = getBackoffTime(attempt);
        console.log(
          `Retrying in ${(backoffTime / 1000).toFixed(2)} seconds...`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  console.error(
    `All ${MAX_RETRIES} attempts failed in ${functionName}. Giving up.`,
  );
  throw (
    lastError ||
    new Error(
      `Failed to generate content using OpenAI in ${functionName} after multiple attempts`,
    )
  );
}

export async function generateDalleImage(prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json",
      });

      const imageData = response.data[0].b64_json;

      if (!imageData) {
        throw new Error("No image data returned from DALL-E");
      }

      return imageData;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt < MAX_RETRIES) {
        const backoffTime = getBackoffTime(attempt);
        console.log(
          `Retrying in ${(backoffTime / 1000).toFixed(2)} seconds...`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      }
    }
  }

  console.error(`All ${MAX_RETRIES} attempts failed. Giving up.`);
  throw (
    lastError || new Error("Failed to generate image after multiple attempts")
  );
}

export function generateDallePrompt(
  content: any,
  brandData: any,
  imageInstructions: string | undefined,
): string {
  return `Create a simple, clean background image with no text. The image should subtly incorporate elements related to ${brandData.name} which is described as ${brandData.description}. The overall them will preferably reflect concepts or imagery from ${content.mythOne}.
  Key points: 1. Keep the design minimal and uncluttered 2. Avoid any text or written elements 3. Use soft, muted colors unless specified otherwise 4. Incorporate subtle visual elements that relate to the brand and content 5. Ensure the image works well as a background (not too busy or distracting) {imageInstructions} Remember, the goal is a subtle, professional background that hints at the brand and content themes without overpowering any foreground elements that may be added later.;
  6. Finally, consider this point which has been suggested by the end user ${imageInstructions}`;
}
