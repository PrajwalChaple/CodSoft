# 🛒 Trendify — Premium E-Commerce Platform

A modern, full-stack e-commerce web application built with **Next.js 16**, **MongoDB Atlas**, and **Razorpay** payment integration. Trendify delivers a premium shopping experience with a sleek dark-green themed UI, real-time cart management, secure authentication, and a powerful admin dashboard.

> **Live Demo:** [trendify-peach.vercel.app](https://trendify-peach.vercel.app)

---

## ✨ Features

### 🛍️ Customer-Facing
- **Product Catalog** — Browse products with advanced search, category filtering, and sorting (price, rating, newest)
- **Product Detail Pages** — Dynamic pages with image gallery, color variants, size selection, and customer reviews
- **Shopping Cart** — Real-time cart with quantity adjustment, price calculation, and persistent state
- **Wishlist** — Save favorite products with localStorage persistence
- **Secure Checkout** — Streamlined checkout flow with address form and order summary
- **Razorpay Payments** — Integrated payment gateway with order verification
- **User Accounts** — Profile management, order history, and account settings

### 🔐 Authentication
- **Email/Password** — Secure registration and login with bcrypt password hashing
- **Google OAuth** — One-click Google Sign-In via Supabase Auth
- **JWT Sessions** — HTTP-only cookie-based authentication for security
- **Protected Routes** — Server-side route protection for authenticated pages

### 📊 Admin Dashboard
- **Order Management** — View, filter, and update order statuses
- **Sales Analytics** — Revenue stats, order counts, and performance metrics
- **Product Management** — Full CRUD operations for the product catalog
- **Export Data** — Download order reports as Excel spreadsheets (XLSX)

### 🎨 UI/UX
- **Dark Green Theme** — Premium, modern aesthetic with carefully crafted color palette
- **Fully Responsive** — Optimized for desktop, tablet, and mobile devices
- **Toast Notifications** — Real-time feedback for all user actions
- **Smooth Animations** — Micro-interactions and transitions for enhanced experience
- **Mobile Navigation** — Hamburger menu with slide-out overlay

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, CSS Modules |
| **Backend** | Next.js API Routes (RESTful) |
| **Database** | MongoDB Atlas with Mongoose ODM |
| **Authentication** | JWT + bcryptjs, Supabase (Google OAuth) |
| **Payments** | Razorpay Payment Gateway |
| **Icons** | Lucide React |
| **Export** | SheetJS (xlsx) |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
trendify/
├── app/
│   ├── api/
│   │   ├── auth/          # Login, Register, Google OAuth, Profile APIs
│   │   ├── orders/        # Order CRUD, Stats, Excel Export
│   │   ├── payment/       # Razorpay order creation & verification
│   │   ├── products/      # Product CRUD APIs
│   │   └── seed/          # Database seeding endpoint
│   ├── account/           # User account & order history
│   ├── admin/             # Admin dashboard
│   ├── auth/callback/     # OAuth callback handler
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout flow
│   ├── login/             # Login page
│   ├── product/[id]/      # Dynamic product detail pages
│   ├── register/          # Registration page
│   ├── layout.js          # Root layout with providers
│   ├── page.js            # Homepage
│   └── globals.css        # Global styles & design system
├── components/
│   ├── Navbar.js          # Navigation with search & cart
│   ├── Footer.js          # Site footer
│   ├── HeroBanner.js      # Homepage hero section
│   ├── ProductCard.js     # Product card component
│   ├── CategoryCard.js    # Category browsing cards
│   ├── FilterBar.js       # Search, filter & sort controls
│   ├── StarRating.js      # Star rating display
│   ├── ColorSwatches.js   # Color variant selector
│   └── QuantitySelector.js # Quantity input control
├── context/
│   ├── AuthContext.js     # Authentication state management
│   ├── CartContext.js     # Cart state management
│   ├── WishlistContext.js # Wishlist state management
│   └── ToastContext.js    # Toast notification system
├── lib/
│   ├── mongodb.js         # MongoDB connection handler
│   ├── auth.js            # JWT sign/verify utilities
│   └── supabase.js        # Supabase client initialization
├── models/
│   ├── User.js            # User schema (name, email, password, Google ID)
│   ├── Product.js         # Product schema (name, price, images, variants)
│   └── Order.js           # Order schema (items, status, payment details)
├── data/
│   └── products.js        # Static product data & categories
└── public/                # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **MongoDB Atlas** account ([cloud.mongodb.com](https://cloud.mongodb.com))
- **Razorpay** account ([dashboard.razorpay.com](https://dashboard.razorpay.com))
- **Supabase** account for Google OAuth ([supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrajwalChaple/CodSoft.git
   cd CodSoft/trendify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Atlas
   MONGODB_URI=your_mongodb_connection_string

   # JWT Secret
   JWT_SECRET=your_random_secret_key

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Razorpay (Test Mode)
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Supabase (Google Auth)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Seed the database** (optional)

   Visit `/api/seed` to populate the database with sample products.

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new user account |
| `POST` | `/api/auth/login` | Login with email/password |
| `POST` | `/api/auth/logout` | Clear auth session |
| `GET` | `/api/auth/me` | Get current user info |
| `PUT` | `/api/auth/profile` | Update user profile |
| `POST` | `/api/auth/google` | Google OAuth handler |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Get product details |
| `POST` | `/api/products` | Create product (admin) |
| `PUT` | `/api/products/:id` | Update product (admin) |
| `DELETE` | `/api/products/:id` | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Get user/all orders |
| `POST` | `/api/orders` | Create new order |
| `GET` | `/api/orders/stats` | Order analytics (admin) |
| `GET` | `/api/orders/export` | Export orders as XLSX |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/payment/create-order` | Create Razorpay order |
| `POST` | `/api/payment/verify` | Verify payment signature |

---

## 🌐 Deployment

This project is deployed on **Vercel**:

1. Push code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Set the **Root Directory** to `trendify`
4. Add all environment variables in Vercel → Settings → Environment Variables
5. Deploy!

---

## 📸 Screenshots

### Homepage
The homepage features a hero banner, trending products, category navigation, hot deals, new arrivals, and best sellers sections.

### Product Detail
Each product has a dedicated page with image gallery, color/size selection, reviews, and related products.

### Admin Dashboard
Full-featured admin panel with order management, sales analytics, and data export capabilities.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Prajwal Chaple**
- GitHub: [@PrajwalChaple](https://github.com/PrajwalChaple)

---

<p align="center">
  Built with ❤️ using Next.js and MongoDB
</p>
