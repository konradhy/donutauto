# Generate Campaign Functionality

## Overview
The Generate Campaign feature allows users to automatically create design campaigns for their customers using Canva's API. By automating the creation of multiple designs across various platforms, this feature significantly reduces the time and effort required for campaign creation. It enables users to maintain consistency across designs while scaling their output, making it particularly valuable for agencies and businesses managing multiple clients or large-scale campaigns.

## Key Components

1. `generateCampaign` mutation:
   - Initiates the campaign generation process for a single customer
   - Checks user authentication and Canva connection
   - Schedules the actual generation process using Convex's scheduler

2. `generateCampaigns` mutation:
   - Batch processes campaign generation for multiple customers
   - Implements a batching mechanism to handle large numbers of customers efficiently

3. `generateCampaignAction` (internal action):
   - Performs the actual campaign generation using Canva's API
   - Creates designs for various platforms based on customer data

4. `saveCampaignResults` internal mutation:
   - Saves the results of the campaign generation process
   - Creates a new campaign entry and associated design entries in the database

## Workflow

1. User initiates campaign generation for one or multiple customers
2. System checks authentication and Canva connection
3. Campaign generation is scheduled as an asynchronous action
4. Action creates designs using Canva's API for each required platform
5. Results are saved to the database, linking designs to campaigns and customers

## Key Features

- Single and batch campaign generation
- Asynchronous processing
- Integration with Canva's API for design creation
- Error handling and logging
- Database updates using Convex

## Usage

Here's how to use the Generate Campaign functionality in a React component:

```typescript
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const CampaignGeneratorComponent = () => {
  const generateCampaigns = useMutation(api.campaigns.generateCampaigns);

  const handleGenerateCampaigns = async () => {
    const customerIds = [/* array of customer IDs */];
    try {
      const result = await generateCampaigns({ customerIds });
      console.log(result.message);
      // Handle success
    } catch (error) {
      console.error("Campaign generation error:", error);
      // Handle error
    }
  };

  return (
    <button onClick={handleGenerateCampaigns}>
      Generate Campaigns
    </button>
  );
};
```

## Limitations

- Requires active Canva API connection
- Campaign generation time may vary based on the number of customers and designs
- Design creation is limited to templates and data fields supported by Canva API

## Future Considerations

1. Implement more sophisticated error handling and retries
2. Add progress tracking for batch campaign generation
3. Create a user interface for monitoring campaign generation progress
4. Enhance the AI-powered design suggestion capabilities
5. Integrate with multiple social media platforms for direct posting
