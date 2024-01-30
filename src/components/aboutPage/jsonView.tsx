// import the react-json-view component
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

/**
 * Renders a JSON view of the provided data.
 *
 * @param {Object} data - The data to be displayed in the JSON view.
 * @return {JSX.Element} - The JSON view component.
 */
export default function AboutJson({ data }: { data: Object }): JSX.Element {
    return <JsonView src={data} collapsed={1} />;
}
