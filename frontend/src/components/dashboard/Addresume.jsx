import React, { useState } from "react";
import { Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { useNavigate } from "react-router-dom";

import { createResume } from "../../api/resumeApi";

const NewResumeCard = ({ onCreate }) => {
    const [openDialog, setopenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | Create Resume
    |--------------------------------------------------------------------------
    */

    const handleCreate = async () => {
        const trimmedTitle = resumeTitle.trim();

        if (!trimmedTitle || isCreating) {
            return;
        }

        try {
            setIsCreating(true);

            /*
            |--------------------------------------------------------------------------
            | Create Empty Resume
            |--------------------------------------------------------------------------
            |
            | resumeApi.js automatically generates the UUID.
            |
            */

            const response = await createResume({
                title: trimmedTitle,

                personal_info: {},

                personal_summary: "",

                personal_summary_visible: true,

                experience: [],

                experienceTitle: "Experience",

                education: [],

                skills: [],

                projects: [],

                templates: "classic",

                accent_color: "#000000",

                public: false,
            });

            const createdResume = response.resume;

            /*
            |--------------------------------------------------------------------------
            | Update Dashboard
            |--------------------------------------------------------------------------
            */

            onCreate(createdResume);

            /*
            |--------------------------------------------------------------------------
            | Reset Dialog
            |--------------------------------------------------------------------------
            */

            setResumeTitle("");
            setopenDialog(false);

            /*
            |--------------------------------------------------------------------------
            | Open Resume Builder
            |--------------------------------------------------------------------------
            */

            navigate(
                `/resumebuilder/${createdResume.resumeId}`
            );
        } catch (error) {
            console.error(
                "Failed to create resume:",
                error
            );
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    /*
                    |--------------------------------------------------------------------------
                    | IMPORTANT:
                    | Do NOT create resume here.
                    | Only open dialog.
                    |--------------------------------------------------------------------------
                    */

                    setopenDialog(true);
                }}
                className=" flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-rose-400 hover:bg-rose-50/40 hover:text-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
                <Plus size={28} />

                <span className="text-base font-medium">
                    New resume
                </span>
            </button>

            <Dialog
                open={openDialog}
                onOpenChange={setopenDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Create New Resume
                        </DialogTitle>

                        <DialogDescription>
                            Enter the title of your new resume and click "Create" to get started.
                        </DialogDescription>

                        <Input
                            placeholder="Resume Title"
                            className="p-3 mt-2"
                            value={resumeTitle}
                            onChange={(e) => setResumeTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    resumeTitle.trim()
                                ) {
                                    handleCreate();
                                }
                            }}
                            disabled={isCreating}
                        />

                        <div className="flex items-center justify-end gap-2 mt-4">
                            <button
                                onClick={() => {
                                    if (isCreating) return;

                                    setResumeTitle("");
                                    setopenDialog(false);
                                }}
                                className="hover:bg-gray-200 p-2 rounded-md"
                                disabled={isCreating}
                            >
                                cancel
                            </button>

                            <button
                                onClick={handleCreate}
                                disabled={
                                    !resumeTitle.trim() ||
                                    isCreating
                                }
                                className="bg-[#05a2ff] text-white hover:bg-[#0093dc] p-2 rounded-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isCreating
                                    ? "creating..."
                                    : "create"}
                            </button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NewResumeCard;