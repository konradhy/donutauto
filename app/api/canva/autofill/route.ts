import { NextRequest, NextResponse } from "next/server";

import {
  getBasicAuthClient,
  getUserClient,
  getAccessTokenForUser,
} from "@/lib/canva-api/client";
import { AutofillService } from "@/lib/canva-api/services.gen";

//this file will refactor into a convex function
export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessTokenForUser();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 404 },
      );
    }

    // Create the autofill job

    const answer = await AutofillService.createDesignAutofillJob({
      client: getUserClient(accessToken as string),
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
