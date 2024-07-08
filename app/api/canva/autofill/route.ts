import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import {
  getBasicAuthClient,
  getUserClient,
  getAccessTokenForUser,
} from "@/lib/canva-api/client";
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
    //Is there a safer way to inject this?
    const accessToken = await getAccessTokenForUser(tokenIdentifier);

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 404 },
      );
    }

    // Create the autofill job

    const answer = await AutofillService.createDesignAutofillJob({
      client: getUserClient(accessToken),
      path: {
        brandTemplateId: "DAGKSQm7nWw",
      },
      body: {
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
      },
    });

    // const response = await fetch("https://api.canva.com/rest/v1/autofills", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     brand_template_id: "DAGKSQm7nWw",
    //     title: "string",
    //     data: {
    //       CITY: {
    //         type: "text",
    //         text: "Kingston",
    //       },
    //       TEMPERATURE: {
    //         type: "text",
    //         text: "Hot",
    //       },
    //     },
    //   }),
    // });
    // const job = await response.json();

    if (!answer) {
      return NextResponse.json(
        { error: "Failed to create autofill job" },
        { status: 500 },
      );
    }

    return NextResponse.json(answer.data);
  } catch (error) {
    console.error("Error creating autofill job:", error);
    return NextResponse.json(
      { error: "Failed to create autofill job" },
      { status: 500 },
    );
  }
}
