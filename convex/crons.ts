import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "check pending autofill jobs",
  { minutes: 5 }, // Check every 5 minutes
  internal.campaigns.autofillJobs.checkPendingJobs,
);

export default crons;
