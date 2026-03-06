"use client";

import { useState } from "react";
import EditPetModal from "./EditPetModal";

export default function PetDetailHeaderActions({ pet }: { pet: any }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-[var(--vy-primary-700)] bg-[var(--vy-primary-50)] hover:bg-[var(--vy-primary-100)] transition-colors"
            >
                Editar Perfil
            </button>

            {isEditModalOpen && (
                <EditPetModal
                    pet={pet}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </>
    );
}
