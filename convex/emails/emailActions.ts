import { Resend } from "resend";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";

const resend = new Resend(process.env.RESEND_API_KEY);

export const scheduleEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    content: v.string(),
    scheduledTime: v.string(),
    designId: v.id("designs"),
  },
  handler: async (ctx, args) => {
    try {
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "konradhylton@gmail.com",
        subject: args.subject,
        html: args.content,
      });

      if (error) {
        console.error("Error scheduling email:", error);
        return { success: false, message: "Failed to schedule email" };
      }

      // Store scheduled email info in Convex database

      return { success: true, message: "Email scheduled successfully" };
    } catch (error) {
      console.error("Error scheduling email:", error);
      return { success: false, message: "Failed to schedule email" };
    }
  },
});
