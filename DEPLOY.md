# Mission Forge AI — GitHub Pages Deployment Guide

## Overview

This site is a pure static HTML/CSS/JS website, ready to deploy on GitHub Pages — free, secure (HTTPS), and reliable.

---

## Step 1: Create a GitHub Account

If you don't have one already, go to [github.com](https://github.com) and sign up for a free account.

---

## Step 2: Create a New Repository

1. Click the **+** icon in the top right and choose **New repository**
2. Name it exactly: `missionforge.ai` (or any name you prefer)
3. Set it to **Public**
4. Leave all other settings as default
5. Click **Create repository**

---

## Step 3: Upload the Website Files

### Option A — Drag and Drop (simplest)

1. On your new empty repository page, click **uploading an existing file**
2. Drag the entire contents of this folder into the upload area
3. Write a commit message like "Initial site launch"
4. Click **Commit changes**

### Option B — GitHub Desktop (recommended for ongoing updates)

1. Download [GitHub Desktop](https://desktop.github.com)
2. Clone your new repository to your computer
3. Copy all the files from this folder into the cloned repository folder
4. In GitHub Desktop, click **Commit to main**, then **Push origin**

---

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top tab)
3. In the left sidebar, click **Pages**
4. Under **Source**, select **Deploy from a branch**
5. Set branch to **main**, folder to **/ (root)**
6. Click **Save**

GitHub will give you a URL like: `https://yourusername.github.io/missionforge.ai`

Your site will be live within 1-2 minutes.

---

## Step 5: Connect Your Custom Domain (missionforge.ai)

### In GitHub:
1. Go to Settings > Pages
2. Under **Custom domain**, type: `missionforge.ai`
3. Click **Save**
4. GitHub will create a `CNAME` file automatically

### In your domain registrar (Squarespace Domains or wherever missionforge.ai is registered):

Add these DNS records:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | yourusername.github.io |

DNS changes can take up to 48 hours to propagate. GitHub Pages will automatically provision an SSL/HTTPS certificate once the domain resolves.

---

## Step 6: Set Up Contact Form (Formspree)

The contact form is pre-wired for [Formspree](https://formspree.io) — a free service that sends form submissions to your email.

1. Go to [formspree.io](https://formspree.io) and sign up (free)
2. Create a new form and copy your **Form ID** (looks like `xpznakqv`)
3. Open `contact.html` in any text editor
4. Find this line: `action="https://formspree.io/f/YOUR_FORM_ID"`
5. Replace `YOUR_FORM_ID` with your actual form ID
6. Save and re-upload the file to GitHub

Formspree's free tier allows 50 submissions/month — more than enough for initial use.

---

## Updating the Site

To update content or add your headshot:

1. Edit the relevant `.html` file in any text editor (or ask Claude to update it)
2. To add your headshot:
   - Save your photo as `assets/ken-griesi.jpg`
   - In `index.html` and `about.html`, replace the placeholder `<div>` blocks with: `<img src="assets/ken-griesi.jpg" alt="Kenneth Griesi" />`
3. To add your actual logo:
   - Save your logo as `assets/logo.svg` or `assets/logo.png`
   - Replace the `.nav__logo-mark` and `.nav__logo-text` elements with an `<img>` tag
4. Push the updated files to GitHub — the site updates automatically within seconds

---

## File Structure

```
Mission Forge AI Website/
├── index.html          ← Home page
├── about.html          ← About Ken + all testimonials
├── services.html       ← Services detail
├── contact.html        ← Contact form + FAQ
├── css/
│   └── style.css       ← All styles (design system)
├── js/
│   └── main.js         ← Navigation, animations, form
├── assets/
│   ├── favicon.svg     ← Browser tab icon
│   └── ken-griesi.jpg  ← Add your headshot here
└── DEPLOY.md           ← This file
```

---

## Squarespace Transition Notes

- Export any blog posts or additional content from Squarespace before canceling
- Keep the Squarespace domain connected until your GitHub Pages + custom domain is confirmed working
- Once DNS propagates and HTTPS is active on GitHub Pages, you can safely cancel Squarespace

---

*Built by Mission Forge AI using Claude. For questions or updates, reach out at ken@missionforge.ai*
