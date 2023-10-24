"use client";

// import the react-json-view component
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

export default function AboutJson({ data }: { data: Object }) {
    return <JsonView src={data} collapsed={1} />;
}
