import React, { useState, useRef } from "react";
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
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Pencil,
} from "lucide-react";

/**
 * ============================================================================
 * ExperienceSection
 * ============================================================================
 * A "work experience" section (resume / profile builder style) with:
 *   - Editable heading + subtitle (pencil icon toggles inline edit)
 *   - "Experience tips" dropdown (top right, amber pill)
 *   - One or more collapsible experience cards, each with:
 *       Job title / Employer / Location / Start & End date /
 *       "Currently work here" checkbox / rich-text Description editor
 *       (bold, italic, underline, strikethrough, link, lists, undo/redo,
 *       plus a "Generate with AI" stub button)
 *   - "+ Add work experience" to append a new blank card
 *
 * DEPENDENCIES (install in your project):
 *   npm install lucide-react
 *   TailwindCSS v3.1+ (uses the `[&_selector]:` arbitrary-variant syntax
 *   for styling the <ul>/<ol> inside the rich-text editor).
 *
 * NOTE ON THE RICH-TEXT EDITOR:
 *   The Description field uses a native `contentEditable` div with
 *   `document.execCommand` for formatting. It's deprecated but still very
 *   broadly supported and is the simplest way to get a working WYSIWYG
 *   toolbar with no extra dependencies. For a production app, swap the
 *   editor internals for a maintained library (e.g. Tiptap / Slate) while
 *   keeping the same toolbar UI.
 *
 * USAGE:
 *   import ExperienceSection from "./ExperienceSection";
 *   <ExperienceSection />
 * ============================================================================
 */

// Tips shown in the "Experience tips" dropdown — edit freely.
const TIPS = [
  'Use strong action verbs like "led", "built", or "improved" to open each bullet.',
  'Quantify results wherever you can (e.g. "cut processing time by 20%").',
  "Focus on achievements and impact, not just day-to-day duties.",
  "Keep each bullet to one or two lines so it's easy to scan.",
];

// Simple unique-id generator for new experience cards.
let idCounter = 1;
const generateId = () => `exp-${idCounter++}-${Date.now()}`;

const createEmptyEntry = (overrides = {}) => ({
  id: generateId(),
  jobTitle: "",
  employer: "",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
  expanded: true, // new cards open expanded so the user can fill them in
  ...overrides,
});

// ---------------------------------------------------------------------------
// Small toolbar icon-button used inside the rich-text editor.
// `onMouseDown` calls preventDefault so clicking a toolbar button does NOT
// steal focus/selection away from the editor before the command runs —
// without this, execCommand would have nothing selected to act on.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// One experience card: header (collapsed summary + collapse/delete),
// and the editable fields when expanded.
// ---------------------------------------------------------------------------
function ExperienceCard({ entry, onUpdate, onDelete, onToggleExpand }) {
  const editorRef = useRef(null);
  const [fieldFocused, setFieldFocused] = useState(null); // which plain input is focused
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const update = (field, value) => onUpdate(entry.id, { [field]: value });

  // Shared input styling: gray default, light-blue hover halo, solid blue
  // border + glow when focused — reused for every plain text field below.
  const inputClasses = (fieldName) => {
    const base =
      "w-full px-4 py-3 rounded-lg text-gray-700 placeholder-gray-400 " +
      "outline-none transition-all duration-150 border text-sm";
    if (fieldFocused === fieldName) {
      return `${base} bg-white border-blue-400 ring-4 ring-blue-50`;
    }
    return `${base} bg-gray-50 border-gray-200 hover:border-blue-200 hover:ring-4 hover:ring-blue-50/70`;
  };

  // Sync the contentEditable's live HTML into React state.
  const handleDescriptionInput = () => {
    if (editorRef.current) update("description", editorRef.current.innerHTML);
  };

  const applyFormat = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleDescriptionInput();
  };

  const handleLink = () => {
    const url = window.prompt("Enter a URL");
    if (url) applyFormat("createLink", url);
  };

  // Placeholder "AI generation" — swap the setTimeout body for a real call
  // to your backend / the Anthropic API, passing entry.jobTitle & employer
  // as context and writing the returned bullets back into the editor.
  const handleGenerateWithAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const sample = `<ul>
        <li>Assisted with day-to-day ${entry.jobTitle || "role"} responsibilities at ${entry.employer || "the company"}</li>
        <li>Collaborated with the team to meet deadlines and improve processes</li>
        <li>Documented key metrics and reported progress to management</li>
      </ul>`;
      if (editorRef.current) {
        editorRef.current.innerHTML = sample;
      }
      update("description", sample);
      setIsGenerating(false);
    }, 900);
  };

  const headerTitle = `${entry.jobTitle || "Job title"}, ${entry.employer || "Company name"}`;
  const headerDates = `${entry.startDate || "MM/YYYY"} - ${
    entry.currentlyWorking ? "Present" : entry.endDate || "MM/YYYY"
  }`;

  return (
    <div className="border border-gray-200 rounded-xl p-6 mb-4 bg-white">
      {/* Card header: title/dates summary + collapse + delete controls */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-blue-600 font-medium leading-snug">{headerTitle}</p>
          <p className="text-blue-400 text-sm mt-0.5">{headerDates}</p>
        </div>
        <div className="flex items-center gap-3 text-gray-400">
          <button
            type="button"
            onClick={() => onToggleExpand(entry.id)}
            className="hover:text-blue-500 transition-colors"
            aria-label={entry.expanded ? "Collapse entry" : "Expand entry"}
          >
            {entry.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry.id)}
            className="hover:text-red-500 transition-colors"
            aria-label="Delete experience"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Fields — only rendered while the card is expanded */}
      {entry.expanded && (
        <div className="mt-5 space-y-6">
          {/* Job title / Employer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Job title</label>
              <input
                type="text"
                value={entry.jobTitle}
                onChange={(e) => update("jobTitle", e.target.value)}
                onFocus={() => setFieldFocused("jobTitle")}
                onBlur={() => setFieldFocused(null)}
                placeholder="Junior Accountant"
                className={inputClasses("jobTitle")}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Employer</label>
              <input
                type="text"
                value={entry.employer}
                onChange={(e) => update("employer", e.target.value)}
                onFocus={() => setFieldFocused("employer")}
                onBlur={() => setFieldFocused(null)}
                placeholder="Company name"
                className={inputClasses("employer")}
              />
            </div>
          </div>

          {/* Location / Start date – End date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={entry.location}
                onChange={(e) => update("location", e.target.value)}
                onFocus={() => setFieldFocused("location")}
                onBlur={() => setFieldFocused(null)}
                placeholder="San Francisco, CA, USA"
                className={inputClasses("location")}
              />
            </div>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-2">Start date</label>
                <input
                  type="text"
                  value={entry.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  onFocus={() => setFieldFocused("startDate")}
                  onBlur={() => setFieldFocused(null)}
                  placeholder="MM/YYYY"
                  className={inputClasses("startDate")}
                />
              </div>
              <span className="pb-3.5 text-gray-400">–</span>
              <div className="flex-1">
                <label className="block text-sm text-gray-700 mb-2">End date</label>
                <input
                  type="text"
                  value={entry.currentlyWorking ? "" : entry.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                  onFocus={() => setFieldFocused("endDate")}
                  onBlur={() => setFieldFocused(null)}
                  placeholder={entry.currentlyWorking ? "Present" : "MM/YYYY"}
                  disabled={entry.currentlyWorking}
                  className={`${inputClasses("endDate")} ${
                    entry.currentlyWorking ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Currently work here — disables & clears the End date field */}
          <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
            <input
              type="checkbox"
              checked={entry.currentlyWorking}
              onChange={(e) => update("currentlyWorking", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
            />
            <span className="text-sm text-gray-700">Currently work here</span>
          </label>

          {/* Description — rich text editor */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Description</label>
            <div
              className={`rounded-lg border overflow-hidden transition-all duration-150 ${
                descriptionFocused
                  ? "border-blue-400 ring-4 ring-blue-50"
                  : "border-gray-200 hover:border-blue-200"
              }`}
            >
              {/* Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-2 bg-gray-50 border-b border-gray-200 px-3 py-2">
                <div className="flex items-center gap-0.5">
                  <ToolbarButton onClick={() => applyFormat("bold")} label="Bold">
                    <Bold size={15} />
                  </ToolbarButton>
                  <ToolbarButton onClick={() => applyFormat("italic")} label="Italic">
                    <Italic size={15} />
                  </ToolbarButton>
                  <ToolbarButton onClick={() => applyFormat("underline")} label="Underline">
                    <UnderlineIcon size={15} />
                  </ToolbarButton>
                  <ToolbarButton onClick={() => applyFormat("strikeThrough")} label="Strikethrough">
                    <Strikethrough size={15} />
                  </ToolbarButton>
                  <ToolbarButton onClick={handleLink} label="Insert link">
                    <Link2 size={15} />
                  </ToolbarButton>
                  <ToolbarButton onClick={() => applyFormat("insertOrderedList")} label="Numbered list">
                    <ListOrdered size={15} />
                  </ToolbarButton>
                  <ToolbarButton onClick={() => applyFormat("insertUnorderedList")} label="Bulleted list">
                    <List size={15} />
                  </ToolbarButton>
                  <span className="w-px h-5 bg-gray-300 mx-1" />
                  <ToolbarButton onClick={() => applyFormat("undo")} label="Undo">
                    <Undo2 size={15} />
                  </ToolbarButton>
                  <ToolbarButton onClick={() => applyFormat("redo")} label="Redo">
                    <Redo2 size={15} />
                  </ToolbarButton>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-60 text-gray-600 text-sm rounded-md transition-colors"
                >
                  <Sparkles size={14} />
                  {isGenerating ? "Generating…" : "Generate with AI"}
                </button>
              </div>

              {/* Editable content area */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleDescriptionInput}
                onFocus={() => setDescriptionFocused(true)}
                onBlur={() => setDescriptionFocused(false)}
                dangerouslySetInnerHTML={{ __html: entry.description }}
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

// ---------------------------------------------------------------------------
// Top-level section: heading, tips dropdown, list of cards, add button.
// ---------------------------------------------------------------------------
export default function ExperienceSection() {
  const [subtitle, setSubtitle] = useState(
    "List your work experience starting with the most recent position first."
  );
  const [editingSubtitle, setEditingSubtitle] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Pre-filled with one example entry, matching the reference design.
  const [entries, setEntries] = useState([
    createEmptyEntry({
      jobTitle: "Junior Accountant",
      location: "San Francisco, CA, USA",
      description: `<ul>
        <li>Helped with monthly financial reports and data entry</li>
        <li>Watched over team budgets and reported issues</li>
        <li>Entered 150+ invoices weekly using accounting software</li>
      </ul>`,
    }),
  ]);

  const updateEntry = (id, changes) => {
    setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...changes } : entry)));
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const toggleExpand = (id) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, expanded: !entry.expanded } : entry))
    );
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, createEmptyEntry()]);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10">
      {/* ---------------- Header row: title + tips dropdown ---------------- */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Experience</h1>
          <button
            type="button"
            onClick={() => setEditingSubtitle(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Edit section description"
          >
            <Pencil size={16} />
          </button>
        </div>

        {/* Experience tips — click to open a dropdown of writing tips */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowTips((open) => !open)}
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-800 text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <Lightbulb size={16} className="text-amber-500" />
            Experience tips
            <ChevronDown size={14} className={`transition-transform ${showTips ? "rotate-180" : ""}`} />
          </button>

          {showTips && (
            <>
              {/* Backdrop closes the dropdown on outside click */}
              <div className="fixed inset-0 z-10" onClick={() => setShowTips(false)} />
              <div className="absolute right-0 z-20 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <ul className="space-y-2 text-sm text-gray-600 list-disc pl-4">
                  {TIPS.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Subtitle — pencil icon toggles this into an editable input */}
      {editingSubtitle ? (
        <input
          autoFocus
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          onBlur={() => setEditingSubtitle(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditingSubtitle(false)}
          className="w-full text-gray-500 mb-8 border-b border-blue-300 outline-none pb-1"
        />
      ) : (
        <p className="text-gray-500 mb-8">{subtitle}</p>
      )}

      {/* ---------------- Experience cards ---------------- */}
      {entries.map((entry) => (
        <ExperienceCard
          key={entry.id}
          entry={entry}
          onUpdate={updateEntry}
          onDelete={deleteEntry}
          onToggleExpand={toggleExpand}
        />
      ))}

      {/* ---------------- Add another entry ---------------- */}
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
