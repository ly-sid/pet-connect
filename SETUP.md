# Getting Started with Pet-Connect

Follow these steps to get your new persistent backend up and running!

## Prerequisites
1. **Docker Desktop**: Make sure Docker is installed and **running** on your machine. [Download here](https://www.docker.com/products/docker-desktop/).

## Setup Instructions

### 1. Start the Database
Open your terminal in the project root and run:
```bash
docker-compose up -d
```
> This starts a PostgreSQL database in the background.

### 2. Initialize the Database Schema
Sync your Prisma models with the physical database:
```bash
npx prisma migrate dev --name init
```
> This creates the tables (Users, Animals, etc.) in your PostgreSQL instance.

### 3. Start the Development Server
```bash
npm run dev
```
> Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using the App
1. **Register**: Go to `/register` and create an account. You can choose a role like **ADMIN** or **VET** to see different dashboard features.
2. **Intake**: Go to the Dashboard -> Register New Intake to add a real animal to the database.
3. **Persist**: Refresh the page or restart your browser—all your data will still be there!

---
> [!TIP]
> If you ever want to see the database directly, run `npx prisma studio`. It opens a web UI to view and edit your data.
