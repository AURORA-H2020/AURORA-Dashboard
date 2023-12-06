import { useEffect } from "react";
import { Card, Col, Color, Grid, Title } from "@tremor/react";
import { IconX } from "@tabler/icons-react";

export default function Modal({
    isOpen,
    onClose,
    children,
    modalIcon,
    modalTitle,
    modalColor,
}: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    modalIcon: React.ReactNode;
    modalTitle: string;
    modalColor: Color | undefined;
}) {
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(
                document.body,
            ).overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto h-full w-full"
            onClick={onClose}
        >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50" />
            <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Card
                    className="relative w-full max-w-md transform bg-white p-4 shadow-lg rounded-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Grid numItems={3} className="mb-4">
                        <Col className="flex items-start justify-start">
                            <div
                                className={`bg-${modalColor}-500 rounded-full p-2 inline-flex`}
                            >
                                {modalIcon}
                            </div>
                        </Col>
                        <Col className="flex items-center justify-center">
                            <Title>{modalTitle}</Title>
                        </Col>
                        <Col className="flex items-start justify-end">
                            <button onClick={onClose}>
                                <IconX />
                            </button>
                        </Col>
                    </Grid>
                    <div className="overflow-y-auto max-h-full">{children}</div>
                </Card>
            </div>
        </div>
    );
}
