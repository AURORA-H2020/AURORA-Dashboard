// import the react-json-view component
import { ReactNode } from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

/**
 * Renders a JSON view of the provided data.
 *
 * @param {Object} data - The data to be displayed in the JSON view.
 * @return {ReactNode} - The JSON view component.
 */
const AboutJson = ({ data }: { data: Object }): ReactNode => {
  return <JsonView src={data} collapsed={1} />;
};

export { AboutJson };
