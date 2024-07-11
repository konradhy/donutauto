# DonutAuto Technical Stack and Setup Guide

## Overview

DonutAuto is an automated marketing platform for small to medium-sized businesses, particularly in the food and beverage industry. It combines Canva's design capabilities with AI-driven content generation to streamline the creation of marketing campaigns across digital channels. DonutAuto uses customer data from CRM systems to create personalized marketing materials. This approach helps businesses create targeted content efficiently, improving their digital marketing efforts without requiring extensive design or marketing expertise.

![DonutAuto Overview](path/to/overview.gif)
*DonutAuto in action: Creating a personalized marketing campaign*

## Core Technologies

- Frontend: Next.js (React) with App Router
- Backend: Convex
- Authentication: Clerk
- Styling: Tailwind CSS with shadcn/ui components
- API Integration: Canva Connect APIs
- Logging: Winston

## Key Features

1. Customer Management:
   - CRUD operations for customer data
   - Customer list view with pagination

   ![Customer Management](path/to/customer-management.png)
   *DonutAuto's customer management interface*

2. Campaign Generation:
   - Bulk campaign creation using Canva templates
   - Integration with Canva's design capabilities

   ![Campaign Generation](path/to/campaign-generation.gif)
   *Creating a multi-channel marketing campaign with DonutAuto*

3. Brand Template Settings:
   - Custom template management for various platforms (email, social media)

   ![Brand Template Settings](path/to/brand-templates.png)
   *Customizing brand templates for different marketing channels*

4. Canva Integration:
   - OAuth flow for connecting Canva accounts
   - Automatic token refresh mechanism

   ![Canva Integration](path/to/canva-integration.png)
   *Seamless integration with Canva's design tools*

5. Analytics Dashboard:
   - Overview of campaign performance
   - Customer engagement metrics

   ![Analytics Dashboard](path/to/analytics-dashboard.png)
   *Real-time analytics and performance metrics*

6. AI-Powered Content Generation:
   - Content creation based on CRM data
   - Adaptation of messaging to customer preferences

   ![AI Content Generation](path/to/ai-content.gif)
   *AI generating personalized content based on customer data*

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env` file in the root directory for development environment
   - Set up environment variables in Convex dashboard
4. Set up Canva integration:
   - Create a Canva integration in the Developer Portal
   - Configure scopes and authentication URL
5. Configure Convex:
   - Set up Convex project
6. Run the development servers:
   - `npx convex dev`
   - `npm run dev`

## Environment Variables

### Development Environment (.env)

- CONVEX_DEPLOYMENT
- NEXT_PUBLIC_CONVEX_URL
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- NEXT_PUBLIC_BASE_URL
- NEXT_PUBLIC_BACKEND_HOST
- CANVA_CLIENT_ID
- CANVA_CLIENT_SECRET
- BASE_CANVA_CONNECT_API_URL

### Convex Dashboard

- BASE_CANVA_CONNECT_API_URL
- CANVA_CLIENT_ID
- CANVA_CLIENT_SECRET
- CLERK_JWT_ISSUER_DOMAIN

## Deployment

Deployment is managed through Vercel with GitHub integration:

1. Push your code to a GitHub repository
2. Connect your GitHub account to Vercel
3. Import the project from GitHub in Vercel dashboard
4. Configure environment variables in Vercel
5. Deploy the application

Vercel automatically deploys updates for the main branch, preview branches, and deployment branches, ensuring a smooth CI/CD pipeline.

## Additional Resources

- Convex and Clerk integration guide: https://docs.convex.dev/auth/clerk
- Canva integration setup guide: https://www.canva.dev/docs/connect/quick-start/
