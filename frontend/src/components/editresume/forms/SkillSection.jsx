import React, { useEffect, useRef, useState } from "react";

import {
  Plus,
  Trash2,
  Eye,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Link2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Undo2,
  Redo2,
} from "lucide-react";


/* =====================================================
   EMPTY SKILL
===================================================== */

const createEmptySkill = () => ({
  id: crypto.randomUUID(),
  skill: "",
  information: "",
  expanded: true,
});


/* =====================================================
   TOOLBAR BUTTON
===================================================== */

function ToolbarButton({
  children,
  onClick,
  label, 
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) =>
        e.preventDefault()
      }
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
        transition-colors
        hover:bg-blue-50
        hover:text-blue-600
        active:scale-95
      "
    >
      {children}
    </button>
  );
}


/* =====================================================
   SKILL CARD
===================================================== */

function SkillCard({
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

  const [isDragging, setIsDragging] =
    useState(false);


  /* ---------------------------------------------------
     Set editor content only when opening/changing
     DO NOT set innerHTML on every render
  --------------------------------------------------- */

  useEffect(() => {
    if (!editorRef.current) return;

    if (
      document.activeElement !==
      editorRef.current
    ) {
      editorRef.current.innerHTML =
        entry.information || "";
    }
  }, [
    entry.id,
    entry.expanded,
  ]);


  /* ---------------------------------------------------
     Input classes
  --------------------------------------------------- */

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


  /* ---------------------------------------------------
     Update
  --------------------------------------------------- */

  const update = (
    field,
    value
  ) => {
    onUpdate(entry.id, {
      [field]: value,
    });
  };


  /* ---------------------------------------------------
     Rich Text Formatting
  --------------------------------------------------- */

  const applyFormat = (
    command
  ) => {
    editorRef.current?.focus();

    document.execCommand(
      command,
      false,
      null
    );

    handleInformationInput();
  };


  const handleInformationInput = () => {
    if (!editorRef.current) return;

    update(
      "information",
      editorRef.current.innerHTML
    );
  };


  /* ---------------------------------------------------
     Insert Link
  --------------------------------------------------- */

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

    handleInformationInput();
  };


  /* ---------------------------------------------------
     Header Title
  --------------------------------------------------- */

  const headerTitle =
    entry.skill?.trim()
      ? entry.skill
      : "New Entry";


  return (
    <div
      draggable={!entry.expanded}
      onDragStart={(e) => {
        setIsDragging(true);

        onDragStart(
          e,
          entry.id
        );
      }}
      onDragEnd={() =>
        setIsDragging(false)
      }
      onDragOver={onDragOver}
      onDrop={(e) =>
        onDrop(
          e,
          entry.id
        )
      }
      className={`
        border
        rounded-xl
        bg-white
        overflow-visible
        transition-all
        duration-200

        ${
          entry.expanded
            ? "border-gray-200"
            : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm"
        }

        ${
          isDragging
            ? "opacity-50 scale-[0.99]"
            : ""
        }
      `}
    >

      {/* =================================================
          HEADER
      ================================================= */}

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

        {/* Left side */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >

          {/* Drag handle */}

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


          {/* Title */}

          <div className="min-w-0">

            {entry.expanded && (
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
            )}

            <p
              className="
                truncate
                text-[15px]
                font-semibold
                text-gray-800
              "
            >
              {headerTitle}
            </p>

          </div>

        </div>


        {/* =================================================
            HEADER ACTIONS
        ================================================= */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >

          {/* Expand / Collapse */}

          <button
            type="button"
            onClick={() =>
              onToggleExpand(
                entry.id
              )
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              text-gray-400
              transition-colors
              hover:text-blue-500
            "
            aria-label={
              entry.expanded
                ? "Collapse skill"
                : "Expand skill"
            }
          >
            {entry.expanded ? (
              <ChevronUp
                size={19}
              />
            ) : (
              <ChevronDown
                size={19}
              />
            )}
          </button>


          {/* Eye */}

          <button
            type="button"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              text-gray-400
              transition-colors
              hover:text-blue-500
            "
            aria-label="Preview skill"
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
            aria-label="Delete skill"
          >
            <Trash2 size={17} />
          </button>

        </div>

      </div>


      {/* =================================================
          EXPANDED CONTENT
      ================================================= */}

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

          {/* -------------------------------------------------
             Skill
          ------------------------------------------------- */}

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
              Skill
            </label>

            <input
              type="text"
              value={
                entry.skill
              }
              onChange={(e) =>
                update(
                  "skill",
                  e.target.value
                )
              }
              onFocus={() =>
                setFieldFocused(
                  "skill"
                )
              }
              onBlur={() =>
                setFieldFocused(
                  null
                )
              }
              placeholder="Enter skill"
              className={inputClasses(
                "skill"
              )}
            />

          </div>


          {/* -------------------------------------------------
             Information / Sub-skills
          ------------------------------------------------- */}

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
              Information / Sub-skills
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

              {/* =================================================
                  TOOLBAR
              ================================================= */}

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

                {/* Bold */}

                <ToolbarButton
                  onClick={() =>
                    applyFormat(
                      "bold"
                    )
                  }
                  label="Bold"
                >
                  <Bold size={15} />
                </ToolbarButton>


                {/* Italic */}

                <ToolbarButton
                  onClick={() =>
                    applyFormat(
                      "italic"
                    )
                  }
                  label="Italic"
                >
                  <Italic size={15} />
                </ToolbarButton>


                {/* Underline */}

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


                {/* Bullet List */}

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


                {/* Number List */}

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


                {/* Link */}

                <ToolbarButton
                  onClick={
                    handleLink
                  }
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


                {/* Undo */}

                <ToolbarButton
                  onClick={() =>
                    applyFormat(
                      "undo"
                    )
                  }
                  label="Undo"
                >
                  <Undo2 size={15} />
                </ToolbarButton>


                {/* Redo */}

                <ToolbarButton
                  onClick={() =>
                    applyFormat(
                      "redo"
                    )
                  }
                  label="Redo"
                >
                  <Redo2 size={15} />
                </ToolbarButton>

              </div>


              {/* =================================================
                  EDITOR
              ================================================= */}

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={
                  handleInformationInput
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
                data-placeholder=""
                className="
                  min-h-[120px]
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

          </div>

        </div>
      )}

    </div>
  );
}


/* =====================================================
   SKILL SECTION
===================================================== */

export default function SkillSection({
  data,
  onChange,
}) {
  const entries = Array.isArray(data)
    ? data
    : [];

  const [draggedId, setDraggedId] =
    useState(null);


  /* ===================================================
     UPDATE
  =================================================== */

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

    onChange(
      updatedEntries
    );
  };


  /* ===================================================
     DELETE
  =================================================== */

  const deleteEntry = (
    id
  ) => {
    onChange(
      entries.filter(
        (entry) =>
          entry.id !== id
      )
    );
  };


  /* ===================================================
     EXPAND / COLLAPSE
  =================================================== */

  const toggleExpand = (
    id
  ) => {
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

    onChange(
      updatedEntries
    );
  };


  /* ===================================================
     ADD SKILL
  =================================================== */

  const addEntry = () => {
    const newSkill =
      createEmptySkill();

    const collapsedEntries =
      entries.map((entry) => ({
        ...entry,
        expanded: false,
      }));

    onChange([
      ...collapsedEntries,
      newSkill,
    ]);
  };


  /* ===================================================
     DRAG START
  =================================================== */

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


  /* ===================================================
     DRAG OVER
  =================================================== */

  const handleDragOver = (
    e
  ) => {
    e.preventDefault();

    e.dataTransfer.dropEffect =
      "move";
  };


  /* ===================================================
     DROP
  =================================================== */

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

    onChange(
      reordered
    );

    setDraggedId(null);
  };


  /* ===================================================
     RETURN
  =================================================== */

  return (
    <div className="w-full bg-white">

      {/* Skill Entries */}

      <div className="space-y-2">

        {entries.map(
          (entry) => (
            <SkillCard
              key={entry.id}
              entry={entry}
              onUpdate={
                updateEntry
              }
              onDelete={
                deleteEntry
              }
              onToggleExpand={
                toggleExpand
              }
              onDragStart={
                handleDragStart
              }
              onDragOver={
                handleDragOver
              }
              onDrop={
                handleDrop
              }
            />
          )
        )}

      </div>


      {/* Add Skill */}

      <button
        type="button"
        onClick={
          addEntry
        }
        className="
          mt-3
          flex
          items-center
          gap-1.5
          font-medium
          text-blue-600
          transition-colors
          hover:text-blue-700
        "
      >
        <Plus size={18} />

        Add skill
      </button>

    </div>
  );
}