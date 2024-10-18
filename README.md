# AURORA Web App & Dashboard

[![Import localizations from lingo hub](https://github.com/AURORA-H2020/AURORA-Dashboard/actions/workflows/import_localizations_from_lingo_hub.yml/badge.svg)](https://github.com/AURORA-H2020/AURORA-Dashboard/actions/workflows/import_localizations_from_lingo_hub.yml)

[![Upload localizations to lingo hub](https://github.com/AURORA-H2020/AURORA-Dashboard/actions/workflows/upload_localizations_to_lingo_hub.yml/badge.svg)](https://github.com/AURORA-H2020/AURORA-Dashboard/actions/workflows/upload_localizations_to_lingo_hub.yml)

AURORA is demonstrating how people can make a difference through the choices they make, reducing 13-20% of all greenhouse gas emissions linked to residential energy use and 13% linked to transport choices. In addition, the project will empower people to take ownership of new community solar energy projects.

## Purpose and Main Features

The AURORA Dashboard is designed to help users track and reduce their carbon footprint by monitoring their energy consumption and transportation choices. The main features of the dashboard include:

- Tracking energy consumption from various sources such as electricity, heating, and transportation.
- Providing insights and recommendations to reduce energy consumption and carbon emissions.
- Allowing users to participate in community solar energy projects.
- Visualizing data through interactive charts and graphs.
- Supporting multiple languages for a diverse user base.

## Getting Started

### Prerequisites

- Node.js
- npm
- Firebase account

### Environment Variables

Create a `.env.local` file in the root directory of the project and add the following environment variables:

```plaintext
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_KEY=
NEXT_PUBLIC_APP_CHECK_DEBUG_TOKEN=
NEXT_PUBLIC_TEST_MODE=false
PV_API_TOKEN=
PV_API_BASE_URL=
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AURORA-H2020/AURORA-Dashboard.git
cd AURORA-Dashboard
```

2. Install the dependencies:

```bash
npm install
```

3. Initialize a Firebase Project using the [AURORA Firebase Repository](https://github.com/AURORA-H2020/AURORA-Firebase).

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.
- [Firebase Documentation](https://firebase.google.com/docs) - Learn about Firebase features and API.
- [AURORA Firebase Repository](https://github.com/AURORA-H2020/AURORA-Firebase) - Initialize a Firebase Project for AURORA.

---

This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No. 101036418.
