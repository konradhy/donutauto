import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { getBasicAuthClient } from "@/lib/canva-api/client";
import { AutofillService } from "@/lib/canva-api/services.gen";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    // Get the user's tokenIdentifier from the cookie
    const tokenIdentifier = request.cookies.get("tokenIdentifier")?.value;
    if (!tokenIdentifier) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    // Get the user's access token from Convex
    const { accessToken } = await convex.query(
      api.canvaAuth.getAccessTokenWithTokenIdentifier,
      {
        tokenIdentifier,
      },
    );
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 404 },
      );
    }

    console.log("accessToken", accessToken);

    // Hardcoded brand template ID and autofill data
    const brandTemplateId = "DAGKSQm7nWw"; // Replace with your actual brand template ID
    const autofillData = {
      brand_template_id: "brandTemplateId",
      title: "Autofilled Design",
      data: {
        cute_pet_image_of_the_day: {
          type: "image",
          asset_id: "Msd59349ff", // Replace with an actual asset ID
        },
        cute_pet_witty_pet_says: {
          type: "text",
          text: "It was like this when I got here!",
        },
      },
    };

    // Create the autofill job

    const response = await fetch("https://api.canva.com/rest/v1/autofills", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brand_template_id: "DAGKSQm7nWw",
        title: "string",
        data: {
          CITY: {
            type: "text",
            text: "Kingston",
          },
          TEMPERATURE: {
            type: "text",
            text: "Hot",
          },
        },
      }),
    });

    if (!response) {
      throw new Error(`Autofill job creation failed: ${response}`);
    }

    const job = await response.json();

    return NextResponse.json({
      message: "Autofill job created successfully",
      job,
    });
  } catch (error) {
    console.error("Error creating autofill job:", error);
    return NextResponse.json(
      { error: "Failed to create autofill job" },
      { status: 500 },
    );
  }
}
