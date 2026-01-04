# 🌊 Starkon - Next.js Boilerplate & Template Generator

[![npm](https://img.shields.io/npm/v/starkon)](https://www.npmjs.com/package/starkon)
[![downloads](https://img.shields.io/npm/dm/starkon)](https://www.npmjs.com/package/starkon)
[![license](https://img.shields.io/github/license/zzafergok/starkon)](https://github.com/zzafergok/starkon/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

> 🚀 **Create production-ready Next.js applications in seconds, not hours**

**The most comprehensive Next.js 16 starter template with authentication, internationalization, corporate features, and an interactive CLI that lets you choose the perfect template.**

### ✨ Interactive Template Selection

```bash
npx starkon my-app
```

Choose from 3 optimized templates with arrow keys, or use 3 additional specialized templates via `--template` flag:

- 🏗️ **Next.js Boilerplate** - Full-stack with auth & i18n
- 🎯 **Landing Page** - Marketing-optimized single page
- 🏢 **Corporate** - Business website with CMS
- 📊 **Dashboard** - Admin panel optimized (manual: `--template dashboard`)
- ⚡ **Basic** - Essential setup (manual: `--template basic`)
- 🎯 **Minimal** - Bare-bones (manual: `--template minimal`)

## ⚡ Quick Start

### 🎯 Interactive CLI Menu

Simply run the command and choose your template:

```bash
npx starkon my-app
```

You'll see an interactive menu with 3 main options:

- **❯ Next.js Boilerplate** - Full-featured with auth & i18n
- **Landing Page Template** - Single-page marketing site
- **Corporate Template** - Business website with CMS

Use **↑↓ arrow keys** to navigate and **Enter** to select.

### 🚀 Complete Setup

```bash
npx starkon my-awesome-app
# ↓ Interactive menu appears
# ↓ Select template with arrow keys
# ↓ Press Enter to confirm
cd my-awesome-app
npm install
npm run dev
```

Your Next.js app will be running at `http://localhost:3000` 🎉

### 🏃‍♂️ Skip Interactive Menu

You can also specify template directly:

```bash
npx starkon my-app --template corporate  # Business website
npx starkon my-app --template landing    # Marketing page
npx starkon my-app --template standard   # Full-stack app
```

## 🎯 Template Library

Choose the perfect starting point for your specific use case:

### 🏢 **Corporate Template** ⭐

Complete business website with content management system.

```bash
npx starkon company-website --template corporate
```

**Perfect for:**

- Corporate websites
- Agency portfolios
- Business landing pages
- Service companies

**Includes:**

- 📄 **Pages:** Home, About, Services, Blog, Gallery, Contact
- 🧩 **Components:** ServiceCard, TeamMember, BlogCard, GalleryItem
- 📝 **Content System:** Built-in content management with TypeScript interfaces
- 🎨 **Professional Design:** Clean, modern business aesthetic
- 📱 **Responsive:** Mobile-optimized layouts

**Excludes:** Authentication system, i18n complexity for cleaner corporate focus

### 🎯 **Landing Template** ⭐ _Popular_

Single-page marketing websites optimized for conversions.

```bash
npx starkon product-launch --template landing
```

**Perfect for:**

- Product launches
- SaaS marketing sites
- Portfolio websites
- Event pages

**Includes:**

- 🎨 **Sections:** Hero, Features, Testimonials, CTA, Contact
- ⚡ **Animations:** Smooth scroll-triggered animations with Framer Motion
- 📝 **Forms:** Contact forms with validation
- 🎯 **CTA Optimized:** Conversion-focused design patterns

**Excludes:** Authentication, i18n, dashboard components for faster loading

### 🏗️ **Next.js Boilerplate** (Full-Featured)

Complete full-stack setup with all enterprise features.

```bash
npx starkon enterprise-app --template standard
```

**Perfect for:**

- SaaS applications
- Admin dashboards
- Enterprise tools
- Multi-user platforms

**Includes:**

- 🔐 **Authentication:** JWT-based auth with session management
- 🌍 **i18n:** English/Turkish with easy language addition
- 📊 **Dashboard:** Admin panels and user management
- 🛡️ **Security:** Protected routes, XSS protection
- 🎨 **Complete UI Kit:** 46 production-ready components

### ⚡ **Basic Template**

Essential Next.js setup without complexity.

```bash
npx starkon simple-app --template basic
```

**Perfect for:**

- Small projects
- Prototypes
- Learning Next.js
- Quick experiments

**Includes:** Next.js 16, TypeScript, Tailwind CSS, ESLint
**Excludes:** Authentication, i18n, complex UI components

### 📊 **Dashboard Template**

Admin dashboard optimized for data-heavy applications.

```bash
npx starkon admin-panel --template dashboard
```

**Perfect for:**

- Admin dashboards
- Analytics tools
- Data management
- Internal tools

**Includes:** Dashboard layout, data tables, charts integration, auth system
**Excludes:** Public marketing pages

### 🎯 **Minimal Template**

Bare-bones Next.js setup for maximum control.

```bash
npx starkon minimal-app --template minimal
```

**Perfect for:**

- Custom implementations
- Learning projects
- Starting from scratch

**Includes:** Next.js 16, TypeScript only
**Excludes:** Everything else - build your own way

## 🏗️ Architecture Overview

### Project Structure

```
starkon-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 🔐 Protected route group
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   ├── settings/      # User settings
│   │   │   ├── profile/       # User profile management
│   │   │   ├── components/    # Component showcase/demo
│   │   │   └── layout.tsx     # Auth layout wrapper
│   │   ├── (corporate)/       # 🏢 Corporate route group
│   │   │   ├── about/         # Company info
│   │   │   ├── services/      # Services catalog
│   │   │   ├── blog/          # Blog system
│   │   │   ├── gallery/       # Project gallery
│   │   │   ├── contact/       # Contact page
│   │   │   └── layout.tsx     # Corporate layout
│   │   ├── (authentication)/  # 🔑 Auth flows
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Registration
│   │   │   ├── forgot-password/  # Password recovery
│   │   │   ├── reset-password/   # Password reset
│   │   │   ├── verify-email/  # Email verification
│   │   │   └── layout.tsx     # Auth flow layout
│   │   ├── page.tsx           # Home page
│   │   ├── not-found.tsx      # 404 handler
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── core/              # 🧩 46 base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── command-menu.tsx
│   │   │   ├── rich-text-editor.tsx
│   │   │   └── ... (40+ more)
│   │   ├── corporate/         # 🏢 Business components
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── TeamMember.tsx
│   │   │   ├── BlogCard.tsx
│   │   │   └── GalleryItem.tsx
│   │   ├── sections/          # 🎯 Landing page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   └── Testimonials.tsx
│   │   ├── ui/                # Complex components
│   │   │   ├── FileUpload/    # File upload with dropzone
│   │   │   ├── brand/         # Brand components
│   │   │   └── dashboard/     # Dashboard components
│   │   ├── layout/            # Layout components
│   │   └── forms/             # Form components
│   ├── lib/                   # Core utilities
│   │   ├── api/
│   │   │   └── axios.ts       # HTTP client with interceptors
│   │   ├── services/          # API services & auth
│   │   │   ├── authApiService.ts
│   │   │   ├── mockAuthService.ts
│   │   │   └── sessionTokenManager.ts
│   │   ├── validations/       # Zod schemas
│   │   │   └── auth.ts        # Auth validation schemas
│   │   ├── types/             # TypeScript definitions
│   │   ├── content.ts         # 📄 Content management system
│   │   ├── i18n.ts            # Internationalization
│   │   └── utils.ts           # Helper utilities
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── useTheme.ts        # Theme management
│   │   ├── useToast.ts        # Toast notifications
│   │   ├── useLocale.ts       # Locale management
│   │   ├── useClipboard.ts    # Clipboard utilities
│   │   ├── usePasswordStrength.ts  # Password validation
│   │   └── useForm.ts         # Form utilities
│   ├── providers/             # Context providers
│   │   ├── AuthProvider.tsx   # Auth state management
│   │   ├── I18nProvider.tsx   # i18n integration
│   │   ├── ReactQueryProvider.tsx  # Data fetching
│   │   ├── theme-provider.tsx # Dark/light theme
│   │   └── toast-provider.tsx # Toast system
│   ├── store/                 # Zustand stores
│   │   ├── toastStore.ts      # Toast notifications
│   │   └── pomodoro-store.ts  # Pomodoro timer state
│   └── locales/               # 🌍 i18n translations
│       ├── en/                # English
│       └── tr/                # Turkish
├── public/                    # Static assets
├── tailwind.config.mjs        # Tailwind configuration
└── next.config.mjs            # Next.js configuration
```

### Technology Stack

**Core Framework:**

- **Next.js 16** - App Router, Server Components, optimized performance
- **React 19** - Latest React features and improvements
- **TypeScript 5.7** - Full type safety and developer experience

**UI & Design:**

- **Radix UI** - Accessible, unstyled component primitives
- **Tailwind CSS 3.4** - Utility-first styling with custom design system
- **class-variance-authority** - Type-safe component variants
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icon library
- **CSS Variables** - Dynamic theming support

**State & Data:**

- **React Query (@tanstack/react-query)** - Server state management and caching
- **Zustand 5.0** - Lightweight client state management
- **Redux + Redux Persist** - Optional complex state with persistence
- **React Hook Form** - Performant forms with validation

**API & HTTP:**

- **Axios** - HTTP client with custom interceptors
- **Request/response queuing** - Token refresh handling
- **FormData support** - File upload integration
- **Environment-based switching** - Mock/real API toggle

**Forms & Validation:**

- **React Hook Form** - Form state management
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Form validation integration

**Internationalization:**

- **i18next** - Complete i18n solution
- **react-i18next** - React integration
- **Browser language detection** - Automatic locale detection
- **localStorage + cookie persistence** - Language preference storage

**Advanced Features:**

- **cmdk** - Command menu (Cmd+K)
- **react-dropzone** - File upload interface
- **@tanstack/react-table** - Headless table library
- **date-fns** - Date manipulation utilities
- **crypto-js** - Encryption utilities
- **react-error-boundary** - Error handling

**Development:**

- **ESLint** - Code linting with Next.js rules
- **Prettier** - Code formatting with Tailwind plugin
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **Husky** - Git hooks
- **Commitizen** - Conventional commits

## 🔐 Authentication System

### Features

- **JWT Tokens** - Secure access and refresh token system
- **Auto-refresh** - Automatic token renewal with 5-minute buffer
- **Session Management** - Persistent login with "Remember Me"
- **Protected Routes** - Middleware-based route protection
- **Mock Development** - Built-in test users for development
- **4 Auth Flows** - Login, Register, Forgot Password, Reset Password, Verify Email

### Development Users

```typescript
// Available test accounts
admin@example.com    / admin123     // Full admin access
user@example.com     / user123      // Standard user
demo@example.com     / demo123      // Demo account
```

### Usage

```tsx
import { useAuth } from '@/hooks/useAuth'

function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <LoginForm />

  return <h1>Welcome {user.name}!</h1>
}
```

### Authentication Architecture

**5-Layer System:**

1. **Token Management** (`sessionTokenManager.ts`) - sessionStorage with 5-minute refresh buffer
2. **API Service** (`authApiService.ts`) - Environment-based mock/real API switching
3. **Auth Provider** (`AuthProvider.tsx`) - React Context with periodic validation
4. **Middleware** (`middleware.ts`) - Server-side language and route handling
5. **Axios Interceptors** (`axios.ts`) - Auto token attachment and 401 retry queue

## 🌍 Internationalization

### Built-in Language Support

- **English (en)** - Complete translations
- **Turkish (tr)** - Native language support
- **Browser Detection** - Automatic language detection
- **URL Persistence** - Language state in URL parameters (`?lang=en`)
- **localStorage & Cookie** - Persistent language preference

### Detection Priority

1. **localStorage** - Key: `language` (permanent)
2. **Cookie** - Key: `language` (365-day expiry)
3. **URL Parameter** - `?lang=tr`
4. **Browser Navigator** - `navigator.language`
5. **Default** - Turkish (`tr`)

### Adding New Languages

```bash
# 1. Create translation file
src/locales/es/translation.json

# 2. Add to supported locales
src/lib/i18n.ts
```

### Usage

```tsx
import { useTranslation } from 'react-i18next'

function Component() {
  const { t, i18n } = useTranslation()

  // Change language
  i18n.changeLanguage('en')

  return <h1>{t('welcome.title')}</h1>
}
```

## 🎨 UI Component System

### Core Components (46)

**Basic Components:**

```tsx
// Form Components
<Button variant="default | outline | ghost | destructive | link" size="sm | md | lg | icon" />
<Input type="text | email | password" />
<PasswordInput showStrength={true} />
<NumberInput min={0} max={100} />
<Textarea placeholder="Enter text..." />
<Checkbox checked={true} />
<Switch enabled={true} />
<Select options={options} />
```

**Layout Components:**

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
<Separator orientation="horizontal | vertical" />
<Accordion type="single | multiple" />
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
</Tabs>
<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Hidden content</CollapsibleContent>
</Collapsible>
```

**Data Display:**

```tsx
// Tables with @tanstack/react-table
<DataTable data={data} columns={columns} />
<EnhancedDataTable data={data} columns={columns} searchable sortable />
<DataGrid data={data} />
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
</Table>
<Badge variant="default | secondary | outline | destructive" />
<Avatar src="/avatar.jpg" fallback="JD" />
```

**Date & Time:**

```tsx
<Calendar selected={date} onSelect={setDate} />
<DatePicker value={date} onChange={setDate} />
<MonthYearPicker value={date} onChange={setDate} />
<ModernDatePicker value={date} onChange={setDate} />
```

**Navigation:**

```tsx
<CommandMenu>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandMenu>
<DynamicBreadcrumb items={items} />
<EnhancedPaginationControls page={1} totalPages={10} />
<Stepper steps={steps} currentStep={0} />
<ModernDrawer open={isOpen} onClose={close}>
  <DrawerContent>Content</DrawerContent>
</ModernDrawer>
```

**Feedback:**

```tsx
<Alert variant="default | destructive | warning | info">
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
</Alert>
<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
  </AlertDialogContent>
</AlertDialog>
<Skeleton className="w-full h-20" />
<LoadingSpinner size="sm | md | lg" />
<Progress value={50} />
<Toast title="Success" description="Action completed" />
```

**Advanced Components:**

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
<Dropdown>
  <DropdownTrigger>Menu</DropdownTrigger>
  <DropdownContent>
    <DropdownItem>Item 1</DropdownItem>
  </DropdownContent>
</Dropdown>
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Content</PopoverContent>
</Popover>
<Tooltip content="Tooltip text">
  <button>Hover me</button>
</Tooltip>
<ScrollArea className="h-96">
  <div>Scrollable content</div>
</ScrollArea>
<Slider value={[50]} onValueChange={setValue} />
```

**Enterprise Components:**

```tsx
// File Upload with react-dropzone
<FileUpload
  accept={{ 'image/*': ['.png', '.jpg'] }}
  maxSize={5242880}
  onDrop={handleDrop}
/>

// Rich Text Editor
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Start typing..."
/>

// Advanced Search with Filters
<EnhancedSearchFilters
  filters={filters}
  onFilterChange={handleFilterChange}
/>

// Accessibility Enhancer
<AccessibilityEnhancer skipToContentId="main">
  <YourContent />
</AccessibilityEnhancer>

// Enterprise Error Boundary
<EnterpriseErrorBoundary
  fallback={<ErrorFallback />}
  onError={logError}
>
  <YourApp />
</EnterpriseErrorBoundary>
```

### Corporate Components

```tsx
// Service showcase
<ServiceCard
  title="Web Development"
  description="Custom web solutions"
  features={["React", "Next.js", "TypeScript"]}
  icon={Code}
  href="/services/web"
/>

// Team member display
<TeamMember
  name="John Doe"
  role="Lead Developer"
  bio="10+ years experience"
  image="/team/john.jpg"
  social={{ linkedin: "...", github: "..." }}
  skills={["React", "Node.js", "AWS"]}
/>

// Blog post cards
<BlogCard
  title="Getting Started with Next.js"
  excerpt="Learn the fundamentals..."
  author={{ name: "Jane Smith", avatar: "/authors/jane.jpg" }}
  category="Tutorial"
  readingTime="5 min read"
  publishedAt="2024-01-15"
/>

// Gallery items
<GalleryItem
  image="/projects/project1.jpg"
  title="Project Name"
  category="Web Design"
  description="Project description"
/>
```

### Landing Page Sections

```tsx
// Hero section with CTA
<Hero
  title="Build Amazing Apps"
  subtitle="Next.js boilerplate for rapid development"
  primaryAction="Get Started"
  secondaryAction="View Demo"
/>

// Feature showcase
<Features
  title="Everything You Need"
  features={[
    { title: "Fast Setup", icon: Zap, description: "..." },
    { title: "TypeScript", icon: Shield, description: "..." }
  ]}
/>

// Social proof
<Testimonials
  title="What Developers Say"
  testimonials={[
    { name: "Developer", role: "CTO", content: "Amazing tool!" }
  ]}
/>

// Call to action
<CTA
  title="Ready to Build?"
  description="Start your next project today"
  primaryAction="Get Started"
  secondaryAction="View Pricing"
/>
```

## 🪝 Custom Hooks

### Authentication

```tsx
import { useAuth } from '@/hooks/useAuth'

const { user, login, logout, isAuthenticated, loading } = useAuth()
```

### Theme Management

```tsx
import { useTheme } from '@/hooks/useTheme'

const { theme, setTheme, systemTheme } = useTheme()
setTheme('dark' | 'light' | 'system')
```

### Toast Notifications

```tsx
import { useToast } from '@/hooks/useToast'

const { toast } = useToast()
toast.success('Success message')
toast.error('Error message')
toast.warning('Warning message')
toast.info('Info message')
toast.promise(asyncFn, {
  loading: 'Loading...',
  success: 'Done!',
  error: 'Failed',
})
```

### Locale Management

```tsx
import { useLocale } from '@/hooks/useLocale'

const { locale, setLocale, availableLocales } = useLocale()
setLocale('en' | 'tr')
```

### Clipboard Utilities

```tsx
import { useClipboard } from '@/hooks/useClipboard'

const { copy, copied, error } = useClipboard()
copy('Text to copy')
```

### Password Strength

```tsx
import { usePasswordStrength } from '@/hooks/usePasswordStrength'

const { strength, score, feedback } = usePasswordStrength(password)
// Returns: weak | fair | good | strong
```

### Form Utilities

```tsx
import { useForm } from '@/hooks/useForm'

const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => {
    /* ... */
  },
})
```

## 🔌 Providers

### Auth Provider

Manages authentication state across the application.

```tsx
// Wrap your app
import { AuthProvider } from '@/providers/AuthProvider'
;<AuthProvider>
  <YourApp />
</AuthProvider>

// Access auth state
const { user, isAuthenticated, login, logout } = useAuth()
```

### i18n Provider

Provides internationalization support.

```tsx
import { I18nProvider } from '@/providers/I18nProvider'
;<I18nProvider>
  <YourApp />
</I18nProvider>
```

### React Query Provider

Configures React Query for data fetching and caching.

```tsx
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'
;<ReactQueryProvider>
  <YourApp />
</ReactQueryProvider>
```

### Theme Provider

Manages dark/light theme with system preference detection.

```tsx
import { ThemeProvider } from '@/providers/theme-provider'
;<ThemeProvider defaultTheme='system' storageKey='theme'>
  <YourApp />
</ThemeProvider>
```

### Toast Provider

Displays toast notifications throughout the app.

```tsx
import { ToastProvider } from '@/providers/toast-provider'
;<ToastProvider>
  <YourApp />
</ToastProvider>
```

## 🛠️ Development Workflow

### Getting Started

```bash
# 1. Create project with interactive menu
npx starkon my-project
# ↓ Choose template from menu

# 2. Setup development
cd my-project
npm install

# 3. Start development server
npm run dev

# 4. Open browser
open http://localhost:3000
```

### Code Quality

```bash
# Linting and formatting
npm run lint              # ESLint check
npm run lint:fix          # Auto-fix ESLint errors
npm run prettier          # Format code
npm run prettier:check    # Check formatting

# Type checking
npm run type-check        # TypeScript validation

# Testing
npm test                  # Run test suite
npm run test:watch        # Watch mode testing
npm run test:coverage     # Coverage report
```

### Build and Deploy

```bash
# Production build
npm run build

# Analyze bundle size
npm run analyze           # Opens webpack-bundle-analyzer

# Start production server
npm run start
```

## 🌟 CLI Reference

### Basic Usage

```bash
# Interactive template selection (3 main templates)
npx starkon <project-name>

# Or specify any of 6 templates directly
npx starkon <project-name> --template <template-type>
```

### Options

| Option                     | Description                        | Example                        |
| -------------------------- | ---------------------------------- | ------------------------------ |
| `--template <type>`        | Choose template type               | `--template corporate`         |
| `--skip-git`               | Skip git repository initialization | -                              |
| `--skip-update-check`      | Skip version update check          | -                              |
| `--verbose`                | Show detailed output               | -                              |
| `--config-set <key=value>` | Set user configuration             | `--config-set locale=en`       |
| `--config-get <key>`       | Get configuration value            | `--config-get defaultTemplate` |
| `--clear-cache`            | Clear template cache               | -                              |

### Template Types

**Interactive Menu (3 templates):**

| Template    | Use Case                         | Interactive Selection     |
| ----------- | -------------------------------- | ------------------------- |
| `standard`  | Full-stack apps with auth + i18n | **Next.js Boilerplate**   |
| `landing`   | Marketing/product pages          | **Landing Page Template** |
| `corporate` | Business websites                | **Corporate Template**    |

**Manual Selection Only (3 templates):**

| Template    | Use Case         | Command                                  |
| ----------- | ---------------- | ---------------------------------------- |
| `dashboard` | Admin panels     | `npx starkon admin --template dashboard` |
| `basic`     | Simple projects  | `npx starkon simple --template basic`    |
| `minimal`   | Bare-bones setup | `npx starkon minimal --template minimal` |

### Advanced Examples

```bash
# Interactive template selection (recommended)
npx starkon my-awesome-project

# Skip interactive menu with specific template
npx starkon acme-corp --template corporate --skip-git

# Landing page with verbose output
npx starkon product-launch --template landing --verbose

# Configuration management
npx starkon --config-set locale=en
npx starkon --config-get locale
npx starkon --clear-cache
```

## 📊 Feature Comparison

| Feature                  | Standard | Corporate | Landing | Dashboard | Basic  | Minimal |
| ------------------------ | -------- | --------- | ------- | --------- | ------ | ------- |
| **Core**                 |
| Next.js 16               | ✅       | ✅        | ✅      | ✅        | ✅     | ✅      |
| TypeScript 5.7           | ✅       | ✅        | ✅      | ✅        | ✅     | ✅      |
| Tailwind CSS             | ✅       | ✅        | ✅      | ✅        | ✅     | ❌      |
| React 19                 | ✅       | ✅        | ✅      | ✅        | ✅     | ✅      |
| **Authentication**       |
| JWT Auth System          | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| Protected Routes         | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| User Management          | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| Password Recovery        | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| **Internationalization** |
| i18n Support             | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| Multi-language           | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| URL Language Params      | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| **UI Components**        |
| Core UI Kit (46)         | ✅       | ✅        | ✅      | ✅        | ✅     | ❌      |
| Corporate Components     | ❌       | ✅        | ❌      | ❌        | ❌     | ❌      |
| Landing Sections         | ❌       | ❌        | ✅      | ❌        | ❌     | ❌      |
| Dashboard Components     | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| **Advanced Features**    |
| Command Menu (Cmd+K)     | ✅       | ✅        | ✅      | ✅        | ❌     | ❌      |
| File Upload              | ✅       | ✅        | ✅      | ✅        | ❌     | ❌      |
| Rich Text Editor         | ✅       | ✅        | ❌      | ✅        | ❌     | ❌      |
| Data Tables              | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| Error Boundaries         | ✅       | ✅        | ✅      | ✅        | ❌     | ❌      |
| **State Management**     |
| React Query              | ✅       | ✅        | ✅      | ✅        | ❌     | ❌      |
| Zustand                  | ✅       | ✅        | ✅      | ✅        | ❌     | ❌      |
| Redux (Optional)         | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| **Pages & Routing**      |
| Public Pages             | ✅       | ❌        | ✅      | ❌        | ❌     | ❌      |
| Corporate Pages          | ❌       | ✅        | ❌      | ❌        | ❌     | ❌      |
| Auth Pages               | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| Dashboard                | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| **Custom Hooks**         |
| useAuth                  | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| useTheme                 | ✅       | ✅        | ✅      | ✅        | ❌     | ❌      |
| useToast                 | ✅       | ✅        | ✅      | ✅        | ❌     | ❌      |
| useLocale                | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| useClipboard             | ✅       | ✅        | ✅      | ✅        | ❌     | ❌      |
| usePasswordStrength      | ✅       | ❌        | ❌      | ✅        | ❌     | ❌      |
| **Performance**          |
| Bundle Size              | Large    | Medium    | Small   | Medium    | Small  | Tiny    |
| Setup Time               | 2-3 min  | 1-2 min   | 1 min   | 2 min     | 30 sec | 15 sec  |

## 🚀 Deployment Guide

### 🟢 Vercel (Recommended)

Zero-configuration deployment for Next.js apps:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

**Features:**

- Automatic builds on git push
- Edge functions support
- Built-in analytics
- Custom domains

### 🟠 Netlify

Great for static and hybrid apps:

```bash
# Build for deployment
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=.next
```

### 🔵 Docker

For containerized deployment, add a Dockerfile to your scaffolded project:

```dockerfile
# Example Dockerfile (add to your project after scaffolding)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t my-starkon-app .
docker run -p 3000:3000 my-starkon-app
```

**Note:** Dockerfile is not included in the Starkon CLI package itself. Add it to your scaffolded project as needed.

### ☁️ Other Platforms

- **Railway:** `railway deploy`
- **Render:** Connect GitHub repository
- **AWS Amplify:** Push to connected git branch
- **Google Cloud:** `gcloud app deploy`

## ⚙️ Configuration

### Environment Variables

Create `.env.local` in your project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development

# Authentication (Standard & Dashboard templates)
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Database (if using)
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# App Configuration
NEXT_PUBLIC_APP_NAME=My Starkon App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### User Configuration

CLI configuration stored in `~/.starkon/config.json`:

```json
{
  "defaultTemplate": "corporate",
  "preferredPackageManager": "pnpm",
  "locale": "en",
  "skipGit": false,
  "skipUpdateCheck": false,
  "telemetryEnabled": true
}
```

## 🧪 Testing

### Running Tests

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Writing Tests

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/core/button'

test('Button renders correctly', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toHaveTextContent('Click me')
})
```

## 🎨 Customization

### Theme System

Customize your brand colors in `tailwind.config.mjs`:

```tsx
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(210 40% 98%)',
          100: 'hsl(210 40% 96%)',
          // ... your brand colors
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        // ... custom animations
      },
    },
  },
}
```

### Component Variants

Using class-variance-authority for type-safe variants:

```tsx
// Custom component with variants
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva('base-styles', {
  variants: {
    variant: {
      default: 'bg-primary text-white',
      outline: 'border border-primary text-primary',
      ghost: 'hover:bg-accent',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export function CustomButton({ variant, size, className, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

### Dark Mode

Theme switching with system preference detection:

```tsx
import { useTheme } from '@/hooks/useTheme'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
}
```

## 📋 Available Scripts

### Development

```bash
npm run dev              # Next.js development server (Turbo mode)
npm run build            # Production build
npm run start            # Production server
npm run analyze          # Bundle analyzer (set ANALYZE=true)
```

### Code Quality

```bash
npm run lint             # ESLint check
npm run type-check       # TypeScript validation
npm run prettier         # Code formatting
npm run prettier:check   # Check formatting only
```

### Testing

```bash
npm test                 # Jest test runner
npm run test:watch       # Watch mode testing
npm run test:coverage    # Generate coverage report
```

### Package Management (for contributors)

```bash
npm run build:lib        # Build CLI with tsup
npm run commit           # Commitizen conventional commits
npm run release          # Release management with release-it
npm run prepare          # Husky git hooks setup
```

## 🔄 Migration Guide

### From Create Next App

```bash
# 1. Create Starkon project
npx starkon my-app --template basic

# 2. Copy your existing code
cp -r old-project/src/app/* new-project/src/app/
cp -r old-project/components/* new-project/src/components/

# 3. Update imports
# Change: import { Button } from '../components/Button'
# To:     import { Button } from '@/components/core/button'

# 4. Install your additional dependencies
cd new-project
npm install your-packages
```

### From Other Boilerplates

1. **Extract your custom components** to `src/components/`
2. **Move API logic** to `src/lib/services/`
3. **Update styling** to use Tailwind classes
4. **Add TypeScript types** in `src/lib/types/`
5. **Integrate with providers** in `src/providers/`

### Migrating Authentication

If you have existing auth:

1. Review Starkon's JWT flow in `src/lib/services/authApiService.ts`
2. Replace mock service with your API endpoints
3. Update token structure in `sessionTokenManager.ts`
4. Modify `AuthProvider.tsx` for your auth logic

## 🤝 Contributing

We welcome contributions to make Starkon even better!

### Development Setup

```bash
# Clone repository
git clone https://github.com/zzafergok/starkon.git
cd starkon

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build CLI
npm run build:lib
```

### Creating New Templates

```bash
# 1. Add template to index.js TEMPLATES object
# 2. Define excludeFiles array (exclusion-based system)
# 3. Test template generation
npx starkon test-app --template your-template

# 4. Update README.md with template documentation
# 5. Submit PR
```

### Guidelines

- **Code Quality:** Follow ESLint and Prettier rules
- **Testing:** Add tests for new features
- **Documentation:** Update README for new features
- **TypeScript:** Maintain full type safety
- **Conventional Commits:** Use `npm run commit` for commits

## 📈 Performance

### Bundle Analysis

```bash
# Analyze your build
ANALYZE=true npm run build

# Opens webpack-bundle-analyzer in browser
```

### Optimization Features

- **Automatic Code Splitting** - Route-based splitting
- **Image Optimization** - Next.js Image component
- **Font Optimization** - Google Fonts optimization
- **Static Generation** - ISG and SSG support
- **Edge Runtime** - Faster cold starts
- **React Server Components** - Reduced client bundle

## 🛠️ Troubleshooting

### Common Issues

**Build Errors:**

```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors:**

```bash
# Check types without building
npm run type-check

# Clear TypeScript cache
rm -rf node_modules/.cache
```

**Authentication Issues:**

```bash
# Check token in browser storage
# DevTools -> Application -> Session Storage -> tokens

# Clear all auth data
localStorage.clear()
sessionStorage.clear()
```

**i18n Not Working:**

```bash
# Check language detection priority:
# 1. localStorage 'language' key
# 2. Cookie 'language' key
# 3. URL parameter ?lang=en
# 4. Browser navigator.language
# 5. Default: 'tr'

# Force language
localStorage.setItem('language', 'en')
```

**Component Not Found:**

```bash
# Check import path uses @ alias
import { Button } from '@/components/core/button'  # ✅ Correct
import { Button } from '../components/core/button' # ❌ Wrong

# Verify tsconfig.json has paths configured:
# "@/*": ["./src/*"]
```

### Getting Help

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/zzafergok/starkon/issues)
- 💬 **Questions:** [Discussions](https://github.com/zzafergok/starkon/discussions)
- 📧 **Contact:** [zafer@starkon.website](mailto:zafer@starkon.website)
- 📚 **Documentation:** [CLAUDE.md](CLAUDE.md) (for development)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

**Core Technologies:**

- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Radix UI](https://www.radix-ui.com/)** - Low-level accessible UI primitives
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Query](https://tanstack.com/query)** - Powerful data synchronization
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management

**Inspiration:**

- **[shadcn/ui](https://ui.shadcn.com/)** - Component design patterns
- **[T3 Stack](https://create.t3.gg/)** - TypeScript-first development
- **[Vercel Templates](https://vercel.com/templates)** - Deployment optimization

---

<div align="center">

### 🌊 Ready to Build Something Amazing?

**[Get Started](https://github.com/zzafergok/starkon#quick-start) • [View Examples](https://starkon.website) • [Read Docs](https://github.com/zzafergok/starkon/wiki)**

Made with ❤️ by [Zafer Gök](https://github.com/zzafergok)

⭐ **If Starkon helped you ship faster, please give us a star on GitHub!**

</div>

---

## 📊 Stats

- 🎨 **46 UI Components** ready to use
- 🔐 **Complete Auth System** with JWT tokens & 5 auth flows
- 🌍 **2 Languages** supported (English, Turkish) with easy expansion
- 📱 **6 Templates** (3 interactive + 3 manual selection)
- 🪝 **7 Custom Hooks** for common patterns
- 🔌 **5 Providers** for app-wide state management
- ⚡ **Interactive CLI** with arrow key navigation
- 🚀 **< 30 seconds** from CLI to running app
- 🛠️ **Production Ready** - no additional setup needed
- 📦 **React 19** & **Next.js 16** - Latest versions
