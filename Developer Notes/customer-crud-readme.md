# DonutAuto Customer Management

## Overview
The Customer Management system in DonutAuto enables users to efficiently handle customer data. It provides functionalities for adding, editing, and deleting customer information, as well as bulk uploading customers via CSV. This system is designed to streamline the process of managing customer data for small to medium-sized businesses, particularly in the food and beverage industry.

![Customer Management Overview](path/to/customer-management-overview.gif)
*DonutAuto's Customer Management in action*

## Key Components

1. `customers.ts` (Convex functions):
   - Handles backend operations for customer data
   - Includes functions for CRUD operations and bulk actions

2. `CustomerEditPage` component:
   - Provides interface for editing individual customer details
   - Implements real-time updates with debounced saving

3. `CSVBulkCustomerUploader` component:
   - Allows bulk upload of customers via CSV file
   - Processes and validates CSV data

4. `CSVTemplateDownloader` component:
   - Generates and downloads a CSV template for bulk uploads

5. `CustomerList` component:
   - Displays paginated list of customers
   - Provides options for editing, deleting, and campaign generation

## Workflow

1. User adds customers individually or via bulk upload
2. Customer data is stored and managed in the Convex backend
3. Users can view, edit, or delete customer information as needed
4. Customer data is used for generating targeted marketing campaigns

## Key Features

- Individual customer addition and editing
- Bulk customer upload via CSV
- Real-time updates with debounced saving
- Paginated customer list view
- Campaign generation for individual or multiple customers

## Usage

### Adding a Single Customer

```typescript
const addCustomer = useMutation(api.customers.add);

const handleAddCustomer = async (customerData) => {
  try {
    await addCustomer(customerData);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Bulk Uploading Customers

```typescript
const bulkAddCustomers = useMutation(api.customers.bulkAddCustomers);

const handleBulkUpload = async (csvData) => {
  try {
    const result = await bulkAddCustomers({ customers: csvData });
    console.log(`Added: ${result.addedCount}, Skipped: ${result.skippedCount}`);
  } catch (error) {
    // Handle error
  }
};
```

### Editing a Customer

```typescript
const updateCustomerField = useMutation(api.customers.updateCustomerField);

const handleFieldUpdate = async (customerId, field, value) => {
  try {
    await updateCustomerField({ id: customerId, field, value });
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Limitations

- Maximum of 3 preferences per customer
- Real-time updates may have a slight delay due to debounce

## Future Considerations

1. Implement advanced search and filtering options for customer list
2. Add support for custom fields in customer profiles
3. Develop a customer segmentation feature for targeted campaign creation
