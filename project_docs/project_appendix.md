# 9. Appendix

This section contains supplementary material relevant to the technical realization of the Pet Connect platform, including architectural scaffolding code, critical module implementations, and placeholders for visual interface documentation.

## 9.1. Appendix A: Core Database Schema (`prisma/schema.prisma`)
The following schema defines the strict relational mapping utilized by the PostgreSQL data layer to enforce constraints across User Roles, Adoption Requests, and Clinical Medical Records.

```prisma
// Excerpt from prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  VET
  USER
  RESCUE
}

model User {
  id               String            @id @default(uuid())
  email            String            @unique
  password         String
  role             Role              @default(USER)
  adoptionRequests AdoptionRequest[]
}

model Animal {
  id               String            @id @default(uuid())
  name             String
  species          String
  status           String            @default("AVAILABLE")
  medicalRecords   MedicalRecord[]
}

model MedicalRecord {
  id               String   @id @default(uuid())
  animalId         String
  diagnosis        String   @db.Text
  date             DateTime @default(now())
  animal           Animal   @relation(fields: [animalId], references: [id])
}
```

## 9.2. Appendix B: Core Controller Logic (`src/app/api/auth/login/route.ts`)
Sample implementation of the serverless Next.js API route handling JWT authentication, bcrypt validation, and secure HTTP-Only cookie distribution.

```typescript
// Excerpt from login route handler
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        const token = await new SignJWT({ id: user.id, role: user.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET));

        const response = NextResponse.json({ success: true });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400 
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'System boundary error' }, { status: 500 });
    }
}
```

## 9.3. Appendix C: Sample Input Screens
*Instructions for final document compilation: Insert high-resolution screenshots of the primary data entry Graphical User Interfaces here.*

1.  **Figure C.1**: The Public "Report Missing Pet" intake form, demonstrating the localized client-side file picker constraint layout.
2.  **Figure C.2**: The Administrator "New Pet Intake" form, demonstrating the restricted dropdown validations and structured data entry fields for adding a new animal to the shelter catalog.

## 9.4. Appendix D: Sample Output Screens
*Instructions for final document compilation: Insert high-resolution screenshots of the primary operational views and data readouts here.*

1.  **Figure D.1**: The public-facing "Adoptable Animal" Grid rendering (`src/app/animals/page.tsx`), demonstrating the "Antigravity" glassmorphic UI aesthetic.
2.  **Figure D.2**: The protected Admin Dashboard data grid visualizing the computed `Pending Adoption` requests queue.
