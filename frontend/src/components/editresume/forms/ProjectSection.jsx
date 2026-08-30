import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Plus,
  Trash2,
  Eye,
  GripVertical,
  Link2,
  Check,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Sparkles,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* -------------------------------------------------
   Empty Project
------------------------------------------------- */

const createEmptyProject = () => ({
  id: crypto.randomUUID(),
  projectTitle: "",
  subTitle: "",
  projectLink: "",
  startDate: "",
  endDate: "",
  description: "",
  expanded: true,
});


/* -------------------------------------------------
   Toolbar Button
------------------------------------------------- */

function ToolbarButton({
  children,
  onClick,
  label,
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={label}
      className="
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-md
        text-gray-700
        transition-all
        hover:bg-blue-50
        hover:text-blue-600
        active:scale-95
      "
    >
      {children}
    </button>
  );
}


/* -------------------------------------------------
   Project Card
------------------------------------------------- */

function ProjectCard({
  entry,
  onUpdate,
  onDelete,
  onToggleExpand,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  const editorRef = useRef(null);

  const [fieldFocused, setFieldFocused] =
    useState(null);

  const [descriptionFocused, setDescriptionFocused] =
    useState(false);

  const [linkOpen, setLinkOpen] =
    useState(false);

  const [linkInput, setLinkInput] =
    useState("");

  const [isDragging, setIsDragging] =
    useState(false);

  const [isGenerating, setIsGenerating] =
    useState(false);

  /*
   * Only put HTML inside the editor when
   * the project changes / editor opens.
   *
   * We DO NOT update innerHTML on every keystroke.
   * This prevents cursor jumping/backspace issues.
   */
  useEffect(() => {
    if (!editorRef.current) return;

    if (
      document.activeElement !==
      editorRef.current
    ) {
      editorRef.current.innerHTML =
        entry.description || "";
    }
  }, [entry.id, entry.expanded]);


  const inputClasses = (field) => `
    w-full
    rounded-lg
    border
    bg-gray-50
    px-3
    py-3
    text-sm
    text-gray-700
    outline-none
    transition-all
    duration-150

    ${
      fieldFocused === field
        ? "border-blue-400 bg-white ring-4 ring-blue-50"
        : "border-gray-200 hover:border-blue-200"
    }
  `;


  const update = (field, value) => {
    onUpdate(entry.id, {
      [field]: value,
    });
  };


  /* -------------------------------------------------
     Rich Text
  ------------------------------------------------- */

  const applyFormat = (command) => {
    editorRef.current?.focus();

    document.execCommand(
      command,
      false,
      null
    );

    handleDescriptionInput();
  };


  const handleDescriptionInput = () => {
    if (!editorRef.current) return;

    update(
      "description",
      editorRef.current.innerHTML
    );
  };


  const handleLink = () => {
    const url = window.prompt(
      "Enter URL"
    );

    if (!url) return;

    editorRef.current?.focus();

    document.execCommand(
      "createLink",
      false,
      url
    );

    handleDescriptionInput();
  };


  const handleGenerateWithAI = async () => {
    /*
     * API can be connected here later.
     */
    setIsGenerating(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      // AI API integration later
    } finally {
      setIsGenerating(false);
    }
  };


  /* -------------------------------------------------
     Header
  ------------------------------------------------- */

  const headerTitle =
    entry.projectTitle?.trim()
      ? entry.projectTitle
      : "Untitled project";


  return (
    <div
      draggable={!entry.expanded}
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart(e, entry.id);
      }}
      onDragEnd={() =>
        setIsDragging(false)
      }
      onDragOver={onDragOver}
      onDrop={(e) => {
        onDrop(e, entry.id);
      }}
      className={`
        border
        border-gray-200
        rounded-xl
        bg-white
        overflow-visible
        transition-all
        duration-200

        ${
          isDragging
            ? "opacity-50 scale-[0.99]"
            : ""
        }
      `}
    >

      {/* -------------------------------------------------
         Compact / Expanded Header
      ------------------------------------------------- */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          px-5
          py-4
        "
      >

        <div className="flex min-w-0 items-center gap-3">

          {/* Drag Handle */}

          {!entry.expanded && (
            <div
              className="
                shrink-0
                cursor-grab
                text-gray-400
                hover:text-gray-500
                active:cursor-grabbing
              "
              title="Drag to reorder"
            >
              <GripVertical
                size={21}
                strokeWidth={2}
              />
            </div>
          )}

          {entry.expanded && (
            <div
              className="
                shrink-0
                text-[#1597ee]
              "
            >
              <Sparkles
                size={19}
              />
            </div>
          )}

          <div className="min-w-0">

            {/* {entry.expanded && (
              <p
                className="
                  text-sm
                  font-medium
                  text-gray-500
                  mb-0.5
                "
              >
                Edit Entry
              </p>
            )} */}

            <p
              className="
                truncate
                text-lg
                font-medium
                text-gray-800
              "
            >
              {headerTitle}
            </p>

          </div>

        </div>


        {/* Header actions */}

        {/* Header actions */}

<div className="flex shrink-0 items-center gap-2">

  {/* Expand / Collapse */}

  <button
    type="button"
    onClick={() =>
      onToggleExpand(entry.id)
    }
    className="
      flex
      h-9
      w-9
      items-center
      justify-center
     
      text-gray-500
      transition-colors
      
      hover:text-blue-600
      
    "
    aria-label={
      entry.expanded
        ? "Collapse project"
        : "Expand project"
    }
  >
    {entry.expanded ? (
      <ChevronUp size={19} />
    ) : (
      <ChevronDown size={19} />
    )}
  </button>


  {/* Preview */}

  <button
    type="button"
    className="
      flex
      h-9
      w-9
      items-center
      justify-center
      
      text-gray-500
      transition-colors
      
      hover:text-blue-600
     
    "
    aria-label="Preview project"
  >
    <Eye size={18} />
  </button>


  {/* Delete */}

  <button
    type="button"
    onClick={() =>
      onDelete(entry.id)
    }
    className="
      flex
      h-9
      w-9
      items-center
      justify-center
      
      text-gray-400
      transition-colors
      
      hover:text-red-500
      
    "
    aria-label="Delete project"
  >
    <Trash2 size={17} />
  </button>

</div>

      </div>


      {/* -------------------------------------------------
         Expanded Editor
      ------------------------------------------------- */}

      {entry.expanded && (
        <div
          className="
            border-t
            border-gray-100
            px-5
            pb-5
            pt-5
            space-y-6
          "
        >

          {/* Project title */}

          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Project title
            </label>

            <div className="relative">

              <input
                type="text"
                value={
                  entry.projectTitle
                }
                onChange={(e) =>
                  update(
                    "projectTitle",
                    e.target.value
                  )
                }
                onFocus={() =>
                  setFieldFocused(
                    "projectTitle"
                  )
                }
                onBlur={() =>
                  setFieldFocused(null)
                }
                placeholder="Project name"
                className={`
                  ${inputClasses(
                    "projectTitle"
                  )}
                  pr-20
                `}
              />

              {/* Link button */}

              <button
                type="button"
                onClick={() => {
                  setLinkInput(
                    entry.projectLink ||
                      ""
                  );

                  setLinkOpen(
                    (prev) => !prev
                  );
                }}
                className="
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  flex
                  items-center
                  gap-1.5
                  rounded-md
                  px-2.5
                  py-1.5
                  text-xs
                  font-medium
                  text-blue-600
                  transition-all
                  hover:bg-blue-50
                  hover:text-blue-700
                "
              >
                <Link2
                  size={14}
                />

                Link
              </button>


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
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-3
                    shadow-xl
                  "
                >

                  <p
                    className="
                      mb-3
                      text-sm
                      font-semibold
                      text-gray-700
                    "
                  >
                    Project URL
                  </p>

                  <div className="flex items-center gap-2">

                    <input
                      autoFocus
                      type="url"
                      value={linkInput}
                      onChange={(e) =>
                        setLinkInput(
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key ===
                          "Enter"
                        ) {
                          e.preventDefault();

                          update(
                            "projectLink",
                            linkInput.trim()
                          );

                          setLinkOpen(
                            false
                          );
                        }

                        if (
                          e.key ===
                          "Escape"
                        ) {
                          setLinkOpen(
                            false
                          );
                        }
                      }}
                      placeholder="https://project.com"
                      className="
                        min-w-0
                        flex-1
                        rounded-lg
                        border
                        border-gray-200
                        bg-gray-50
                        px-3
                        py-2.5
                        text-sm
                        text-gray-700
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-50
                      "
                    />

                    <button
                      type="button"
                      onClick={() => {
                        update(
                          "projectLink",
                          linkInput.trim()
                        );

                        setLinkOpen(
                          false
                        );
                      }}
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#1597ee]
                        text-white
                        transition-all
                        hover:bg-[#0789df]
                        hover:shadow-md
                      "
                    >
                      <Check
                        size={18}
                        strokeWidth={3}
                      />
                    </button>

                  </div>

                </div>
              )}

            </div>
          </div>


          {/* Subtitle */}

          <div>
            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Sub title
            </label>

            <input
              type="text"
              value={
                entry.subTitle
              }
              onChange={(e) =>
                update(
                  "subTitle",
                  e.target.value
                )
              }
              onFocus={() =>
                setFieldFocused(
                  "subTitle"
                )
              }
              onBlur={() =>
                setFieldFocused(null)
              }
              placeholder="Short description or role"
              className={inputClasses(
                "subTitle"
              )}
            />
          </div>


          {/* Dates */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-6
            "
          >

            <div>
              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                Start Date
              </label>

              <input
                type="text"
                value={
                  entry.startDate
                }
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


            <div>
              <label
                className="
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  mb-2
                "
              >
                End Date
              </label>

              <input
                type="text"
                value={
                  entry.endDate
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
                placeholder="MM/YYYY"
                className={inputClasses(
                  "endDate"
                )}
              />
            </div>

          </div>


          {/* Description */}

          <div>

            <label
              className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-2
              "
            >
              Description
            </label>


            <div
              className={`
                overflow-hidden
                rounded-lg
                border
                transition-all
                duration-150

                ${
                  descriptionFocused
                    ? "border-blue-400 ring-4 ring-blue-50"
                    : "border-gray-200 hover:border-blue-200"
                }
              `}
            >

              {/* Toolbar */}

              <div
                className="
                  flex
                  items-center
                  flex-wrap
                  gap-1
                  bg-gray-50
                  border-b
                  border-gray-200
                  px-3
                  py-2
                "
              >

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
                  <UnderlineIcon
                    size={15}
                  />
                </ToolbarButton>

                <span
                  className="
                    mx-1
                    h-5
                    w-px
                    bg-gray-300
                  "
                />

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
                  onClick={handleLink}
                  label="Insert link"
                >
                  <Link2 size={15} />
                </ToolbarButton>

                <span
                  className="
                    mx-1
                    h-5
                    w-px
                    bg-gray-300
                  "
                />

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
                data-placeholder="Describe the project and its outcomes..."
                className="
                  min-h-[140px]
                  max-h-96
                  overflow-y-auto
                  bg-white
                  p-4
                  text-sm
                  leading-relaxed
                  text-gray-600
                  outline-none

                  [&_ul]:list-disc
                  [&_ul]:pl-5
                  [&_ol]:list-decimal
                  [&_ol]:pl-5
                  [&_a]:text-blue-600
                  [&_a]:underline

                  empty:before:content-[attr(data-placeholder)]
                  empty:before:text-gray-400
                "
              />

            </div>


            {/* AI actions */}

            <div
              className="
                mt-2
                flex
                items-center
                gap-1.5
                flex-wrap
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  text-[#1597ee]
                "
                title="AI tools"
              >
                <Sparkles size={20} />
              </div>


              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="
                  rounded-lg
                  bg-blue-50
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-blue-600
                  transition-all

                  hover:bg-blue-100
                  hover:text-blue-700

                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                Improve Writing
              </button>


              <button
                type="button"
                className="
                  rounded-lg
                  bg-blue-50
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-blue-600
                  transition-all
                  hover:bg-blue-100
                  hover:text-blue-700
                "
              >
                Suggest Content
              </button>


              <button
                type="button"
                className="
                  rounded-lg
                  bg-blue-50
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-blue-600
                  transition-all
                  hover:bg-blue-100
                  hover:text-blue-700
                "
              >
                Grammar Check
              </button>


              <button
                type="button"
                className="
                  rounded-lg
                  bg-blue-50
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-blue-600
                  transition-all
                  hover:bg-blue-100
                  hover:text-blue-700
                "
              >
                Shorter
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


/* -------------------------------------------------
   Project Section
------------------------------------------------- */

export default function ProjectSection({
  data,
  onChange,
}) {
  const entries = Array.isArray(data)
    ? data
    : [];

  const [draggedId, setDraggedId] =
    useState(null);


  /* -------------------------------------------------
     Update
  ------------------------------------------------- */

  const updateEntry = (
    id,
    changes
  ) => {
    const updatedEntries =
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              ...changes,
            }
          : entry
      );

    onChange(updatedEntries);
  };


  /* -------------------------------------------------
     Delete
  ------------------------------------------------- */

  const deleteEntry = (id) => {
    onChange(
      entries.filter(
        (entry) => entry.id !== id
      )
    );
  };


  /* -------------------------------------------------
     Expand / Collapse
  ------------------------------------------------- */

  const toggleExpand = (id) => {
    const updatedEntries =
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              expanded:
                !entry.expanded,
            }
          : {
              ...entry,
              expanded: false,
            }
      );

    onChange(updatedEntries);
  };


  /* -------------------------------------------------
     Add Project
  ------------------------------------------------- */

  const addEntry = () => {
    const newProject =
      createEmptyProject();

    /*
     * Collapse existing projects.
     * Open the new project immediately.
     */

    const updatedEntries =
      entries.map((entry) => ({
        ...entry,
        expanded: false,
      }));

    onChange([
      ...updatedEntries,
      newProject,
    ]);
  };


  /* -------------------------------------------------
     Drag & Drop
  ------------------------------------------------- */

  const handleDragStart = (
    e,
    id
  ) => {
    setDraggedId(id);

    e.dataTransfer.effectAllowed =
      "move";

    e.dataTransfer.setData(
      "text/plain",
      id
    );
  };


  const handleDragOver = (e) => {
    e.preventDefault();

    e.dataTransfer.dropEffect =
      "move";
  };


  const handleDrop = (
    e,
    targetId
  ) => {
    e.preventDefault();

    const sourceId =
      e.dataTransfer.getData(
        "text/plain"
      ) || draggedId;

    if (
      !sourceId ||
      sourceId === targetId
    ) {
      setDraggedId(null);
      return;
    }

    const sourceIndex =
      entries.findIndex(
        (entry) =>
          entry.id === sourceId
      );

    const targetIndex =
      entries.findIndex(
        (entry) =>
          entry.id === targetId
      );

    if (
      sourceIndex === -1 ||
      targetIndex === -1
    ) {
      setDraggedId(null);
      return;
    }

    const reordered = [
      ...entries,
    ];

    const [
      movedItem,
    ] = reordered.splice(
      sourceIndex,
      1
    );

    reordered.splice(
      targetIndex,
      0,
      movedItem
    );

    onChange(reordered);

    setDraggedId(null);
  };


  return (
    <div className="w-full bg-white">

      {/* -------------------------------------------------
         Projects
      ------------------------------------------------- */}

      <div className="space-y-2">

        {entries.map((entry) => (
          <ProjectCard
            key={entry.id}
            entry={entry}
            onUpdate={updateEntry}
            onDelete={deleteEntry}
            onToggleExpand={
              toggleExpand
            }
            onDragStart={
              handleDragStart
            }
            onDragOver={
              handleDragOver
            }
            onDrop={handleDrop}
          />
        ))}

      </div>


      {/* -------------------------------------------------
         Add Project
      ------------------------------------------------- */}

      <button
        type="button"
        onClick={addEntry}
        className="
          mt-3
          flex
          items-center
          gap-1.5
          font-medium
          text-blue-600
          transition-all
          hover:text-blue-700
        "
      >
        <Plus size={18} />

        Add project
      </button>

    </div>
  );
}