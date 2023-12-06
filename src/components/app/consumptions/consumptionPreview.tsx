import Modal from "@/components/modal";
import { titleCase } from "@/lib/utilities";
import { Consumption } from "@/models/extensions";
import { ConsumptionCategory } from "@/models/userData";
import { IconBolt, IconCar, IconTemperaturePlus } from "@tabler/icons-react";
import {
    Title,
    Card,
    Grid,
    Col,
    Subtitle,
    Text,
    Color,
    Button,
} from "@tremor/react";
import { ReactElement, useState } from "react";
import ConsumptionView from "./consumptionView";

export default function ConsumptionPreview({
    consumption,
}: {
    consumption: Consumption;
}) {
    let consumptionIcon: ReactElement | undefined;
    let consumptionType: ConsumptionCategory;
    let consumptionUnit: string | undefined;
    let consumptionColor: Color | undefined;

    if ("electricity" in consumption) {
        consumptionIcon = <IconBolt />;
        consumptionType = "electricity";
        consumptionUnit = "kWh";
        consumptionColor = "yellow";
    } else if ("transportation" in consumption) {
        consumptionIcon = <IconCar />;
        consumptionType = "transportation";
        consumptionUnit = "km";
        consumptionColor = "blue";
    } else if ("heating" in consumption) {
        consumptionIcon = <IconTemperaturePlus />;
        consumptionType = "heating";
        consumptionUnit = "kWh";
        consumptionColor = "red";
    }
    // State to manage the visibility of the modal
    const [isModalOpen, setModalOpen] = useState(false);

    // Function to handle modal open
    const openModal = () => {
        setModalOpen(true);
    };

    // Function to handle modal close
    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <Card>
                <Grid numItems={4}>
                    <Col>
                        <div
                            className={`bg-${consumptionColor}-500 rounded-full p-2 inline-flex`}
                        >
                            {consumptionIcon}
                        </div>
                    </Col>
                    <Col>
                        <Title>{titleCase(consumption.category)}</Title>
                        <Text>
                            {consumption.updatedAt?.nanoseconds
                                ? new Date(
                                      consumption.updatedAt.nanoseconds,
                                  ).toDateString()
                                : ""}
                        </Text>
                    </Col>
                    <Col>
                        <Subtitle>
                            {consumption.value
                                ? Math.round(consumption.value) +
                                  " " +
                                  String(consumptionUnit)
                                : ""}
                        </Subtitle>
                        <Text>
                            {consumption.carbonEmissions
                                ? Math.round(consumption.carbonEmissions) +
                                  " CO2"
                                : "Calculating..."}{" "}
                        </Text>
                    </Col>
                    <Col>
                        <Button onClick={openModal}>View</Button>
                    </Col>
                </Grid>
            </Card>

            {/*Modal*/}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                modalTitle={titleCase(consumption.category)}
                modalIcon={consumptionIcon}
                modalColor={consumptionColor}
            >
                <ConsumptionView consumption={consumption} />
            </Modal>
        </>
    );
}
