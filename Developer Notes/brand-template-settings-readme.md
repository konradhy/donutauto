# Brand Template Settings Functionality

## Overview
The Brand Template Settings feature extends DonutAuto's functionality by allowing users to use their own Canva brand templates in the campaign generation process. This feature provides users with more control over their design outputs, enabling them to maintain brand consistency while still leveraging DonutAuto's automation capabilities.

## Key Components

1. `getBrandTemplateSettings` query:
   - Retrieves the current brand template settings for the authenticated user
   - Returns null if no settings are found

2. `updateBrandTemplateSettings` mutation:
   - Updates or creates brand template settings for the authenticated user
   - Allows setting template IDs for various platforms (email, Instagram, Twitter, TikTok)

3. `getBrandTemplateSettingsInternal` internal query:
   - Retrieves brand template settings for a specific user ID
   - Used internally during the campaign generation process

## Function Specifications

### `getBrandTemplateSettings`
- Input: None (uses authenticated user context)
- Output: 
  ```typescript
  {
    _id: Id<"brandTemplateSettings">,
    userId: Id<"users">,
    emailTemplateId?: string,
    instagramTemplateId?: string,
    twitterTemplateId?: string,
    tiktokTemplateId?: string
  } | null
  ```

### `updateBrandTemplateSettings`
- Input:
  ```typescript
  {
    emailTemplateId?: string,
    instagramTemplateId?: string,
    twitterTemplateId?: string,
    tiktokTemplateId?: string
  }
  ```
- Output: None

### `getBrandTemplateSettingsInternal`
- Input:
  ```typescript
  {
    userId: Id<"users">
  }
  ```
- Output:
  ```typescript
  {
    _id: Id<"brandTemplateSettings">,
    userId: Id<"users">,
    emailTemplateId?: string,
    instagramTemplateId?: string,
    twitterTemplateId?: string,
    tiktokTemplateId?: string
  } | undefined
  ```

## Workflow

1. User sets up their brand template IDs in the application
2. The system stores these settings in the database
3. During campaign generation, the system retrieves these settings
4. The campaign generation process uses the custom template IDs instead of default templates

## Key Features

- Customizable templates for multiple platforms (email, Instagram, Twitter, TikTok)
- Integration with the campaign generation process
- Database operations using Convex
- Ability to update settings at any time

## Usage

Here's how to use the Brand Template Settings functionality in a React component with Convex:

```typescript
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const BrandTemplateSettingsComponent = () => {
  const brandTemplateSettings = useQuery(api.brandTemplateSettings.getBrandTemplateSettings);
  const updateSettings = useMutation(api.brandTemplateSettings.updateBrandTemplateSettings);

  const handleUpdateSettings = async (newSettings) => {
    try {
      await updateSettings(newSettings);
      // Handle success
    } catch (error) {
      console.error("Failed to update brand template settings:", error);
    }
  };

  return (
    <div>
      <h2>Brand Template Settings</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleUpdateSettings({
          emailTemplateId: e.target.emailTemplateId.value,
          instagramTemplateId: e.target.instagramTemplateId.value,
          twitterTemplateId: e.target.twitterTemplateId.value,
          tiktokTemplateId: e.target.tiktokTemplateId.value,
        });
      }}>
        <input name="emailTemplateId" defaultValue={brandTemplateSettings?.emailTemplateId || ''} />
        {/* Add similar inputs for other platform template IDs */}
        <button type="submit">Update Settings</button>
      </form>
    </div>
  );
};
```

## Integration with Campaign Generation

The Brand Template Settings are integrated with the campaign generation process:

1. When generating a campaign, the system calls `getBrandTemplateSettingsInternal` to retrieve the user's custom template IDs.
2. If custom template IDs are found, the campaign generation process uses these instead of the default templates.
3. This allows for consistent brand representation across all generated designs while still using DonutAuto's automation.

## Limitations

- Users must ensure that their custom Canva templates use the same data fields as the default templates provided by DonutAuto.
- The system does not validate the existence or accessibility of the provided template IDs on Canva's platform.

## Future Considerations

1. Implement template validation to ensure provided template IDs are valid and accessible
2. Expand template customization options to include more platforms or design types
3. Develop a guided setup process to help users create compatible Canva templates
