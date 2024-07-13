# DonutAuto Organization Feature

## Overview
The Organization Feature in DonutAuto allows businesses to collaborate within a shared workspace. It enables multiple team members to work together on marketing campaigns, customer management, and analytics. The feature implements role-based access control and a structured invitation system, which enhances security and streamlines workflow. This is useful for agencies managing multiple clients or growing businesses that need to delegate tasks across a team while maintaining control over access and permissions.

![Organization Management](path/to/organization-management.gif)
*DonutAuto's Organization Management in action*

## Key Components

1. `organizations.ts`:
   - Handles organization-related operations (create, join, list users)
   - Manages user roles and permissions within organizations

2. `invitations.ts`:
   - Manages the invitation system for adding new members to an organization
   - Handles creation, listing, and revoking of invitations

3. `OrgAuthGuard`:
   - Ensures users are part of an organization before accessing certain routes
   - Redirects users to join an organization if they don't belong to one

4. `InviteUserForm`:
   - Provides an interface for inviting new users to the organization
   - Allows selection of roles for invited users

5. Organization Management Page:
   - Displays current team members and their roles
   - Shows pending invitations with options to revoke

## Workflow

1. User creates an organization or accepts an invitation to join one
2. Organization admins can invite new members and assign roles
3. Invited users can accept invitations to join the organization
4. Team members can access organization-specific features and data
5. Admins can manage user roles and revoke invitations

## Key Features

- Organization creation and management
- Role-based access control (Admin, Editor, Viewer)
- User invitation system
- Team member listing and management
- Pending invitation management

## Usage

### Creating an Organization

```typescript
const createOrganization = useMutation(api.organizations.create);

const handleCreateOrg = async (orgName: string) => {
  try {
    await createOrganization({ name: orgName });
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Inviting a User

```typescript
const createInvitation = useMutation(api.invitations.createInvitation);

const handleInvite = async (email: string, role: "admin" | "editor" | "viewer") => {
  try {
    await createInvitation({ email, role });
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Accepting an Invitation

```typescript
const acceptInvitation = useMutation(api.organizations.acceptInvitation);

const handleAcceptInvitation = async (invitationId: Id<"invitations">) => {
  try {
    await acceptInvitation({ invitationId });
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Limitations

- Users can only belong to one organization at a time

## Future Considerations

1. Implement multi-organization support for users
2. Add more granular permission controls within roles
3. Develop an audit log for organization actions
