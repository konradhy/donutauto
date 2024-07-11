# Canva Access Token Helper

## bug

- Appeared not to work. Difficult to replicate bug. Could be that i was unauthenticated for a reason other than time.

## Overview

The Canva Access Token Helper module manages Canva API access tokens within the application. It ensures that a valid token is always available for making API requests to Canva, handling token expiration and refresh automatically. This system enhances security and reliability when interacting with the Canva API, reducing the risk of unauthorized access and API failures due to expired tokens.

## Key Components

1. `ensureCanvaAccessToken` mutation:

   - Public interface for initiating token checks
   - Can be called from client-side code

2. `getCanvaTokenInfo` function:

   - Retrieves current token info from the database
   - Checks if the token will expire within the next 15 minutes

3. `refreshCanvaToken` action:

   - Makes a secure API call to Canva's token endpoint
   - Uses environment variables for API credentials

4. `updateCanvaTokens` mutation:

   - Stores new access token, refresh token, and expiration time

5. `getCanvaAccessToken` action:
   - Orchestrates the token retrieval process
   - Checks if a refresh is needed and performs it if necessary

## Workflow

1. Client-side code initiates a token check
2. System retrieves current token info from the database
3. If token is near expiration, a refresh is triggered
4. New token is obtained from Canva API and stored in the database
5. Valid access token is returned for use in API requests

## Key Features

- Automatic token refresh before expiration
- Secure storage of tokens in the database
- Use of Convex's internal functions for enhanced security
- Public interface for initiating token checks
- Environment variable usage for sensitive data

## Usage

Client-side token check:

```typescript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function MyComponent() {
  const userId = // ... Grab id from somewhere
  const ensureToken = useMutation(api.accessTokenHelper.ensureCanvaAccessToken);

  const handleCanvaAction = async () => {
    await ensureToken({ userId });
    // Safely make Canva API call
  };

  // ...
}
```

Server-side token usage:

```typescript
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const someCanvaOperation = internalAction({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const accessToken = await ctx.runAction(
      internal.accessTokenHelperAction.getCanvaAccessToken,
      { userId: args.userId },
    );
    // API Call that needs access token
  },
});
```
