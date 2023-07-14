import { Metric, Text, CategoryBar, Legend, Color } from "@tremor/react";

const data: {
    title: string;
    metric: string;
    subCategoryValues: number[];
    subCategroyColors: Color[];
    subCategoryTitles: string[];
} = {
    title: "Total users",
    metric: "10,345",
    subCategoryValues: [30, 70],
    subCategroyColors: ["emerald", "red"],
    subCategoryTitles: ["Active users", "Inactive users"],
};

export default function DetailedCard() {
    return (
        <>
            <Text>{data.title}</Text>
            <Metric>{data.metric}</Metric>
            <CategoryBar
                values={data.subCategoryValues}
                colors={data.subCategroyColors}
                className="mt-4"
            />
            <Legend
                categories={data.subCategoryTitles}
                colors={data.subCategroyColors}
                className="mt-3"
            />
        </>
    );
}
