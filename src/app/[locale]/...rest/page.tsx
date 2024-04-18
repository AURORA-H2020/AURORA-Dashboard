import { notFound } from "next/navigation";

/**
 * Renders a catch-all page for unhandled routes.
 *
 * This function is responsible for rendering a catch-all page for unhandled routes in the application. It calls the `notFound` function from the `next/navigation` module to handle the 404 error.
 *
 * @return {React.ReactElement} Renders a not found page.
 */
const CatchAllPage = (): React.ReactElement => {
    notFound();
};

export default CatchAllPage;
