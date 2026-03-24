# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Adding a Backend (MERN Stack)

This repository currently holds the frontend of an e-commerce application built with React, Vite, and shadcn/ui. To make it a full **MERN** stack application, a Node/Express backend has been scaffolded under `backend/`.

### Quick start for the backend

1. Open a terminal and switch to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Copy and edit configuration:
   ```sh
   cp .env.example .env
   # then open .env and set MONGO_URI, JWT_SECRET, and PORT
   ```
4. Run the server in development mode (requires nodemon):
   ```sh
   npm run dev
   ```
   or for production:
   ```sh
   npm start
   ```

   ⚠️ If you modify any Mongoose schemas (e.g. add or remove fields like the new `wishlist` property on users), you should restart the server and, if necessary, clear or migrate existing documents so the new fields are initialized.

### Available API endpoints

- **Auth**
  - `POST /api/auth/register` — create new user
  - `POST /api/auth/login` — returns JWT token
- **Products**
  - `GET /api/products` — list all products
  - `GET /api/products/find/:id` — get a single product

- **Users**
  - `POST /api/auth/register` — create new account
  - `POST /api/auth/login` — authenticate and receive token
  - `GET /api/users/:id` — fetch profile (requires token)
  - `PUT /api/users/:id` — update profile (requires token)
  - `GET /api/users/:id/wishlist` — get wishlist (requires token)
  - `PUT /api/users/:id/wishlist` — replace wishlist array (requires token)

- **Orders**
  - `POST /api/orders` — place new order (requires token)
  - `GET /api/orders/find/:userId` — get orders for a user (requires token)
  - `GET /api/orders` — list all orders (admin)
  - *(admin only)* `POST`, `PUT /:id`, `DELETE /:id` for product management
- **Cart**
  - `POST /api/cart` — create or replace cart for user
  - `PUT /api/cart/:userId`, `GET /api/cart/find/:userId`, `DELETE /api/cart/:userId`
- **Orders**
  - `POST /api/orders` — place an order
  - `GET /api/orders/find/:userId` — orders for a user
  - *(admin)* `GET /api/orders`, `PUT /:id`, `DELETE /:id`

Routes are protected with JWT middleware; include `Authorization: Bearer <token>` for authenticated requests.

### Frontend configuration

Set `VITE_API_URL` in a root `.env` file (e.g. `VITE_API_URL=http://localhost:5000/api`). Use the helper functions in `src/lib/api.ts` or your own fetch calls to communicate with the backend.

### Further customization

The `backend/` folder contains models, controllers, and routes. Feel free to expand them with more fields or new resources (users, categories, reviews, etc.) to fit your requirements.

---

Happy coding! 🎯
