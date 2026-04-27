# Admin Implementation - Testing Guide

## Quick Start Testing

### 1. Backend Setup & API Testing

#### Start the Backend Server

```bash
cd backend
npm install
npm start
```

#### Test Brand Endpoints with cURL

**Get All Brands (Public)**

```bash
curl http://localhost:3000/api/brands
```

Expected Response:

```json
[
	{
		"_id": "...",
		"name": "BMW",
		"slug": "bmw",
		"productMake": "BMW",
		"logoUrl": "...",
		"isActive": true
	}
]
```

**Get All Brands (Admin)**

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/brands/admin/all
```

**Get Brand by Slug**

```bash
curl http://localhost:3000/api/brands/bmw
```

**Create Brand (Admin)**

```bash
curl -X POST http://localhost:3000/api/brands/admin/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mercedes",
    "slug": "mercedes",
    "productMake": "Mercedes-Benz",
    "logoUrl": "https://example.com/mercedes-logo.png",
    "heroImage": "https://example.com/mercedes-hero.jpg",
    "description": "Premium luxury vehicles",
    "isActive": true
  }'
```

**Update Brand**

```bash
curl -X PUT http://localhost:3000/api/brands/admin/:brandId \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mercedes-Benz",
    "description": "Updated description"
  }'
```

**Delete Brand**

```bash
curl -X DELETE http://localhost:3000/api/brands/admin/:brandId \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Model Endpoints

**Get Models by Brand (Public)**

```bash
curl http://localhost:3000/api/models/:brandId
```

**Get All Models (Admin)**

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/models/admin/all
```

**Create Model (Admin)**

```bash
curl -X POST http://localhost:3000/api/models/admin/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "brandId": "BRAND_ID_HERE",
    "name": "3 Series",
    "slug": "3-series",
    "imageUrl": "https://example.com/3-series.jpg",
    "isActive": true
  }'
```

**Update Model**

```bash
curl -X PUT http://localhost:3000/api/models/admin/:modelId \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "3 Series",
    "imageUrl": "https://example.com/3-series-updated.jpg"
  }'
```

**Delete Model**

```bash
curl -X DELETE http://localhost:3000/api/models/admin/:modelId \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get JWT Token for Testing

#### Login to get token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin_password"
  }'
```

Response will include:

```json
{
	"user": {
		"id": "...",
		"email": "admin@example.com",
		"role": "super_admin"
	},
	"token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Use the `token` value in subsequent Authorization headers.

---

## Frontend Testing

### 1. Setup Frontend

```bash
cd frontend
npm install
npm start
```

### 2. Access Admin Dashboard

1. Navigate to `http://localhost:3000`
2. Log in with admin credentials
3. Click on Dashboard in navigation
4. You should see sidebar with multiple modules

### 3. Test Brands Module

#### View Brands

- Click "Brands" in the dashboard sidebar
- Should see table with all existing brands
- Verify brand names, slugs, and logos are displayed

#### Create Brand

1. Click "Add Brand" button
2. Fill in:
   - Name: "Audi"
   - Slug: "audi"
   - Make: "Audi"
   - Logo URL: "https://via.placeholder.com/150"
   - Hero Image: "https://via.placeholder.com/1200x400"
   - Description: "Premium performance vehicles"
3. Click "Create"
4. Verify success toast notification
5. Verify new brand appears in table

#### Edit Brand

1. Click pencil icon next to any brand
2. Update the description
3. Click "Update"
4. Verify changes in table

#### Delete Brand

1. Click trash icon next to any brand
2. Confirm deletion in dialog
3. Verify brand is removed from table

#### Search Brands

1. Type brand name in search box
2. Verify table filters in real-time
3. Try searching by slug or make

### 4. Test Models Module

#### View Models

- Click "Models" in the dashboard sidebar
- Should see table with all models
- Verify model names, brands, and images are displayed

#### Create Model

1. Click "Add Model" button
2. Fill in:
   - Brand: Select any existing brand from dropdown
   - Model Name: "A4"
   - Slug: "a4"
   - Model Image: "https://via.placeholder.com/200"
3. Click "Create"
4. Verify success toast notification
5. Verify new model appears in table

#### Edit Model

1. Click pencil icon next to any model
2. Update the model name or image
3. Click "Update"
4. Verify changes in table

#### Delete Model

1. Click trash icon next to any model
2. Confirm deletion in dialog
3. Verify model is removed from table

#### Search Models

1. Type model name in search box
2. Verify table filters in real-time
3. Try searching by brand name

### 5. Test Public Brand/Model Selector

#### Navigate to Homepage

1. Go to `http://localhost:3000`
2. Scroll to Brand/Model Selector section (should be after hero)
3. Verify all active brands are displayed as logo grid

#### Select Brand

1. Click on a brand logo
2. Should smoothly animate to Step 2
3. Should show all models for that brand
4. Verify images load for models (if set)

#### Select Model

1. Click on a model
2. Should navigate to products page with query: `?brand=BRAND_SLUG&model=MODEL_SLUG`
3. URL should update correctly

#### Test Caching

1. Select a brand, then go back
2. Select same brand again
3. Should load faster (from cache)
4. Check browser DevTools Network tab - should see fewer requests

---

## Integration Testing

### 1. Admin Creates Brand/Model

1. In admin panel, create new brand "Toyota"
2. Create models "Corolla", "Camry" under Toyota
3. Go to homepage and refresh
4. Verify Toyota appears in brand selector
5. Click Toyota and verify both models appear
6. Select a model and verify correct URL parameters

### 2. Admin Edits Active Status

1. In Brands module, edit a brand to set `isActive: false`
2. Go to homepage and refresh
3. Verify brand no longer appears in selector

### 3. Admin Deletes Brand

1. In Brands module, create test brand "TestBrand"
2. Create test model "TestModel"
3. Delete the brand
4. Verify model is also removed (if cascade delete is configured)
5. Go to homepage and verify no references to deleted brand

### 4. Multiple Browser Tabs

1. Open admin dashboard in Tab 1
2. Open homepage in Tab 2
3. Create new brand in Tab 1
4. Go to Tab 2 and refresh
5. Verify new brand appears (React Query invalidation)

---

## Postman Collection Testing

Create a Postman collection with these endpoints:

### Collection Variables

```json
{
	"base_url": "http://localhost:3000",
	"jwt_token": "YOUR_JWT_TOKEN_HERE",
	"brand_id": "PASTE_BRAND_ID_HERE",
	"model_id": "PASTE_MODEL_ID_HERE"
}
```

### Requests

**1. Get All Brands**

- Method: GET
- URL: `{{base_url}}/api/brands`
- Tests: Verify status 200, response is array

**2. Create Brand**

- Method: POST
- URL: `{{base_url}}/api/brands/admin/create`
- Headers: `Authorization: Bearer {{jwt_token}}`
- Body (JSON):

```json
{
	"name": "TestBrand",
	"slug": "test-brand",
	"productMake": "TestBrand",
	"logoUrl": "https://via.placeholder.com/150"
}
```

- Tests: Verify status 201, save brand_id

**3. Get Models by Brand**

- Method: GET
- URL: `{{base_url}}/api/models/{{brand_id}}`
- Tests: Verify status 200

**4. Create Model**

- Method: POST
- URL: `{{base_url}}/api/models/admin/create`
- Headers: `Authorization: Bearer {{jwt_token}}`
- Body (JSON):

```json
{
	"brandId": "{{brand_id}}",
	"name": "TestModel",
	"slug": "test-model"
}
```

- Tests: Verify status 201, save model_id

**5. Update Model**

- Method: PUT
- URL: `{{base_url}}/api/models/admin/{{model_id}}`
- Headers: `Authorization: Bearer {{jwt_token}}`
- Body (JSON):

```json
{
	"name": "UpdatedTestModel"
}
```

- Tests: Verify status 200

**6. Delete Model**

- Method: DELETE
- URL: `{{base_url}}/api/models/admin/{{model_id}}`
- Headers: `Authorization: Bearer {{jwt_token}}`
- Tests: Verify status 200

**7. Delete Brand**

- Method: DELETE
- URL: `{{base_url}}/api/brands/admin/{{brand_id}}`
- Headers: `Authorization: Bearer {{jwt_token}}`
- Tests: Verify status 200

---

## Performance Testing

### 1. Load Time

1. Open admin Brands module
2. Check DevTools Network tab
3. Initial load should be < 1 second
4. Subsequent loads should be instant (cached)

### 2. Search Performance

1. With 100+ brands in database
2. Type in search box
3. Filter should respond instantly (client-side)

### 3. Image Loading

1. Upload or paste URLs for brand logos
2. Verify all images load without errors
3. Check browser console for 404s or mixed content warnings

### 4. API Response Time

1. Use DevTools Network tab to monitor API calls
2. Create brand request should complete < 1s
3. List brands request should complete < 500ms

---

## Error Handling Testing

### 1. Missing Required Fields

1. Try to create brand without name
2. Should show validation error
3. Should prevent form submission

### 2. Duplicate Slug

1. Create brand with slug "bmw"
2. Try to create another brand with slug "bmw"
3. Should show error message "Slug already exists"

### 4. Invalid Brand ID

1. Try to create model with invalid/non-existent brandId
2. Should show error: "Brand not found"

### 5. Unauthorized Access

1. Remove JWT token from localStorage
2. Try to access admin panels
3. Should redirect to login page

### 6. Network Error

1. Disconnect internet
2. Try to create/edit item
3. Should show error: "Network error"
4. Reconnect
5. Should be able to retry

---

## Browser Compatibility

Test in:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Mobile-Specific Tests

1. Verify responsive design on admin panels
2. Check table scrolling on small screens
3. Test modal forms on mobile
4. Verify brand/model selector grid reflows correctly

---

## Accessibility Testing

Using browser DevTools Accessibility tab:

1. Open Brands module
2. Run accessibility audit
3. Fix any issues found
4. Test keyboard navigation:
   - Tab through form fields
   - Enter to submit
   - Escape to close modals

---

## Success Criteria Checklist

- [ ] All 6 brand endpoints return correct status codes
- [ ] All 5 model endpoints return correct status codes
- [ ] Admin can create brand via dashboard
- [ ] Admin can create model via dashboard
- [ ] Brand logos display correctly
- [ ] Model images display correctly
- [ ] Search works in both modules
- [ ] Edit functionality updates database
- [ ] Delete functionality removes items
- [ ] New brands appear in public selector
- [ ] New models appear when brand is selected
- [ ] Error messages display for invalid operations
- [ ] Validation prevents incomplete submissions
- [ ] Loading spinners show during operations
- [ ] Toast notifications appear for success/error
- [ ] Role-based access control works
- [ ] Unauthorized users see error
- [ ] React Query caching works
- [ ] Responsive design works on mobile
- [ ] No console errors or warnings

---

## Next Steps After Testing

1. **If all tests pass:**
   - Seed initial data (BMW, Mercedes, Audi models)
   - Deploy to staging
   - Do end-to-end testing

2. **If some tests fail:**
   - Check specific error messages in console
   - Verify JWT token is valid
   - Check database connection
   - Review route registration in fastifyApp.js

3. **Additional work needed:**
   - Implement actual file upload (currently URL-based)
   - Add bulk import functionality
   - Add analytics/audit trail
   - Consider pagination for large datasets
