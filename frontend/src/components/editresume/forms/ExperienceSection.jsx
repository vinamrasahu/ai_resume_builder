import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link2,
  ListOrdered,
  List,
  Undo2,
  Redo2,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Check,
} from "lucide-react";

let idCounter = 1;

const generateId = () =>
  `exp-${idCounter++}-${Date.now()}`;

const createEmptyEntry = () => ({
  id: generateId(),
  jobTitle: "",
  employer: "",
  employerLink: "",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
  expanded: true,

});

function ToolbarButton({ onClick, label, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={label}
      aria-label={label}
      className="p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
    >
      {children}
    </button>
  );
}

function ExperienceCard({
  entry,
  onUpdate,
  onDelete,
  onToggleExpand,
}) {
  const editorRef = useRef(null);

  const [fieldFocused, setFieldFocused] = useState(null);
  const [descriptionFocused, setDescriptionFocused] =
    useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
const [linkInput, setLinkInput] = useState(entry.employerLink || "");

  const update = (field, value) => {
    onUpdate(entry.id, {
      [field]: value,
    });
  };

  /*
   * Important:
   * Do NOT update innerHTML on every `entry.description` change.
   * That would reset the cursor while typing.
   */
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML =
        entry.description || "";
    }
  }, [entry.id]);

  const inputClasses = (fieldName) => {
    const base =
      "w-full px-4 py-3 rounded-lg text-gray-700 placeholder-gray-400 " +
      "outline-none transition-all duration-150 border text-sm";

    if (fieldFocused === fieldName) {
      return `${base} bg-white border-blue-400 ring-4 ring-blue-50`;
    }

    return `${base} bg-gray-50 border-gray-200 hover:border-blue-200 hover:ring-4 hover:ring-blue-50/70`;
  };

  const handleDescriptionInput = () => {
    if (!editorRef.current) return;

    update(
      "description",
      editorRef.current.innerHTML
    );
  };

  const applyFormat = (
    command,
    value = null
  ) => {
    editorRef.current?.focus();

    document.execCommand(
      command,
      false,
      value
    );

    handleDescriptionInput();
  };

  const handleLink = () => {
    const url = window.prompt("Enter a URL");

    if (url) {
      applyFormat("createLink", url);
    }
  };

  /*
   * Temporary AI function.
   *
   * Later replace only this function's body
   * with your API call.
   */
  const handleGenerateWithAI = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      const sample = `<ul>
        <li>Assisted with day-to-day ${entry.jobTitle || "role"
        } responsibilities at ${entry.employer || "the company"
        }</li>
        <li>Collaborated with the team to meet deadlines and improve processes</li>
        <li>Documented key metrics and reported progress to management</li>
      </ul>`;

      if (editorRef.current) {
        editorRef.current.innerHTML = sample;
      }

      update("description", sample);
    } catch (error) {
      console.error(
        "AI generation failed:",
        error
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const headerTitle = `${entry.jobTitle || "Job title"
    }, ${entry.employer || "Company name"}`;

  const headerDates = `${entry.startDate || "MM/YYYY"
    } - ${entry.currentlyWorking
      ? "Present"
      : entry.endDate || "MM/YYYY"
    }`;

  return (
    <div className="border mt-4 border-gray-200 rounded-xl p-6 mb-4 bg-white">

      {/* Card header */}
      <div className="flex items-start justify-between">

        <div>
          <p className="text-gray-800 font-medium leading-snug">
            {headerTitle}
          </p>

          {/* date */}

          {/* <p className="text-gray-700 text-sm mt-0.5">
            {headerDates}
          </p> */}
        </div>

        <div className="flex items-center gap-3 text-gray-400">

          <button
            type="button"
            onClick={() =>
              onToggleExpand(entry.id)
            }
            className="hover:text-blue-500 transition-colors"
            aria-label={
              entry.expanded
                ? "Collapse entry"
                : "Expand entry"
            }
          >
            {entry.expanded ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(entry.id)
            }
            className="hover:text-red-500 transition-colors"
            aria-label="Delete experience"
          >
            <Trash2 size={18} />
          </button>

        </div>
      </div>

      {/* Fields */}
      {entry.expanded && (
        <div className="mt-5 space-y-6">

          {/* Job title / Employer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Job title
              </label>

              <input
                type="text"
                value={entry.jobTitle}
                onChange={(e) =>
                  update(
                    "jobTitle",
                    e.target.value
                  )
                }
                onFocus={() =>
                  setFieldFocused(
                    "jobTitle"
                  )
                }
                onBlur={() =>
                  setFieldFocused(null)
                }
                placeholder="Junior Accountant"
                className={inputClasses(
                  "jobTitle"
                )}
              />
            </div>



            {/* employer input field   */}
            <div className="relative">
  <label className="block text-sm text-gray-700 mb-2">
    Employer
  </label>

  <div className="relative">
    <input
      type="text"
      value={entry.employer}
      onChange={(e) =>
        update("employer", e.target.value)
      }
      onFocus={() =>
        setFieldFocused("employer")
      }
      onBlur={() =>
        setFieldFocused(null)
      }
      placeholder="Company name"
      className={`${inputClasses("employer")} pr-16`}
    />

    <button
      type="button"
      onClick={() => {
        setLinkInput(
          entry.employerLink || ""
        );
        setLinkOpen((prev) => !prev);
      }}
      className="
        absolute
        right-2
        top-1/2
        -translate-y-1/2
        rounded-md
        px-2.5
        py-1
        text-xs
        font-medium
        text-blue-600
        hover:bg-blue-50
        hover:text-blue-700
        transition-colors
      "
    >
      Link
    </button>
  </div>

  {/* Link popup */}
  {linkOpen && (
    <div
      className="
        absolute
        right-0
        top-full
        z-50
        mt-2
        w-[280px]
        rounded-lg
        border
        border-gray-200
        bg-white
        p-3
        shadow-lg
      "
    >
      <p className="mb-3 text-s font-semibold text-gray-700">
        Link URL
      </p>

      <div className="flex items-center gap-2">
        <input
          autoFocus
          type="url"
          value={linkInput}
          onChange={(e) =>
            setLinkInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              update(
                "employerLink",
                linkInput.trim()
              );

              setLinkOpen(false);
            }

            if (e.key === "Escape") {
              setLinkOpen(false);
            }
          }}
          placeholder="https://company.com"
          className="
            min-w-0
            flex-1
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            px-3
            py-4
            text-s
            text-gray-700
            outline-none
            transition
            focus:border-blue-400
            focus:bg-white
            focus:ring-2
            focus:ring-blue-50
          "
        />

        <button
          type="button"
          onClick={() => {
            update(
              "employerLink",
              linkInput.trim()
            );

            setLinkOpen(false);
          }}
          className="
            flex
            h-13
            w-13
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-[#05a2ff]
            text-white
        
            transition-colors
            hover:bg-[#0093eb]
            
          "
          aria-label="Apply link"
        >
          <Check size={30} strokeWidth={3.5} />
        </button>
      </div>
    </div>
  )}
</div>  

          </div>

          {/* Location / Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Location
              </label>

              <input
                type="text"
                value={entry.location}
                onChange={(e) =>
                  update(
                    "location",
                    e.target.value
                  )
                }
                onFocus={() =>
                  setFieldFocused(
                    "location"
                  )
                }
                onBlur={() =>
                  setFieldFocused(null)
                }
                placeholder="San Francisco, CA, USA"
                className={inputClasses(
                  "location"
                )}
              />
            </div>

            <div className="flex items-end gap-3">

              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-2">
                  Start date
                </label>

                <input
                  type="text"
                  value={entry.startDate}
                  onChange={(e) =>
                    update(
                      "startDate",
                      e.target.value
                    )
                  }
                  onFocus={() =>
                    setFieldFocused(
                      "startDate"
                    )
                  }
                  onBlur={() =>
                    setFieldFocused(null)
                  }
                  placeholder="MM/YYYY"
                  className={inputClasses(
                    "startDate"
                  )}
                />
              </div>

              <span className="pb-3.5 text-gray-400">
                –
              </span>

              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-2">
                  End date
                </label>

                <input
                  type="text"
                  value={
                    entry.currentlyWorking
                      ? ""
                      : entry.endDate
                  }
                  onChange={(e) =>
                    update(
                      "endDate",
                      e.target.value
                    )
                  }
                  onFocus={() =>
                    setFieldFocused(
                      "endDate"
                    )
                  }
                  onBlur={() =>
                    setFieldFocused(null)
                  }
                  placeholder={
                    entry.currentlyWorking
                      ? "Present"
                      : "MM/YYYY"
                  }
                  disabled={
                    entry.currentlyWorking
                  }
                  className={`${inputClasses(
                    "endDate"
                  )} ${entry.currentlyWorking
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                    }`}
                />
              </div>

            </div>
          </div>

          {/* Currently work here */}
          <label className="flex items-center gap-2 cursor-pointer select-none w-fit">

            <input
              type="checkbox"
              checked={
                entry.currentlyWorking
              }
              onChange={(e) =>
                update(
                  "currentlyWorking",
                  e.target.checked
                )
              }
              className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
            />

            <span className="text-sm text-gray-700">
              Currently work here
            </span>

          </label>

          {/* Description */}
          <div>

            <label className="block text-sm text-gray-700 mb-2">
              Description
            </label>

            <div
              className={`rounded-lg border overflow-hidden transition-all duration-150 ${descriptionFocused
                ? "border-blue-400 ring-4 ring-blue-50"
                : "border-gray-200 hover:border-blue-200"
                }`}
            >

              {/* Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-2 bg-gray-50 border-b border-gray-200 px-3 py-2">

                <div className="flex items-center gap-0.5">

                  <ToolbarButton
                    onClick={() =>
                      applyFormat("bold")
                    }
                    label="Bold"
                  >
                    <Bold size={15} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      applyFormat("italic")
                    }
                    label="Italic"
                  >
                    <Italic size={15} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      applyFormat(
                        "underline"
                      )
                    }
                    label="Underline"
                  >
                    <UnderlineIcon size={15} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      applyFormat(
                        "strikeThrough"
                      )
                    }
                    label="Strikethrough"
                  >
                    <Strikethrough size={15} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={handleLink}
                    label="Insert link"
                  >
                    <Link2 size={15} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      applyFormat(
                        "insertOrderedList"
                      )
                    }
                    label="Numbered list"
                  >
                    <ListOrdered size={15} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      applyFormat(
                        "insertUnorderedList"
                      )
                    }
                    label="Bulleted list"
                  >
                    <List size={15} />
                  </ToolbarButton>

                  <span className="w-px h-5 bg-gray-300 mx-1" />

                  <ToolbarButton
                    onClick={() =>
                      applyFormat("undo")
                    }
                    label="Undo"
                  >
                    <Undo2 size={15} />
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={() =>
                      applyFormat("redo")
                    }
                    label="Redo"
                  >
                    <Redo2 size={15} />
                  </ToolbarButton>

                </div>

                <button
                  type="button"
                  onClick={
                    handleGenerateWithAI
                  }
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-60 text-gray-600 text-sm rounded-md transition-colors"
                >
                  <Sparkles size={14} />

                  {isGenerating
                    ? "Generating…"
                    : "Generate with AI"}
                </button>

              </div>

              {/* Editor */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={
                  handleDescriptionInput
                }
                onFocus={() =>
                  setDescriptionFocused(
                    true
                  )
                }
                onBlur={() =>
                  setDescriptionFocused(
                    false
                  )
                }
                data-placeholder="List your key responsibilities and achievements…"
                className="min-h-[140px] max-h-96 overflow-y-auto p-4 bg-white text-sm text-gray-600 leading-relaxed outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
              />

            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default function ExperienceSection({
  data,
  onChange,
}) {
  const entries = Array.isArray(data)
    ? data
    : [];

  /*
   * Keep everything inside resumedata.
   */
  const updateEntry = (
    id,
    changes
  ) => {
    const updatedEntries = entries.map(
      (entry) =>
        entry.id === id
          ? {
            ...entry,
            ...changes,
          }
          : entry
    );

    onChange(updatedEntries);
  };

  const deleteEntry = (id) => {
    onChange(
      entries.filter(
        (entry) => entry.id !== id
      )
    );
  };

  const toggleExpand = (id) => {
    const updatedEntries = entries.map(
      (entry) =>
        entry.id === id
          ? {
            ...entry,
            expanded:
              !entry.expanded,
          }
          : entry
    );

    onChange(updatedEntries);
  };

  const addEntry = () => {
    onChange([
      ...entries,
      createEmptyEntry(),
    ]);
  };

  return (
    <div className="w-full bg-white">

      {entries.map((entry) => (
        <ExperienceCard
          key={entry.id}
          entry={entry}
          onUpdate={updateEntry}
          onDelete={deleteEntry}
          onToggleExpand={
            toggleExpand
          }
        />
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="flex items-center gap-1.5 text-blue-600 font-medium hover:text-blue-700 transition-colors mt-2"
      >
        <Plus size={18} />
        Add work experience
      </button>

    </div>
  );
}