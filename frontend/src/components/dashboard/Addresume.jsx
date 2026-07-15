import React from 'react'
import { Plus } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const NewResumeCard = ({ onCreate }) => {
    const [openDialog, setopenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState("");
    const navigate = useNavigate();

   const handleCreate = () => {
    const uuid = uuidv4();
    console.log(resumeTitle,uuid);
    navigate('/resumebuilder');
   }
        
    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    onCreate();
                    setopenDialog(true);
                }}
                className=" flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-rose-400 hover:bg-rose-50/40 hover:text-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
                <Plus size={28} />
                <span className="text-base font-medium">New resume</span>
            </button>
            <Dialog open={openDialog} onOpenChange={setopenDialog}>      
                
                <DialogContent>
                    <DialogHeader> 
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            <p className="text-sm text-gray-500 mb-4">
                               Enter the title of your new resume and click "Create" to get started.
                            </p>
                            <Input 
                                placeholder="Resume Title" 
                                className="p-3 mt-2" 
                                value={resumeTitle}
                                onChange={(e) => setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <div className="flex items-center justify-end gap-2 mt-4">
                            <button onClick={()=>setopenDialog(false)} variant='ghost' className="hover:bg-gray-200 p-2 rounded-md" onClick={() => setopenDialog(false)}>
                                cancel
                            </button>
                            <button onClick={handleCreate} disabled={!resumeTitle} className="bg-[#05a2ff] text-white hover:bg-[#0093dc] p-2 rounded-md">
                                create
                            </button>
                        </div>
                    </DialogHeader> 
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default NewResumeCard