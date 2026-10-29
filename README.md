# Cooperativa Web Project

## Overview
This is a legacy project for which I have provided maintenance and modernization services to restore its functionality and ensure a successful deployment.

## Maintenance & Improvements
The following updates have been implemented to stabilize and secure the application:
- **Restoration:** Performed necessary repairs to align the codebase with current production requirements.
- **Interactive Product Catalog:** Enhanced the product showcase with detailed modals for all items, featuring a desktop interactive zoom lens (hover/click) for inspecting label and nutritional details, as well as an optimized mobile experience with a Front/Label tab toggle and automatic whitespace cropping.
- **Email Service Migration:** Replaced `nodemailer` with `Resend` to resolve previous email delivery issues.
- **Anti-Spam Security:** Implemented language-based filtering to mitigate spam, specifically tailored to the project's target audience.
- **Deployment:** Configured and deployed the application on **Railway**, including all necessary DNS configurations.

## Technologies Used
- **Node.js**
- **Express.js**
- **Bootstrap 4 / CSS3 / Vanilla JS** (Custom product modals & interactive lens)
- **Resend** (Email Service)
- **Railway** (Deployment Platform)
- **franc/langs** (Language filtering)
