import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

export const checkPendingJobs = internalAction({
  handler: async (ctx) => {
    const pendingJobs = await ctx.runQuery(
      internal.campaigns.designs.getPendingAutofillJobs,
    );

    for (const job of pendingJobs) {
      console.log("Checking job", job.title);
      const result = await ctx.runAction(
        internal.campaigns.campaignActions.checkAutofillJob,
        {
          userId: job.userId,
          designId: job._id,
          jobId: job.jobId,
        },
      );

      if (result.status === "completed") {
        // Job completed successfully, no action needed as it's already updated
      } else if (result.status === "failed") {
        // Job failed, update status in database
        await ctx.runMutation(internal.campaigns.designs.updateDesignStatus, {
          designId: job._id,
          status: "failed",
          errorMessage: result.error,
        });
      }
      // If still in progress, do nothing and wait for the next check
    }
  },
});
