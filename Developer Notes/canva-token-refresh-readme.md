# Canva Access Token Helper

## Overview

This module provides a secure and efficient mechanism for managing Canva API access tokens within our application. It ensures that we always have a valid token for making API requests to Canva, handling token expiration and refresh automatically.

## Key Features

- Automatic token refresh before expiration
- Secure storage of tokens in the database
- Use of Convex's internal functions for enhanced security
- Public interface for initiating token checks

## How this thing Works

The token management system is split across two files to comply with Convex's architecture requirements:

1. `accessTokenHelper.ts`: Contains database operations and public interface
2. `accessTokenHelperAction.ts`: Handles API calls and token refresh logic

### Token Retrieval and Refresh Logic

1. **Initiate Token Check** (`ensureCanvaAccessToken` in `accessTokenHelper.ts`)

   - Public mutation that initiates the token check process
   - Can be called from client-side code to ensure a valid token

2. **Check Token Status** (`getCanvaTokenInfo` in `accessTokenHelper.ts`)

   - Retrieves the current token info from the database
   - Checks if the token will expire within the next 15 minutes
   - Returns either the valid access token or indicates that a refresh is needed

3. **Token Refresh** (`refreshCanvaToken` in `accessTokenHelperAction.ts`)

   - Called when a token needs refreshing
   - Makes a secure API call to Canva's token endpoint
   - Uses environment variables for API credentials

4. **Database Update** (`updateCanvaTokens` in `accessTokenHelper.ts`)

   - Stores the new access token, refresh token, and expiration time

5. **Access Token Retrieval** (`getCanvaAccessToken` in `accessTokenHelperAction.ts`)
   - Orchestrates the token retrieval process
   - Checks if a refresh is needed and performs it if necessary
   - Returns a valid access token

### Security Considerations

- **Environment Variables**: Sensitive data like client IDs and secrets are stored as environment variables, not in the code.
- **Internal Functions**: Convex's internal functions are used to prevent direct client access to sensitive operations.
- **Automatic Refresh**: Tokens are automatically refreshed before they expire, reducing the window of vulnerability.

## Usage

### Client-side Token Check

To ensure a valid Canva access tokens from client-side :

```typescript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function MyComponent() {
  const userId = // ... Grab id from somewhere
  const ensureToken = useMutation(api.accessTokenHelper.ensureCanvaAccessToken);

  const handleCanvaAction = async () => {
    await ensureToken({ userId });
    // Safely make Canva api call
  };

  // ...
}
```

### Server-side Token Usage

For internal actions or mutations that want an canva acess token:

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

## Best Practices

- Use `ensureCanvaAccessToken` on the client-side before initiating operations that require Canva API access.
- Always use `getCanvaAccessToken` in server-side functions before making Canva API calls to guarantee a valid token.
- Keep the Canva client ID and secret secure and never commit them to version control.
- Regularly review and update the token management logic to align with Canva's latest API guidelines.

## Conclusion

This token management system demonstrates a commitment to security and best practices in API integration. By providing both client-side and server-side mechanisms for ensuring valid tokens, we create a robust and flexible system for interacting with the Canva API.
