![AURORA Project Banner](https://www.aurora-h2020.eu/wp-content/uploads/2022/08/Logo-Website.png)

# AURORA Web App & Dashboard

[![Upload Localizations to LingoHub](https://github.com/AURORA-H2020/AURORA-Dashboard/actions/workflows/upload_localizations_to_lingo_hub.yml/badge.svg)](https://github.com/AURORA-H2020/AURORA-Dashboard/actions/workflows/upload_localizations_to_lingo_hub.yml)
[![Import Localizations from LingoHub](https://github.com/AURORA-H2020/AURORA-Dashboard/actions/workflows/import_localizations_from_lingo_hub.yml/badge.svg)](https://github.com/AURORA-H2020/AURORA-Dashboard/actions/workflows/import_localizations_from_lingo_hub.yml)

**[Website](https://www.aurora-h2020.eu/) | [Dashboard](https://dashboard.aurora-h2020.eu)**

## About the Project

**AURORA** is a pioneering Innovation Action funded by the EU’s **Horizon 2020** programme. Starting in December 2021 with €4.6 million in funding, AURORA aims to demonstrate how ordinary citizens can drive the transition to a near-zero emission society.

The project engages approximately **7,000 citizens** across five locations (Denmark, England, Portugal, Slovenia, and Spain) to become "citizen scientists." These communities are not only reducing their own carbon footprint but are also crowd-funding local **photovoltaic (PV) facilities** to produce ~1 megawatt of renewable energy.

This repository contains the **Web Application** and **Interactive Dashboard** for the AURORA ecosystem. It serves two main purposes:
1.  **Web App**: A web-based version of the mobile app, enabling participants to track their energy behavior and impact.
2.  **Public Dashboard**: An interactive platform accessible to all users (including non-participants) to visualize the project's aggregate impact and energy data.

## Key Features

*   **Interactive Public Dashboard:** A publicly accessible dashboard showcasing real-time data on energy generation, carbon savings, and community impact across all AURORA demo sites.
*   **Personal Emissions Profile:** Enter your energy consumptions for electricity, heating, and transportation to create a comprehensive carbon footprint profile unique to your lifestyle.
*   **Track Energy Usage:** Monitor and visualise your carbon footprint and energy usage trends over time, gaining valuable insights into your environmental impact.
*   **Energy Labels:** Receive energy labels based on your consumptions and discover ways to lower your usage, improving your labels and actively reducing your environmental impact.
*   **Track Local Photovoltaic:** Monitor the performance of local solar power installations and their contribution to offsetting emissions.
*   **Personalised Recommendations:** Receive helpful tips and recommendations based on your consumption data for improving your energy behaviour.

## Tech Stack

The AURORA Web App & Dashboard is built with modern web technologies, leveraging **Next.js** for the framework and **Firebase** for backend services.

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Radix UI](https://www.radix-ui.com/), [Tremor](https://www.tremor.so/) (for charts & dashboard)
*   **Icons**: [Lucide React](https://lucide.dev/), [FontAwesome](https://fontawesome.com/)
*   **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
*   **Backend / Cloud**:
    *   [Firebase Authentication](https://firebase.google.com/docs/auth)
    *   [Firebase Firestore](https://firebase.google.com/docs/firestore)
    *   [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
*   **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/)

## Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v20.0.0 or later)
*   [npm](https://www.npmjs.com/)

### Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AURORA-H2020/AURORA-Dashboard.git
    cd AURORA-Dashboard
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env.local` file in the root directory and add the required Firebase and API configuration.
    You can use `example.env` as a template.

    ```plaintext
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    ...
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The project follows a standard Next.js App Router structure within the `src` directory:

*   `src`
    *   `app`: App Router pages and layouts.
    *   `components`: Reusable UI components (atoms, molecules, organisms).
    *   `firebase`: Firebase configuration and utility functions.
    *   `i18n`: Internationalization configuration and locales.
    *   `lib`: Helper functions, constants, and utilities.
    *   `models`: TypeScript interfaces and Zod schemas.
    *   `providers`: React Context providers (e.g., AuthProvider, ThemeProvider).

## The Project Consortium

The AURORA project is a collaboration between nine institutions across six countries:

*   **Technical University of Madrid** (Spain) - Project Coordinator
*   **Aarhus University** (Denmark)
*   **Centre for Sustainable Energy** (United Kingdom)
*   **Forest of Dean District Council** (United Kingdom)
*   **Institute for Science & Innovation Communication** (Germany)
*   **KempleyGreen Consultants** (United Kingdom)
*   **Qualifying Photovoltaics** (Spain)
*   **University of Ljubljana** (Slovenia)
*   **University of Évora** (Portugal)

## License & Funding

This project is part of the AURORA initiative.

<img src="https://www.aurora-h2020.eu/wp-content/uploads/elementor/thumbs/EU-Flag-psu6pdbcnlpmaljtwxkotmokm7piv22d31neeas0vc.png" width="100" align="left" style="margin-right: 20px;" />

**Funded by the European Union.**
This project has received funding from the European Union’s **Horizon 2020** research and innovation programme under grant agreement No **[101036418](https://cordis.europa.eu/project/id/101036418)**.
