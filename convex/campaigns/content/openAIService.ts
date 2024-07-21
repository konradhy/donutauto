import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callOpenAI<T>(
  messages: Array<OpenAI.Chat.ChatCompletionMessageParam>,
  functionName: string,
): Promise<T> {
  try {
    console.log("Calling OpenAI with messages:", messages);
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
    console.error(`Error calling OpenAI in ${functionName}:`, error);
    throw new Error(
      `Failed to generate content using OpenAI in ${functionName}`,
    );
  }
}
