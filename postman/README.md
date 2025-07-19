# Postman Setup Guide for LITF Content Service

## Quick Setup

1. **Import Collection**: Import `LITF-Content-Service.postman_collection.json` into Postman
2. **Import Environment**: Import `LITF-Content-Service.postman_environment.json` into Postman
3. **Select Environment**: Choose "LITF Content Service Environment" in Postman
4. **Start Local Server**: Run `npm run dev` in your project directory

## Environment Variables

The environment includes these variables:
- `baseUrl`: API base URL (default: http://localhost:4008)
- `section_id`: For testing section-specific endpoints
- `item_id`: For testing item-specific endpoints  
- `testimonial_id`: For testing testimonial-specific endpoints
- `faq_id`: For testing FAQ-specific endpoints

## Testing Workflow

### 1. Start with Public Endpoints
- Test `Get All Content` to see seeded data
- Test individual section endpoints (hero, about, features, etc.)

### 2. Test CRUD Operations
- Create new content using POST endpoints
- Copy IDs from responses and set them in environment variables
- Test UPDATE and DELETE operations using the stored IDs

### 3. Verify Changes
- Use GET endpoints to verify your changes
- Check admin endpoint to see inactive content

## Sample Test Sequence

1. **GET** `/content` - See all content
2. **POST** `/content/sections` - Create a new section
3. Copy the `id` from response to `section_id` environment variable
4. **POST** `/content/items` - Create item for the new section
5. **GET** `/content/section/new-section` - Verify the new content
6. **PUT** `/content/sections/{{section_id}}` - Update the section
7. **DELETE** `/content/sections/{{section_id}}` - Clean up

## Tips

- Use the **Tests** tab in Postman to automatically extract IDs:
  ```javascript
  if (pm.response.code === 200) {
      const response = pm.response.json();
      if (response.data && response.data.id) {
          pm.environment.set("section_id", response.data.id);
      }
  }
  ```

- Check response status codes:
  - 200: Success
  - 400: Bad Request (validation errors)
  - 404: Not Found
  - 500: Server Error

## FAQ Categories Available
- general
- booth-booking  
- payment
- event-info
- registration
- support