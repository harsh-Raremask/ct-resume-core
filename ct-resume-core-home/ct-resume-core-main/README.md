# 📄 CT Resume Core — Professional Resume & Career Design Studio

A modern, high-performance web application built with **React 19**, **TypeScript**, **Vite 7**, and **Tailwind CSS v4**.

Designed as a specialized sibling project to Raremask, custom-tailored for **resume building, ATS resume formats, executive CV rewrites, LinkedIn optimization, and digital career downloads**.

---

## ✨ Key Features

1. **🎨 100% Fully Customized Admin Vault**
   - Access via `/ct-vault` (or `/admin`)
   - 16 comprehensive configuration tabs
   - Real-time live preview & instant publication

2. **🧭 Master Navbar Builder & Default Links Controls**
   - **Pre-existing / Default Links** (`Home`, `Templates`, `Services`, `Store`, `About`) are completely customizable!
   - Rename any link label (e.g. change "Templates" to "Resume CVs")
   - Change target URLs
   - Add custom badges (`NEW`, `HOT`, `PRO`) and emoji icons
   - **Toggle ON / OFF for any navbar link**: Want to hide "Store" or "About"? Just flip the toggle!
   - Reorder navbar links (Move Up / Move Down)
   - Add new custom pages or external links
   - 1-Click "Reset to Defaults" anytime

3. **🖼️ Visual Page & Section Builder (Word & Canva Style)**
   - **Image Canvas**: Word-style text wrapping (Float Left / Float Right), alignments, widths (25% to 100%), border radii, shadows, and clickable destination links!
   - **Rich Context & Text**: Paragraphs, bold text, bullet points with clean document formatting.
   - **Button Sections**: Multiple buttons side-by-side with individual ON/OFF toggles, custom styles, icons, and links.
   - **Interactive Callout Cards**: Link boxes with badge, icon, title, description, and link target.
   - **Automatic Dynamic Routing**: Every page slug created (e.g. `/:slug`) is immediately live!

4. **🔘 Master Button Controls (Turn ON / OFF Any Button)**
   Every single button across the website can be enabled or disabled with 1 click:
   - Navbar "Get Started" CTA Button
   - Activity Bell & User Sign-In triggers
   - Hero Primary ("View Templates") & Secondary ("Get Started") buttons
   - Templates section "See All" link & card click interactions
   - Services "Book Now / Get Started" order buttons
   - Store "Instant Buy" & "Download Free" buttons
   - Bottom CTA Strip "Order Now" button
   - Floating Quick-Action Button (WhatsApp / Services / Store)
   - Footer "Back to Top", Admin link & social links

5. **👁️ Section Visibility Toggles**
   - Navigation Bar
   - Hero Showcase Banner
   - Moving Marquee Strip
   - Featured Templates / Work
   - Services Preview Cards
   - Digital Products Store
   - Testimonials
   - Bottom CTA Strip
   - Floating Order Button
   - Footer

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Start Local Development Server
```bash
npm run dev
# or
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Access Admin Vault
Navigate to:
- **URL**: `http://localhost:5173/ct-vault` (or `/admin`)
- **Default Email**: `admin@ctresume.com`
- **Default Password**: `admin123` (or any 6+ character password)

---

## 📁 Project Structure

```
CT-RESUME-CORE/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── App.tsx                     # Main router with dynamic /:slug custom pages
│   ├── index.css                   # Dynamic CSS variables & Tailwind v4 theme
│   ├── main.tsx                    # React DOM entry point
│   ├── contexts/
│   │   ├── ContentContext.tsx      # Global reactive content state & localStorage
│   │   └── AuthContext.tsx         # User authentication & access gate handler
│   ├── lib/
│   │   ├── blocks.ts               # Block library & custom page schema (Word/Canva)
│   │   ├── site.ts                 # Service & template category definitions
│   │   ├── content.ts              # Master SiteContent schema & button toggle defaults
│   │   ├── adminApi.ts             # Session security & JWT bearer interceptor
│   │   └── supabase.ts             # Supabase client connector
│   ├── components/
│   │   ├── Nav.tsx                 # Fully customizable navbar (all core + custom links)
│   │   ├── Footer.tsx              # Footer with smooth scroll & social links
│   │   ├── Marquee.tsx             # Infinite moving strip
│   │   ├── CTAStrip.tsx            # Conversion banner
│   │   ├── FloatingOrderButton.tsx # WhatsApp / quick action button
│   │   ├── ConfirmDialog.tsx       # Modal confirmation popup
│   │   ├── BlockRenderer.tsx       # Renders Word/Canva image layouts, buttons, context
│   │   └── work/
│   │       └── ProjectCard.tsx     # Resume template preview card
│   └── pages/
│       ├── Home.tsx                # Homepage with hero, featured work & services
│       ├── Work.tsx                # Resume templates filterable catalog
│       ├── Services.tsx            # Resume rewrite & LinkedIn packages
│       ├── Store.tsx               # Digital products & instant download guides
│       ├── About.tsx               # Team, stats, and philosophy
│       ├── CustomPage.tsx          # Dynamic renderer for any custom page/section slug
│       └── Admin.tsx               # Master Admin Vault with 16 customization tabs
```
