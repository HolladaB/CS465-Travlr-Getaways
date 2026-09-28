# Travlr | Full-stack travel catalog

Travlr is a travel catalog with a server-rendered public site and a separate Angular administration interface. Express exposes trip data through a REST API; MongoDB stores trips and administrator accounts. Signed-in administrators can add, edit, and delete trips.

> Portfolio update of an SNHU full-stack course project. The original `final` branch is preserved. This branch adds a secure local account setup, completes deletion, and documents reproducible setup.

## What it does

- Public travel pages rendered with Express and Handlebars.
- Angular trip listing and forms for authenticated editing.
- Express API with public reads and JWT-protected create, update, and delete.
- Sample trip data for local development.

## Technology

| Layer | Tools |
| --- | --- |
| Public site and API | Node.js, Express, Handlebars |
| Administration | Angular 19, TypeScript |
| Data | MongoDB, Mongoose |
| Login | Passport local strategy, password hashing, JWT |
| Checks | Node test runner, Angular build, GitHub Actions |

## Run locally

Prerequisites: Node.js 22 or 24, npm, and a local MongoDB server listening on `127.0.0.1:27017`. The MongoDB server is a separate installation and must be running before seeding or using database features. Two terminals are needed for the API and Angular administration page.

1. Clone this repository and check out `portfolio-cleanup` while reviewing this branch.
2. In the repository root, run `npm ci`.
3. Copy `.env.example` to `.env`. In PowerShell: `Copy-Item .env.example .env`.
4. Fill in `JWT_SECRET` in `.env` with a unique random value of at least 32 characters. You can generate one with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Do not commit `.env`.
5. If needed, set `MONGODB_URI` for your own MongoDB server. The example points to a local database.
6. Run `npm run seed` to add the sample trips **only to an empty trips collection**. It refuses to replace existing trips.
7. Set `ADMIN_NAME`, `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` of at least 12 characters in `.env`. Run `npm run create-admin` once. It refuses a duplicate email. The password stays on your machine.
8. Run `npm start` to start Express on `http://localhost:3000`. The public travel catalog is at `/travel`.
9. In a second terminal, run `cd app_admin`, `npm ci`, then `npm start`. Open `http://localhost:4200` and log in with the account from step 7.

If you see `JWT_SECRET must be set`, check that `.env` exists in the repository root and contains a generated secret. If trip pages do not load, confirm MongoDB is running and that `MONGODB_URI` is correct. Do not run the seed command against data you want to keep.

## API

| Method | Route | Access | Result |
| --- | --- | --- | --- |
| GET | `/api/trips` | Public | List trips |
| GET | `/api/trips/:tripCode` | Public | Retrieve matching trip |
| POST | `/api/login` | Public | Get JWT with an existing local administrator account |
| POST | `/api/trips` | JWT | Create trip |
| PUT | `/api/trips/:tripCode` | JWT | Update trip |
| DELETE | `/api/trips/:tripCode` | JWT | Delete trip; 204 on success, 404 if absent |

There is no public signup endpoint. The `create-admin` script is the local bootstrap path. Accounts created in the older course version remain compatible with the password verifier.

## Verification

From the repository root, run `npm test`. These checks verify that unauthenticated edits fail, public signup is unavailable, and authenticated deletion handles found and missing trips. From `app_admin`, run `npm run build`.

The tests mock the database for deletion behavior; they do not replace a full MongoDB integration test. After starting MongoDB, manually verify: public trips load, an administrator logs in, and a sample trip can be created, edited, and deleted. A GitHub Actions workflow runs the automated checks on push and pull request.

## Design decisions and current limits

- The original `final` branch is preserved for comparison. This branch changes only the presentation and the most important functionality/security gaps.
- Registration is disabled as an API route because every account currently has editing access; this application does not implement multiple permission roles.
- Trip data is seeded once into an empty collection rather than deleting existing records.
- The Angular client assumes an API at `http://localhost:3000`; change its service configuration before deploying elsewhere.
- Local MongoDB is required. A hosted demo and real database integration tests are possible future improvements.
