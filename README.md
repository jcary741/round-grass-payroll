# Payroll Analytics Tool

This is a sample single-page application for payroll analytics.

## Tech Stack

*   **Framework:** [React](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Bootstrap](https://getbootstrap.com/) (loaded from CDN)
*   **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com/)

## Development

This project uses `npm` for package management, with the app located under the `round-grass-5c74` directory.

### Prerequisites

*   Node.js and npm
*   Wrangler CLI for Cloudflare Pages deployment

### Getting Started

1.  Install dependencies:
    ```sh
    npm install
    ```

2.  Start the development server:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build, run:
```sh
npm run build
```

### Local Preview

To preview the production build locally using Wrangler:
```sh
npm run preview
```

### Deployment

To deploy the application to Cloudflare Pages, run:
```sh
npm run deploy
```
