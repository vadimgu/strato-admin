# Introduction & Project Setup

In this chapter, we will set up our development environment and bootstrap the "StratoShop" admin dashboard. By the end of this section, you will have a running React application connected to a mock e-commerce backend.

## Architecture Overview

Strato Admin is built on a "Power of Two" philosophy:

1.  **Core Logic:** Handles data fetching, state management, routing, authentication, and internationalization. It's the "brain" of your application, ensuring your UI stays in sync with your data.
2.  **Cloudscape (UI Layer):** Provides the professional, accessible, and high-performance design system (developed by AWS). It's the "body" of your application.

Strato Admin bridges these two, allowing you to build feature-rich dashboards with Cloudscape's enterprise-grade components using a high-productivity, declarative API.

## Installation

The fastest way to start is using our project generator, which scaffolds a complete Strato Admin project with Vite, TypeScript, and a basic layout already configured.

### 1. Create a new project

Open your terminal and run:

```bash title="Terminal"
npm create strato-admin@latest stratoshop-admin
cd stratoshop-admin
npm install
```

During the setup, you can choose the **Basic** template.

### 2. Alternative: Manual Installation

If you prefer to add Strato Admin to an existing Vite project:

```bash title="Terminal"
# Create a standard Vite project if you don't have one
# npm create vite@latest stratoshop-admin -- --template react-ts

# Install the core library
npm install @strato-admin/admin
```

> **Note:** Strato Admin works best with React 18 or 19. Cloudscape design system components and styles are automatically included as dependencies.

## The Data Provider

Strato Admin communicates with your API through a **Data Provider**. It acts as an adapter between the framework and your backend's specific dialect (REST, GraphQL, etc.).

For this tutorial, we will use a pre-built mock data provider that generates a complete e-commerce dataset in-memory.

Install the mock data package:

```bash title="Terminal"
npm install @strato-admin/faker-ecommerce
```

## The `<Admin>` Component

The `<Admin>` component is the root of your Strato application. It initializes the data provider and sets up the routing and layout.

Replace the contents of `src/App.tsx` with the following:

```tsx title="src/App.tsx" {6-8} showLineNumbers
import "@cloudscape-design/global-styles/index.css";
import { Admin } from "@strato-admin/admin";
import { dataProvider } from "@strato-admin/faker-ecommerce";

const App = () => (
  <Admin dataProvider={dataProvider}>
    {/* Resources will go here */}
  </Admin>
);

export default App;
```

### What's happening here?

- **Global Styles:** We import Cloudscape's global styles to ensure consistent typography and spacing.
- **`dataProvider`:** We pass the mock e-commerce provider.
- **Empty Shell:** Currently, the app will show a loading state or an empty layout because we haven't defined any resources yet.

Run your application to verify everything is working:

```bash title="Terminal"
npm run dev
```

You should see a clean, professional-looking dashboard shell. In the next chapter, we'll populate it with our first resource: **Products**.
