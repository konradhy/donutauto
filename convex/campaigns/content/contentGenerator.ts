import { generateQuizContent } from "./quizContent";
// import { generateFactContent } from "./factContent";
import { generateMythContent } from "./mythContent";
// import { generateGeneralContent } from "./generalContent";
// import { generateJokeContent } from "./jokeContent";
// import { generateCustomContent } from "./customContent";
import { Platform, ContentType } from "../campaignActionHelpers";

//just use a Doc<"customers"> instead
interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  dob?: string;
  preferences?: string[];
  instagramHandle?: string;
  twitterHandle?: string;
  tiktokHandle?: string;
  location?: string;
}

interface BrandData {
  name: string;
  description: string;
  products?: string[];
  // Add any other relevant brand information
}

export async function generateContent(
  contentType: ContentType,
  platform: Platform,
  customerData: CustomerData,
  brandData: BrandData,
): Promise<any> {
  console.log(`Generating ${contentType} content for ${platform}`);

  let generatedContent;
  //eventually expand to generate based on platform and content type?
  switch (contentType) {
    case "quiz":
      generatedContent = await generateQuizContent(customerData, brandData);
      break;
    case "myth":
      generatedContent = await generateMythContent(customerData, brandData);
      break;
    // Uncomment and implement other content types as needed
    // case "fact":
    //   generatedContent = await generateFactContent(customerData, brandData);
    //   break;
    // case "myth":
    //   generatedContent = await generateMythContent(customerData, brandData);
    //   break;
    // case "general":
    //   generatedContent = await generateGeneralContent(customerData, brandData);
    //   break;
    // case "joke":
    //   generatedContent = await generateJokeContent(customerData, brandData);
    //   break;
    // case "custom":
    //   generatedContent = await generateCustomContent(customerData, brandData);
    //   break;
    default:
      throw new Error(`Unsupported content type: ${contentType as string}`);
  }

  return generatedContent;
}
