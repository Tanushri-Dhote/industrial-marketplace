
## TODO - Mobile/Tablet Responsiveness (No UI redesign)

### Steps
- [x] Inspect which index.html is used by Vite (frontend/index.html vs frontend/public/index.html) and ensure correct viewport meta.

- [x] Update `frontend/src/styles/global.css` to prevent common mobile overflow/cropping issues without altering the UI design.

- [x] Patch any layout/header/footer fixed-size behaviors if they cause horizontal overflow on mobile.


- [x] Ensure tables/containers always use horizontal scrolling where needed.


- [x] Run frontend: `npm install` (if needed), `npm run dev`, and visually test key pages at mobile/tablet widths.

- [ ] Run `npm run build` to ensure no build errors.

