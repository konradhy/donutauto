/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.12.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as accessControlHelpers from "../accessControlHelpers.js";
import type * as accessTokenHelper from "../accessTokenHelper.js";
import type * as accessTokenHelperAction from "../accessTokenHelperAction.js";
import type * as brandTemplateSettings from "../brandTemplateSettings.js";
import type * as campaignActions from "../campaignActions.js";
import type * as campaigns from "../campaigns.js";
import type * as canvaApi from "../canvaApi.js";
import type * as canvaAuth from "../canvaAuth.js";
import type * as customers from "../customers.js";
import type * as invitations from "../invitations.js";
import type * as organizations from "../organizations.js";
import type * as userManagement from "../userManagement.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  accessControlHelpers: typeof accessControlHelpers;
  accessTokenHelper: typeof accessTokenHelper;
  accessTokenHelperAction: typeof accessTokenHelperAction;
  brandTemplateSettings: typeof brandTemplateSettings;
  campaignActions: typeof campaignActions;
  campaigns: typeof campaigns;
  canvaApi: typeof canvaApi;
  canvaAuth: typeof canvaAuth;
  customers: typeof customers;
  invitations: typeof invitations;
  organizations: typeof organizations;
  userManagement: typeof userManagement;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
