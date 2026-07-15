import React from 'react'

const Test = () => {
    return (
        <div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl p-8">

                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-[#EAF7FF] flex items-center justify-center">
                            ✨
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Create New Resume
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                                Give your resume a title. You can rename it later.
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Resume Title
                        </label>

                        <input
                            type="text"
                            placeholder="Software Engineer Resume"
                            className="w-full rounded-xl border border-gray-200 bg-[#FAFCFF]
        px-4 py-3 outline-none transition
        focus:border-[#05A2FF]
        focus:ring-4 focus:ring-[#05A2FF]/10"
                        />

                        <p className="text-xs text-gray-400">
                            Example: Frontend Developer Resume 2026
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            className="px-5 py-2.5 rounded-xl border
        border-gray-200
        hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>

                        <button
                            className="px-6 py-2.5 rounded-xl
        bg-[#05A2FF]
        text-white
        font-medium
        hover:bg-[#0289DB]
        transition
        shadow-lg shadow-sky-300/30"
                        >
                            Create Resume →
                        </button>
                    </div>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Test