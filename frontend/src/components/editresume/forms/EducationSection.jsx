import React, {
  useState,
  useRef,
  useEffect,
} from "react";

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
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  GripVertical,
} from "lucide-react";

let idCounter = 1;

const generateId = () =>
  `edu-${idCounter++}-${Date.now()}`;

const createEmptyEntry = () => ({
  id: generateId(),
  schoolName: "",
  location: "",
  degree: "",
  startDate: "",
  endDate: "",
  stillEnrolled: false,
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


function EducationCard({
  entry,
  onUpdate,
  onDelete,
  onToggleExpand,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
}) {
  const editorRef = useRef(null);

  const [fieldFocused, setFieldFocused] =
    useState(null);

  const [descriptionFocused, setDescriptionFocused] =
    useState(false);

  const [isGenerating, setIsGenerating] =
    useState(false);


  const update = (field, value) => {
    onUpdate(entry.id, {
      [field]: value,
    });
  };


  const inputClasses = (fieldName) => {
    const base =
      "w-full px-4 py-3 rounded-lg text-gray-700 placeholder-gray-400 " +
      "outline-none transition-all duration-150 border text-sm";

    if (fieldFocused === fieldName) {
      return `${base} bg-white border-blue-400 ring-8 ring-blue-50`;
    }

    return `${base} bg-gray-50 border-gray-200 hover:border-blue-200 hover:ring-8 hover:ring-blue-50/70`;
  };


  // Keep the editor uncontrolled.
  // This prevents React from resetting the cursor after every keystroke.
  useEffect(() => {
    if (!editorRef.current) return;

    if (
      document.activeElement !== editorRef.current &&
      editorRef.current.innerHTML !== entry.description
    ) {
      editorRef.current.innerHTML =
        entry.description || "";
    }
  }, [entry.id]);


  const handleDescriptionInput = () => {
    if (!editorRef.current) return;

    update(
      "description",
      editorRef.current.innerHTML
    );
  };


  const applyFormat = (command, value = null) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    document.execCommand(
      command,
      false,
      value
    );

    handleDescriptionInput();
  };


  const handleLink = () => {
    const url = window.prompt(
      "Enter a URL"
    );

    if (url) {
      applyFormat(
        "createLink",
        url
      );
    }
  };


  const handleGenerateWithAI = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const sample = `
        <ul>
          <li>Completed coursework in ${
            entry.degree || "the chosen field"
          }</li>
          <li>Participated in relevant projects and activities</li>
          <li>Maintained a strong academic record</li>
        </ul>
      `;

      if (editorRef.current) {
        editorRef.current.innerHTML =
          sample.trim();
      }

      update(
        "description",
        sample.trim()
      );

      setIsGenerating(false);
    }, 900);
  };


  const schoolPlaceholder = "UCLA";
  const degreePlaceholder =
    "BA in Finance and Banking";
  const datePlaceholder = "MM/YYYY";

  const hasRealData = Boolean(
    entry.schoolName ||
    entry.degree
  );

  const headerTitle = `${
    entry.schoolName ||
    schoolPlaceholder
  }, ${
    entry.degree ||
    degreePlaceholder
  }`;

  const headerDates = `${
    entry.startDate ||
    datePlaceholder
  } - ${
    entry.stillEnrolled
      ? "Present"
      : entry.endDate ||
        datePlaceholder
  }`;

  const headerTitleColor =
    hasRealData
      ? "text-gray-800"
      : "text-blue-200";

  const headerDateColor =
    hasRealData
      ? "text-gray-500"
      : "text-blue-200";


  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`border border-gray-200 rounded-xl p-6 mb-4 bg-white transition-opacity duration-150 ${
        isDragging
          ? "opacity-40"
          : "opacity-100"
      }`}
    >

      {/* Card header */}
      <div className="flex items-start justify-between">

        <div className="flex items-start gap-2">

          <button
            type="button"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="mt-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder"
            title="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>

          <div>
            <p
              className={`font-medium leading-snug ${headerTitleColor}`}
            >
              {headerTitle}
            </p>

            <p
              className={`text-sm mt-0.5 ${headerDateColor}`}
            >
              {headerDates}
            </p>
          </div>

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
            aria-label="Delete education"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>


      {/* Fields */}
      {entry.expanded && (
        <div className="mt-5 space-y-6">

          {/* School / Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                School name
              </label>

              <input
                type="text"
                value={entry.schoolName}
                onChange={(e) =>
                  update(
                    "schoolName",
                    e.target.value
                  )
                }
                onFocus={() =>
                  setFieldFocused(
                    "schoolName"
                  )
                }
                onBlur={() =>
                  setFieldFocused(null)
                }
                placeholder="UCLA"
                className={inputClasses(
                  "schoolName"
                )}
              />
            </div>


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
                placeholder="New York"
                className={inputClasses(
                  "location"
                )}
              />
            </div>

          </div>


          {/* Degree / Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Degree
              </label>

              <input
                type="text"
                value={entry.degree}
                onChange={(e) =>
                  update(
                    "degree",
                    e.target.value
                  )
                }
                onFocus={() =>
                  setFieldFocused("degree")
                }
                onBlur={() =>
                  setFieldFocused(null)
                }
                placeholder="BA in Finance and Banking"
                className={inputClasses(
                  "degree"
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
                    entry.stillEnrolled
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
                    entry.stillEnrolled
                      ? "Present"
                      : "MM/YYYY"
                  }
                  disabled={
                    entry.stillEnrolled
                  }
                  className={`${inputClasses(
                    "endDate"
                  )} ${
                    entry.stillEnrolled
                      ? "opacity-60 cursor-not-allowed"
                      : ""
                  }`}
                />

              </div>

            </div>

          </div>


          {/* Still enrolled */}
          <label className="flex items-center gap-2 cursor-pointer select-none w-fit">

            <input
              type="checkbox"
              checked={
                entry.stillEnrolled
              }
              onChange={(e) =>
                update(
                  "stillEnrolled",
                  e.target.checked
                )
              }
              className="w-4 h-4 rounded border-2 border-blue-200 text-blue-600 accent-blue-600 cursor-pointer"
            />

            <span className="text-sm text-gray-700">
              I'm still enrolled
            </span>

          </label>


          {/* Description */}
          <div>

            <label className="block text-sm text-gray-700 mb-2">
              Description
            </label>


            <div
              className={`rounded-lg border overflow-hidden transition-all duration-150 ${
                descriptionFocused
                  ? "border-blue-400 ring-4 ring-blue-50"
                  : "border-gray-200 hover:border-blue-200 hover:ring-8 hover:ring-blue-50/70"
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
                      applyFormat("underline")
                    }
                    label="Underline"
                  >
                    <UnderlineIcon
                      size={15}
                    />
                  </ToolbarButton>


                  <ToolbarButton
                    onClick={() =>
                      applyFormat(
                        "strikeThrough"
                      )
                    }
                    label="Strikethrough"
                  >
                    <Strikethrough
                      size={15}
                    />
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
                    <ListOrdered
                      size={15}
                    />
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


              {/* Content editor */}
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
                data-placeholder="e.g., Graduated with honors, Dean's List (2022)"
                className="
                  min-h-[110px]
                  max-h-96
                  overflow-y-auto
                  p-4
                  bg-white
                  text-sm
                  text-gray-600
                  leading-relaxed
                  outline-none
                  [&_ul]:list-disc
                  [&_ul]:pl-5
                  [&_ol]:list-decimal
                  [&_ol]:pl-5
                  empty:before:content-[attr(data-placeholder)]
                  empty:before:text-gray-400
                "
              />

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


export default function EducationSection({
  data = [],
  onChange,
}) {

  const [educationData, setEducationData] =
    useState(() =>
      data?.length
        ? data
        : [createEmptyEntry()]
    );

  const [draggingId, setDraggingId] =
    useState(null);


  useEffect(() => {
    onChange?.(educationData);
  }, [educationData]);


  const updateEntry = (
    id,
    changes
  ) => {
    setEducationData((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              ...changes,
            }
          : entry
      )
    );
  };


  const deleteEntry = (id) => {
    setEducationData((prev) =>
      prev.filter(
        (entry) =>
          entry.id !== id
      )
    );
  };


  const toggleExpand = (id) => {
    setEducationData((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              expanded:
                !entry.expanded,
            }
          : entry
      )
    );
  };


  const addEntry = () => {
    setEducationData((prev) => [
      ...prev,
      createEmptyEntry(),
    ]);
  };


  const handleDragStart =
    (id) => (e) => {
      setDraggingId(id);

      e.dataTransfer.effectAllowed =
        "move";

      e.dataTransfer.setData(
        "text/plain",
        id
      );
    };


  const handleDragOver = (e) => {
    e.preventDefault();
  };


  const handleDrop =
    (targetId) => (e) => {
      e.preventDefault();

      setEducationData((prev) => {

        if (
          !draggingId ||
          draggingId === targetId
        ) {
          return prev;
        }

        const list = [...prev];

        const fromIndex =
          list.findIndex(
            (item) =>
              item.id ===
              draggingId
          );

        const toIndex =
          list.findIndex(
            (item) =>
              item.id ===
              targetId
          );

        if (
          fromIndex === -1 ||
          toIndex === -1
        ) {
          return prev;
        }

        const [moved] =
          list.splice(
            fromIndex,
            1
          );

        list.splice(
          toIndex,
          0,
          moved
        );

        return list;
      });

      setDraggingId(null);
    };


  return (
    <div className="max-w-3xl mx-auto bg-white">

      {educationData.map(
        (entry) => (
          <EducationCard
            key={entry.id}
            entry={entry}
            onUpdate={updateEntry}
            onDelete={deleteEntry}
            onToggleExpand={
              toggleExpand
            }
            onDragStart={handleDragStart(
              entry.id
            )}
            onDragOver={
              handleDragOver
            }
            onDrop={handleDrop(
              entry.id
            )}
            onDragEnd={() =>
              setDraggingId(null)
            }
            isDragging={
              draggingId ===
              entry.id
            }
          />
        )
      )}


      <button
        type="button"
        onClick={addEntry}
        className="flex items-center gap-1.5 text-blue-600 font-medium hover:text-blue-700 transition-colors mt-2"
      >
        <Plus size={18} />
        Add education
      </button>

    </div>
  );
}