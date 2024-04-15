"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utilities";
import React, { useState } from "react";
import BlacklistUserForm from "../forms/blacklistUserForm";

const BlacklistUserModal = React.forwardRef(
    (
        props: {
            children: React.ReactNode;
            uid: string;
            className?: string;
        },
        _ref,
    ) => {
        const { uid, children, className } = props;

        const [isModalOpen, setIsModalOpen] = useState(false);

        const handleCloseModal = () => {
            setIsModalOpen(false);
        };

        return (
            <>
                <div
                    onClick={() => setIsModalOpen(true)}
                    className={cn(className, "mt-0")}
                >
                    {children}
                </div>
                <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Blacklist User: {uid}</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[80vh]">
                            <BlacklistUserForm blacklistUid={uid} />
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </>
        );
    },
);

BlacklistUserModal.displayName = "BlacklistUserModal";

export default BlacklistUserModal;
