import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

const SummarySection = ({
  data,
  onChange,
  isVisible = true,
  onVisibilityChange,
}) => {
  const editorRef = useRef(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummaries, setGeneratedSummaries] = useState([]);
  const [aiError, setAiError] = useState("");

  /*
   * IMPORTANT:
   * Editor ko har render par innerHTML se overwrite nahi karna hai.
   * Isi wajah se pehle cursor/backspace issue aa raha tha.
   */
  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) return;

    const incomingValue = data || "";

    // Sirf tab DOM update karo jab actual external value different ho.
    if (editor.innerHTML !== incomingValue) {
      editor.innerHTML = incomingValue;
    }
  }, [data]);

  /*
   * Toolbar command
   */
  const executeCommand = (command, value = null) => {
    const editor = editorRef.current;

    if (!editor) return;

    editor.focus();

    document.execCommand(command, false, value);

    // Formatting ke baad latest HTML parent state mein bhejo
    onChange(editor.innerHTML);
  };

  /*
   * Toolbar button par mousedown use kar rahe hain.
   *
   * Isse editor ka text selection lose nahi hota.
   * Especially bullet/numbered list ke liye important.
   */
  const handleToolbarMouseDown = (e, command, value = null) => {
    e.preventDefault();

    executeCommand(command, value);
  };

  /*
   * Editor typing
   */
  const handleEditorInput = (e) => {
    onChange(e.currentTarget.innerHTML);
  };

  /*
   * Link
   */
  const handleLink = (e) => {
    e.preventDefault();

    const url = window.prompt("Enter URL");

    if (!url) return;

    executeCommand("createLink", url);
  };

  /*
   * Future-proof AI function
   *
   * Later yaha directly API call laga sakte ho.
   *
   * Example:
   *
   * const response = await fetch("/api/ai/generate-summary", {
   *   method: "POST",
   *   headers: {
   *     "Content-Type": "application/json",
   *   },
   *   body: JSON.stringify({
   *     resumeData,
   *   }),
   * });
   *
   * const result = await response.json();
   *
   * return result.summaries;
   */

  const generateSummarySuggestions = async () => {
    // TEMPORARY DEMO DATA
    // Later sirf is function ke andar API call karni hai.

    await new Promise((resolve) =>
      setTimeout(resolve, 900)
    );

    return [
      "Results-driven professional with strong problem-solving skills and a passion for building efficient and scalable solutions. Experienced in working with modern technologies and collaborating effectively with teams to deliver high-quality results.",

      "Motivated and detail-oriented professional with hands-on experience in developing practical solutions and solving complex problems. Strong communication, adaptability, and teamwork skills with a continuous focus on learning and professional growth.",

      "Dedicated professional with a strong technical foundation and experience in developing reliable solutions. Skilled at analyzing requirements, working with cross-functional teams, and delivering projects efficiently while maintaining quality and performance.",
    ];
  };

  /*
   * Generate with AI
   */
  const generateWithAI = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      setAiError("");

      const suggestions =
        await generateSummarySuggestions();

      setGeneratedSummaries(suggestions || []);
    } catch (error) {
      console.error("AI summary generation failed:", error);

      setAiError(
        "Unable to generate summaries. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  /*
   * User selects AI generated summary
   */
  const selectSummary = (summary) => {
    const editor = editorRef.current;

    if (!editor) return;

    editor.innerHTML = summary;

    onChange(summary);
  };

  /*
   * Hide / show summary
   */
  const toggleVisibility = () => {
    if (onVisibilityChange) {
      onVisibilityChange(!isVisible);
    }
  };

  return (
    <div className="w-full mt-4">

      {/* ================= EDITOR ================= */}

      <div
        className={`
          overflow-hidden
          rounded-xl
          border
          bg-white
          shadow-sm
          transition-all
          duration-200

          ${isVisible
            ? "border-blue-200"
            : "border-gray-200"
          }

          focus-within:border-[#1597ee]
          focus-within:ring-4
          focus-within:ring-blue-50
        `}
      >

        {/* ================= TOOLBAR ================= */}

        <div className="flex items-center justify-between border-b border-gray-200 bg-white">

          <div className="flex items-center">

            {/* Bold */}
            <button
              type="button"
              onMouseDown={(e) =>
                handleToolbarMouseDown(e, "bold")
              }
              className="
                flex
                h-12
                w-10
                items-center
                justify-center
                rounded-md
                text-gray-600
                transition-all
                duration-150
                hover:bg-blue-50
                hover:text-[#1597ee]
                active:bg-blue-100
              "
              title="Bold"
            >
              <Bold size={17} />
            </button>


            {/* Italic */}
            <button
              type="button"
              onMouseDown={(e) =>
                handleToolbarMouseDown(e, "italic")
              }
              className="
                flex
                h-12
                w-10
                items-center
                justify-center
                rounded-md
                text-gray-600
                transition-all
                duration-150
                hover:bg-blue-50
                hover:text-[#1597ee]
                active:bg-blue-100
              "
              title="Italic"
            >
              <Italic size={17} />
            </button>


            {/* Underline */}
            <button
              type="button"
              onMouseDown={(e) =>
                handleToolbarMouseDown(e, "underline")
              }
              className="
                flex
                h-12
                w-10
                items-center
                justify-center
                rounded-md
                text-gray-600
                transition-all
                duration-150
                hover:bg-blue-50
                hover:text-[#1597ee]
                active:bg-blue-100
              "
              title="Underline"
            >
              <Underline size={17} />
            </button>


            {/* Strike */}
            <button
              type="button"
              onMouseDown={(e) =>
                handleToolbarMouseDown(
                  e,
                  "strikeThrough"
                )
              }
              className="
                flex
                h-12
                w-10
                items-center
                justify-center
                rounded-md
                text-gray-600
                transition-all
                duration-150
                hover:bg-blue-50
                hover:text-[#1597ee]
                active:bg-blue-100
              "
              title="Strikethrough"
            >
              <Strikethrough size={17} />
            </button>


            <div className="mx-1 h-7 w-px bg-gray-200" />


            {/* Link */}
            <button
              type="button"
              onMouseDown={handleLink}
              className="
                flex
                h-12
                w-10
                items-center
                justify-center
                rounded-md
                text-gray-600
                transition-all
                duration-150
                hover:bg-blue-50
                hover:text-[#1597ee]
                active:bg-blue-100
              "
              title="Add link"
            >
              <LinkIcon size={17} />
            </button>


            <div className="mx-1 h-7 w-px bg-gray-200" />


            {/* Numbered List */}
            <button
              type="button"
              onMouseDown={(e) =>
                handleToolbarMouseDown(
                  e,
                  "insertOrderedList"
                )
              }
              className="
                flex
                h-12
                w-10
                items-center
                justify-center
                rounded-md
                text-gray-600
                transition-all
                duration-150
                hover:bg-blue-50
                hover:text-[#1597ee]
                active:bg-blue-100
              "
              title="Numbered list"
            >
              <ListOrdered size={17} />
            </button>


            {/* Bullet List */}
            <button
              type="button"
              onMouseDown={(e) =>
                handleToolbarMouseDown(
                  e,
                  "insertUnorderedList"
                )
              }
              className="
                flex
                h-12
                w-10
                items-center
                justify-center
                rounded-md
                text-gray-600
                transition-all
                duration-150
                hover:bg-blue-50
                hover:text-[#1597ee]
                active:bg-blue-100
              "
              title="Bullet list"
            >
              <List size={17} />
            </button>


            <div className="mx-1 h-7 w-px bg-gray-200" />


            {/* Undo */}
            <button
              type="button"
              onMouseDown={(e) =>
                handleToolbarMouseDown(e, "undo")
              }
              className="
                flex
                h-12
                w-10
                items-center
                justify-center
                rounded-md
                text-gray-400
                transition-all
                duration-150
                hover:bg-blue-50
                hover:text-gray-700
                active:bg-blue-100
              "
              title="Undo"
            >
              <Undo2 size={17} />
            </button>


            {/* Redo */}
            <button
              type="button"
              onMouseDown={(e) =>
                handleToolbarMouseDown(e, "redo")
              }
              className="
                flex
                h-12
                w-10
                items-center
                justify-center
                rounded-md
                text-gray-400
                transition-all
                duration-150
                hover:bg-blue-50
                hover:text-gray-700
                active:bg-blue-100
              "
              title="Redo"
            >
              <Redo2 size={17} />
            </button>

          </div>


          {/* ================= RIGHT SIDE ================= */}

          <div className="flex items-center gap-2 pr-3">

            {/* Eye */}
            <button
              type="button"
              onClick={toggleVisibility}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                text-gray-500
                transition-all
                duration-200
                hover:bg-blue-50
                hover:text-[#1597ee]
                active:scale-95
              "
              title={
                isVisible
                  ? "Hide summary"
                  : "Show summary"
              }
            >
              {isVisible ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>


            {/* AI Button */}
            <button
              type="button"
              onClick={generateWithAI}
              disabled={isGenerating}
              className="
                group
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-blue-100
                bg-gradient-to-r
                from-blue-50
                to-cyan-50
                px-4
                py-2.5
                text-sm
                font-medium
                text-[#1597ee]
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-[1px]
                hover:border-blue-200
                hover:bg-blue-50
                hover:shadow-md
                active:translate-y-0
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >

              {isGenerating ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Sparkles
                  size={17}
                  className="
                    transition-transform
                    duration-300
                    group-hover:rotate-12
                  "
                />
              )}

              {isGenerating
                ? "Generating..."
                : "Generate with AI"}

            </button>

          </div>

        </div>


        {/* ================= WRITING AREA ================= */}

        <div
          ref={editorRef}
          contentEditable={isVisible}
          suppressContentEditableWarning
          onInput={handleEditorInput}
          className={`
            min-h-[145px]
            w-full
            bg-[#f8fafc]
            px-5
            py-5
            text-[16px]
            leading-7
            text-gray-700
            outline-none
            transition-all
            duration-200

            [&_ul]:ml-5
            [&_ul]:list-disc

            [&_ol]:ml-5
            [&_ol]:list-decimal

            [&_a]:text-[#1597ee]
            [&_a]:underline

            ${!data
              ? "text-gray-400"
              : ""
            }
          `}
        />

      </div>


      {/* ================= AI RESULTS ================= */}

      {(generatedSummaries.length > 0 ||
        aiError) && (
          <div className="mt-5">

            <div className="mb-3 flex items-center gap-2">

              <Sparkles
                size={17}
                className="text-[#1597ee]"
              />

              <h3 className="text-sm font-semibold text-gray-800">
                AI Generated Summaries
              </h3>

            </div>


            {aiError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {aiError}
              </div>
            )}


            <div className="space-y-3">

              {generatedSummaries.map(
                (summary, index) => {

                  const isSelected =
                    data === summary;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        selectSummary(summary)
                      }
                      className={`
                      group
                      w-full
                      rounded-xl
                      border
                      p-4
                      text-left
                      transition-all
                      duration-200

                      ${isSelected
                          ? "border-[#1597ee] bg-blue-50 shadow-sm ring-2 ring-blue-100"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm"
                        }
                    `}
                    >

                      <div className="flex items-start gap-3">

                        {/* Selection indicator */}
                        <div
                          className={`
                          mt-0.5
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          transition-all
                          duration-200

                          ${isSelected
                              ? "border-[#1597ee] bg-[#1597ee] text-white"
                              : "border-gray-300 text-transparent group-hover:border-[#1597ee]"
                            }
                        `}
                        >
                          <Check size={12} />
                        </div>


                        {/* Summary */}
                        <p className="text-sm leading-6 text-gray-600">
                          {summary}
                        </p>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

          </div>
        )}

    </div>
  );
};

export default SummarySection;