<p align="center">
  <a href="https://github.com/marcelodosreis/sassy"><img src="https://raw.githubusercontent.com/marcelodosreis/sassy/refs/heads/main/public/logo.ico" alt="Logo" height=170></a>
</p>
<h1 align="center">Sassy</h1>

<p align="center">
<img src="https://img.shields.io/github/stars/marcelodosreis/sassy" alt="stars">
<a><img src="https://img.shields.io/static/v1?label=speed&message=fast&color=success" /></a>
</p>

Welcome to **Sassy**, a powerful template generator designed to accelerate the development of Micro-SaaS applications. Built with **Next.js 15**, **TypeScript**, **TailwindCSS**, **Supabase**, and **Stripe**, Sassy provides a robust foundation for building subscription-based services with integrated authentication, subscription management, and payment processing.

| **Feature**                             | **Status** |
|-----------------------------------------|------------|
| OAuth Authentication (Google, FB, Twitter) | ✅         |
| Subscription & Billing (Stripe)         | ✅         |
| Free Trial Periods (Stripe)             | ✅         |
| Billing Portal (Stripe)                 | ✅         |
| Webhooks for Stripe Events              | ✅         |
| Subscriptions & Payments API Routes     | ✅         |
| User Authentication (Supabase)          | ✅         |
| E-Mail (Mailgun) + Custom Notification  | ✅         |
| Personalized Dashboard                  | ✅         |
| Responsive Design + Landing Page        | ✅         |
| Logs & Monitoring (Datadog)             | ✅         |

You can learn more about the other features by visiting the following documentation page: [Sassy Documentation](https://github.com/marcelodosreis/sassy/blob/develop/docs).

We are constantly improving Sassy with new features to make it even more powerful. You can find the current roadmap and planned features on our [Feature Roadmap](https://github.com/marcelodosreis/sassy/blob/develop/docs/feature-roadmap.md)


## Architecture and Structure

Sassy's architecture is designed to streamline the rapid development of Micro-SaaS applications by providing essential features like user authentication, subscription management, and seamless payment processing. The project structure is clean and organized to help developers get started quickly while maintaining flexibility and scalability.

### Project Structure:

```bash
src/
├── app/                # Main logic and core functionality of the application
├── components/         # Reusable UI components
├── constants/           # Global constants and configurations
├── contexts/            # React contexts for global state management
├── hooks/               # Custom React hooks
├── libs/                # Third-party libraries and utilities
├── pages/               # Next.js pages corresponding to routes
│   └── api/             # API routes for backend functionality
├── services/            # External API integrations and services
├── styles/              # TailwindCSS configuration and custom styles
├── utils/               # Utility functions and helpers
└── middleware.ts        # Middleware for request processing
```

### Integration with Supabase and Stripe:

- **Supabase** is used for user authentication and real-time database management. The `subscriptions` table is created to store subscription-related data for each user.
- **Stripe** is integrated to handle payment processing and subscription plan management.

### SQL Script for Creating the `subscriptions` Table in Supabase:

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    plan TEXT CHECK (plan IN ('free', 'starter', 'creator', 'pro')) NOT NULL DEFAULT 'free',
    status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing')) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

> **Note:** Since subscription data is sensitive, ensure that **Row Level Security (RLS)** is disabled for the `subscriptions` table.

### Environment Configuration:

The environment variables are configured to integrate Sassy with Supabase and Stripe. Make sure to update the values accordingly.

```env
NEXT_PUBLIC_PROJECT_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_DATADOG_APPLICATION_ID=
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=

SUPABASE_SECRET_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

DATADOG_SECRET_KEY=

MAILGUN_SECRET_KEY=
MAILGUN_SECRET_DOMAIN=
```

> **Note:** Replace the above values with your own Supabase and Stripe keys.

## Key Features

- **Authentication with Supabase:** Utilize Supabase for user authentication, providing a secure and scalable login system.
- **Subscription Management with Stripe:** Easily manage different subscription plans, handle payments, and track user subscriptions with Stripe integration.
- **Responsive Design with TailwindCSS:** The application uses TailwindCSS for styling, ensuring a modern and responsive design out of the box.
- **Built-in API Routes:** Ready-to-use API routes for managing subscriptions, payments, and user data.
- **OAuth Support:** The app supports OAuth login via **Google**, **Facebook**, and **Twitter**, providing users with a seamless authentication experience.

---

## Webhook Listener for Stripe

To handle incoming webhooks from Stripe (such as subscription updates, payment failures, etc.), Sassy includes a script for listening to Stripe webhooks:

```bash
pnpm stripe:listen
```

This script connects your local environment to Stripe and listens for events like **invoice.payment_succeeded**, **invoice.payment_failed**, and more. It will automatically trigger the corresponding handler in your application to process the events.

> **Note:** When using this in your development environment, make sure you have the Stripe secret key and webhook secret configured in your `.env.local` file.

---

## OAuth Authentication

Sassy comes with built-in OAuth authentication support for popular platforms such as **Google**, **Facebook**, and **Twitter**. The authentication flow is fully integrated with Supabase, ensuring a secure and seamless experience for users.

### Dependencies:
- OAuth SDKs for Google, Facebook, and Twitter to provide login functionality.

With **OAuth**, users can authenticate with their preferred social media accounts, reducing friction in the signup/login process. OAuth tokens are securely managed by Supabase, and user data is synchronized across both Supabase and your application.

> **Note:** The OAuth login functionality is already set up and fully supported out of the box. If you're using different authentication providers, you can easily extend this functionality by following the Supabase OAuth documentation.

---

## Setup Instructions

### 1. Install Dependencies

Ensure that you have **pnpm** installed. If not, install it globally:

```bash
npm install -g pnpm
```

Then, install the project dependencies:

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory of the project and add the necessary environment variables (as provided in the **Environment Configuration** section).

### 3. Run the Development Server

Once the environment is set up, start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### 4. Database Configuration

To set up your Supabase project, run the provided SQL script to create the `subscriptions` table in your Supabase database.

### 5. Stripe Integration

Make sure your Stripe API keys are correctly set up. You can test the payment processing using Stripe’s test keys in a sandbox environment.

---

## Development vs Production Environments

For **development** and **production**, Sassy uses separate Supabase projects to ensure a clean and isolated environment. This allows you to safely test changes in the development environment without affecting live data in production.

> **Note:** Ensure that you configure your `.env.local` with the correct Supabase project URL and keys for each environment.

---

## Conclusion

Sassy provides a solid foundation for developing subscription-based Micro-SaaS applications. By leveraging the power of **Next.js**, **Supabase**, **Stripe**, **OAuth**, and **TailwindCSS**, you can rapidly build and deploy secure and scalable applications. Whether you're just starting a new SaaS product or iterating on an existing idea, Sassy makes it easy to focus on what matters most: delivering value to your users.

---

For more information on integrating **Stripe**, **Supabase**, and **OAuth**, refer to the official documentation:

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OAuth Integration Guide](https://supabase.com/docs/guides/auth/auth-helpers/oauth)
- [Sassy Integration with Datadog](https://github.com/marcelodosreis/sassy/blob/main/docs/datadog.md)
