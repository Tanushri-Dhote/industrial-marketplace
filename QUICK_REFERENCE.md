# Quick Reference Guide - Brand & Model Admin System

## 🚀 Quick Start (5 minutes)

```bash
# 1. Seed the database
cd backend
node scripts/seedBrandsAndModels.js

# 2. Start backend
npm start

# 3. In another terminal, start frontend
cd frontend
npm start

# 4. Open http://localhost:3000 and log in
# 5. Go to Dashboard → Brands or Models
```

---

## 📍 File Locations

| What             | File                       | Location                             |
| ---------------- | -------------------------- | ------------------------------------ |
| Brand CRUD logic | fastifyBrand.controller.js | `backend/src/controllers/`           |
| Model CRUD logic | fastifyModel.controller.js | `backend/src/controllers/`           |
| Brand routes     | brand.routes.js            | `backend/src/routes/fastify/`        |
| Model routes     | model.routes.js            | `backend/src/routes/fastify/`        |
| Brand UI         | BrandsModule.jsx           | `frontend/src/components/dashboard/` |
| Model UI         | ModelsModule.jsx           | `frontend/src/components/dashboard/` |
| Admin Dashboard  | DashboardPage.jsx          | `frontend/src/pages/`                |
| Seed script      | seedBrandsAndModels.js     | `backend/scripts/`                   |

---

## 🔌 API Endpoints

### Public Endpoints (No Auth)

```
GET  /api/brands                    → All active brands
GET  /api/brands/:slug              → Single brand by slug
GET  /api/models/:brandId           → Models for a brand
```

### Admin Endpoints (Requires JWT + admin role)

```
GET    /api/brands/admin/all        → All brands
POST   /api/brands/admin/create     → Create brand
PUT    /api/brands/admin/:id        → Update brand
DELETE /api/brands/admin/:id        → Delete brand

GET    /api/models/admin/all        → All models
POST   /api/models/admin/create     → Create model
PUT    /api/models/admin/:id        → Update model
DELETE /api/models/admin/:id        → Delete model
```

---

## 📝 Common Tasks

### Test an Endpoint

```bash
# Get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Copy token, then use it:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/brands/admin/all
```

### Create a Brand (from code)

```javascript
const response = await fetch("/api/brands/admin/create", {
	method: "POST",
	headers: {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		name: "BMW",
		slug: "bmw",
		productMake: "BMW",
		logoUrl: "https://example.com/logo.png",
	}),
});
```

### Query Brands (from code)

```javascript
// Using React Query (in components)
const { data: brands } = useQuery({
	queryKey: ["brands"],
	queryFn: () => fetch("/api/brands").then((r) => r.json()),
});

// Using fetch
const brands = await fetch("/api/brands").then((r) => r.json());
```

---

## 🎨 UI Component Usage

### BrandsModule

```jsx
import BrandsModule from "@/components/dashboard/BrandsModule";

<BrandsModule />; // Renders entire admin interface for brands
```

### ModelsModule

```jsx
import ModelsModule from "@/components/dashboard/ModelsModule";

<ModelsModule />; // Renders entire admin interface for models
```

---

## 🔄 Database Schema

### Brand Model

```javascript
{
  name: String,           // Required
  slug: String,          // Required, unique
  productMake: String,   // Required
  logoUrl: String,
  heroImage: String,
  description: String,
  isActive: Boolean,     // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

### Model Schema

```javascript
{
  brandId: ObjectId,     // Reference to Brand
  name: String,          // Required
  slug: String,          // Required
  imageUrl: String,      // NEW
  series: String,        // NEW (e.g., "3 Series", "X Series")
  isActive: Boolean,     // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Required Roles

Only these roles can access admin brand/model management:

- `super_admin`
- `admin`
- `website_manager`

---

## 📊 Query Keys (React Query)

```javascript
// Brands queries
["brands"]["brands-admin"][("brand", brandId)][ // Public list // Admin list // Single brand
	// Models queries
	"models"
][("models", brandId)]["models-admin"][("model", modelId)]; // Public list // Models by brand // Admin list // Single model
```

---

## 🐛 Debugging

### Check API is running

```bash
curl http://localhost:3000/api/brands
# If no response, backend is not running
```

### Check JWT token

```javascript
// In browser console
localStorage.getItem("token");
// Should show a long encoded string
```

### Check brand-model association

```bash
# Make sure brandId matches an actual brand
curl http://localhost:3000/api/models/BRAND_ID
# If empty, check if brand exists and models have right brandId
```

### View database data

```javascript
// In MongoDB shell
use industrial-marketplace
db.brands.find()
db.models.find()
```

---

## 🚦 Status Codes Reference

```
200 OK              ✅ Request successful
201 Created         ✅ New resource created
400 Bad Request     ❌ Missing/invalid fields
401 Unauthorized    ❌ Auth required or token invalid
403 Forbidden       ❌ Wrong role for endpoint
404 Not Found       ❌ Resource doesn't exist
409 Conflict        ❌ Duplicate slug
500 Server Error    ❌ Backend error
```

---

## 📱 Frontend Components Tree

```
DashboardPage
├── BrandsModule
│   ├── BrandTable
│   ├── SearchBox
│   ├── AddBrandModal
│   ├── EditBrandModal
│   └── DeleteConfirmation
└── ModelsModule
    ├── ModelTable
    ├── BrandSelector
    ├── SearchBox
    ├── AddModelModal
    ├── EditModelModal
    └── DeleteConfirmation
```

---

## 🔄 Data Flow Diagram

```
User Interface (BrandsModule.jsx)
         ↓
React Query (cache + mutations)
         ↓
API Call (fetch)
         ↓
Fastify Route (brand.routes.js)
         ↓
Controller (fastifyBrand.controller.js)
         ↓
Mongoose Model (Brand.js)
         ↓
MongoDB Database
```

---

## ⚡ Performance Tips

1. **Caching Works Automatically** - 30-minute cache, no additional setup needed
2. **Images** - Use placeholder URLs during development: `https://via.placeholder.com/200?text=BrandName`
3. **Search** - Client-side, instant (works for datasets up to ~1000 items)
4. **Batch Operations** - Not yet implemented, consider for 1000+ items

---

## 🔗 Related Documentation

- **Full Details**: `ADMIN_IMPLEMENTATION.md`
- **Testing**: `TESTING_GUIDE.md`
- **Status**: `ADMIN_IMPLEMENTATION_STATUS.md`
- **Seed Data**: `backend/scripts/seedBrandsAndModels.js`

---

## 💡 Pro Tips

1. **Get all brands with models count**:

```javascript
const brands = await fetch("/api/brands/admin/all").then((r) => r.json());
brands.map((b) => ({ name: b.name, slug: b.slug }));
```

2. **Create multiple brands quickly**:

```bash
for brand in BMW Mercedes Audi; do
  curl -X POST http://localhost:3000/api/brands/admin/create \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"$brand\",\"slug\":\"${brand,,}\",\"productMake\":\"$brand\"}"
done
```

3. **Reset database**:

```javascript
// In MongoDB shell
use industrial-marketplace
db.brands.deleteMany({})
db.models.deleteMany({})
```

4. **Test React Query cache**:

```javascript
// Open DevTools, go to Application → LocalStorage
// Search for '@tanstack/react-query'
// You'll see cached queries there
```

---

## ❓ FAQ

**Q: Can users without admin role see the Brands/Models modules?**
A: No, only super_admin, admin, and website_manager roles can access them.

**Q: Do I need to restart the server when I update a brand?**
A: No, changes are live immediately. React Query keeps data in sync.

**Q: Can I use real image URLs instead of placeholders?**
A: Yes! Just paste your image URL in the logoUrl or imageUrl field.

**Q: What happens if I delete a brand with models?**
A: The models are NOT automatically deleted (soft delete). They become orphaned. Consider adding cascade delete if needed.

**Q: How do I backup the brands and models?**
A: Export from MongoDB: `mongoexport --collection brands --db industrial-marketplace --out brands.json`

**Q: Can I bulk import brands from CSV?**
A: Not yet. This is a future enhancement. Currently do it via API.

**Q: Are admin operations logged?**
A: Not yet. No audit trail exists currently.

**Q: What's the max number of brands/models?**
A: No hard limit. Table search is client-side, so pagination recommended above 1000 items.

---

## 🆘 Quick Troubleshooting

| Problem             | Check                 | Solution                                       |
| ------------------- | --------------------- | ---------------------------------------------- |
| 401 Unauthorized    | JWT token valid?      | Log in again to get new token                  |
| 404 Not Found       | Endpoint URL correct? | Verify route name and method                   |
| Empty brands list   | Database has data?    | Run seed script: `node seedBrandsAndModels.js` |
| Modules not showing | User has right role?  | Check user role is admin/super_admin           |
| Images don't load   | Image URL valid?      | Test URL in browser, ensure HTTPS              |
| Search doesn't work | Typing in search box? | Check browser console for errors               |
| Changes not visible | Need to refresh?      | React Query should auto-update, try refresh    |

---

## 📞 Need Help?

1. Check `TESTING_GUIDE.md` for detailed testing steps
2. Check `ADMIN_IMPLEMENTATION.md` for feature details
3. Look for error messages in browser console
4. Check backend logs for API errors
5. Verify database connection and data exists

---

**Last Updated**: [Current Date]
**Version**: 1.0 (Complete Implementation)
**Status**: ✅ Ready for Production
