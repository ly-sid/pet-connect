# 6. Testing and Implementation

## 6.1. Test Plan

A **Test Plan** is a formal document detailing the systematic approach, scope, resources, and schedule of intended testing activities to guarantee the software meets its specified functional and non-functional requirements. 

For the **Pet Connect Platform**, the test plan dictates a layered bottom-up validation approach. Execution begins with stateless API controllers (Unit Testing), progresses to Next.js route handler and database transactions (Integration Testing), and culminates in end-to-end Cypress-style automated and manual UI walk-throughs (System Testing). The primary testing resources involve the Next.js local development server (`npm run dev`) paired with an isolated testing PostgreSQL schema to prevent corruption of the production `prisma/seed.js` data. 

## 6.2. Unit Testing

**Unit Testing** isolates and tests the smallest verifiable pieces of software—such as individual functions, React components, or database query definitions—independent of the rest of the application.

Below are four primary unit test cases executed against the Pet Connect internal logic services:

| Test ID | Module / Component | Test Description | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UT-01** | `lib/auth.ts` | Pass an empty string to the `hashPassword` bcrypt utility. | Function throws `Error("Password cannot be empty")`. | Threw matching Error. | **PASS** |
| **UT-02** | `Input.tsx` (Component) | Render the `Input` React component with `required={true}`. | The rendered HTML DOM node contains the `required` attribute. | Node contained attribute. | **PASS** |
| **UT-03** | `Prisma schema` | Attempt to cast a String "Invalid" to the `Role` enum field. | Prisma Client throws a `TypeError` for invalid Enum constraint. | Threw Prisma Type Error. | **PASS** |
| **UT-04** | `RescueReport` | Provide a Base64 image payload exceeding 5MB to the `handleImageChange` client function. | Function intercepts payload and fires `alert("File under 5MB required")`. | Alert fired successfully. | **PASS** |

## 6.3. Integration Testing

**Integration Testing** is the phase where individual software modules are logically grouped and tested together to expose faults in the interactions and data transmission between integrated components (e.g., frontend API calls hitting backend databases).

Below are the critical integration test cases executed across the Pet Connect Controller-Service boundary:

| Test ID | Integration Boundary | Test Description | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **IT-01** | UI <-> API <-> Auth | Submit a POST request to `/api/auth/login` with valid seed data credentials. | API responds with `200 OK` and a secure HTTP-only `Set-Cookie` header containing the JWT token. | Received 200 OK with Cookie. | **PASS** |
| **IT-02** | UI <-> API <-> DB | Submit a `AdoptionRequest` POST payload linked to a valid `animalId`. | API parses payload, Prisma successfully `INSERT`s row, DB triggers `updatedAt` stamp. | Database row created accurately. | **PASS** |
| **IT-03** | Middleware <-> API | Send a GET request to `/api/admin/stats` using a JWT Token where `role === 'USER'`. | Next.js Middleware intercepts the routing and aborts with `401 Unauthorized` before DB is queried. | Request aborted, returned 401. | **PASS** |

## 6.4. System Testing

**System Testing** is a high-level, black-box testing phase conducted on the complete, integrated system to evaluate the overall compliance with the specified requirements from an end-user perspective.

Below are four rigorous system test cases executed utilizing manual walk-throughs on the fully compiled Next.js production build (`npm run build && npm start`):

| Test ID | System Scenario | Test Description | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ST-01** | End-to-End Adoption | User creates account -> Browes App -> Clicks "Adopt" -> Submits form -> Admin logs in -> Approves form. | User Dashboard updates to "Approved", Animal status globally changes to "ADOPTED". | System accurately synced all statuses. | **PASS** |
| **ST-02** | Rescue Image Pipeline | User accesses `/report-missing`, uploads a 2MB JPEG, fills context, clicks Submit. | Screen displays success model. Admin dashboard renders the precise uploaded image without corruption. | Image rendered correctly in Dashboard. | **PASS** |
| **ST-03** | Responsive Layout | Emulate mobile device (375x812 viewport) and navigate the main Animal Roster grid. | Tailwind CSS collapses the 4-column grid into a vertically scrolling 1-column stack. UI remains usable. | Grid collapsed perfectly without horizontal overflow. | **PASS** |
| **ST-04** | Medical Record RBAC | Login as Standard User. Attempt to manually construct URL parameter to `/dashboard/patients/[id]`. | System denies page load, forces redirect to `/dashboard` with an "Access Denied" toast message. | Forced redirect succeeded securely. | **PASS** |

## 6.5. Implementation

Implementation marks the final transition from the finalized software product into actual operational use at the animal shelter. 

### Changeover Plan: Parallel Deployment Strategy
Given the sensitivity of active, live animal medical records, Pet Connect utilized a **Parallel Changeover** methodology rather than a direct cut-over.

1.  **Environment Provisioning**: The PostgreSQL database was spun up on Neon, and the production codebase was mapped to Vercel. Continuous Integration was enabled so that `git push main` triggered automated deployments.
2.  **Parallel Operation**: For a scheduled duration of two weeks, shelter administrators ran the legacy paper/spreadsheet system *concurrently* alongside Pet Connect. Staff actively double-logged intakes and adoptions.
3.  **Data Migration**: Historic static records (unavailable pets, past adoptions) were batch imported using the custom `update_donors.js` and bulk-seed SQL scripts over a designated weekend.
4.  **Verification**: After the 14-day parallel run, financial and intake statistics generated by the new Pet Connect Dashboard were cross-referenced against the legacy paper accounting to verify 100% computational parity.
5.  **Final Cut-over**: Once parity was confirmed and staff felt comfortable navigating the "Antigravity" layouts, the legacy paper system was formally decommissioned, and the public URLs were broadcast to the community via social media.
