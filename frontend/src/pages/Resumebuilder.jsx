import React, { useEffect, useState } from "react";
import { FileText, Briefcase, BookOpen, Sparkles, FolderIcon, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { ZoomIn, ZoomOut } from "lucide-react";

import Personalinfo from "@/components/editresume/forms/Personalinfo";
import ExperienceSection from "@/components/editresume/forms/ExperienceSection";
import EducationSection from "@/components/editresume/forms/EducationSection";
import SummarySection from "@/components/editresume/forms/SummarySection";
import ResumePreview from "@/components/editresume/preview";
import SkillSection from "@/components/editresume/forms/SkillSection";
import ProjectSection from "@/components/editresume/forms/ProjectSection";
import Navbar from "@/components/editresume/Navbar";

const Resumebuilder = () => {
  const { resumeId } = useParams();

  const [resumedata, setResumedata] = useState({
    _id: "",
    title: "",
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
  const [isPreviewZoomed, setIsPreviewZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [showZoomCursor, setShowZoomCursor] = useState(false);

  const loadExistingResume = async (id) => {
    // API call here
    const resume = "";

    if (resume) {
      setResumedata(resume);
      document.title = `${resume.title} - myResume`;
    }
  };

  const [activeSectionIndex, setactiveSectionIndex] = useState(0);

  const [removeBackground, setRemoveBackground] = useState(false);

  // Mobile Edit / Preview state
  const [activeView, setActiveView] = useState("edit");

  const sections = [
    {
      id: "personal_info",
      title: "Personal Info",
      icon: User,
    },
    {
      id: "personal_summary",
      title: "Personal Summary",
      icon: FileText,
    },
    {
      id: "experience",
      title: "Experience",
      icon: Briefcase,
    },
    {
      id: "education",
      title: "Education",
      icon: BookOpen,
    },
    {
      id: "skills",
      title: "Skills",
      icon: Sparkles,
    },
    {
      id: "projects",
      title: "Projects",
      icon: FolderIcon,
    },
  ];

  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    if (resumeId) {
      loadExistingResume(resumeId);
    }
  }, [resumeId]);

  const progress =
    (activeSectionIndex * 100) / (sections.length - 1);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f1f5f8]">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
      />


      {/* =====================================================
          MAIN BUILDER AREA
      ====================================================== */}

      <div className="h-[calc(100vh-58px)] w-full">

        <div className="grid h-full grid-cols-1 lg:grid-cols-[51%_49%]">


          {/* =================================================
              LEFT SIDE - FORM / EDITOR
          ================================================== */}

          <div
            className={`
              h-full
              min-h-0
              bg-[#f0faff]
              p-2
              lg:block
              ${activeView === "edit"
                ? "block"
                : "hidden"
              }
            `}
          >

            <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg bg-white shadow-sm resume-editor-content"
            >


              {/* =============================================
                  SECTION NAVIGATION
              ============================================== */}

              <div className="relative hidden flex-shrink-0 border-b border-gray-200 bg-white sm:block">

                {/* Progress background */}
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gray-200" />


                {/* Progress */}
                {/* Smooth Progress */}
                <div
                  className="
    absolute
    bottom-0
    left-0
    h-[2px]
    rounded-r-full
    bg-[#1597ee]
    transition-[width]
    duration-[1200ms]
    ease-[cubic-bezier(0.22,1,0.36,1)]
  "
                  style={{
                    width: `${progress}%`,
                  }}
                />

                <div className="flex h-[62px] items-center px-4 sm:px-6">

                  {sections.map((section, index) => {
                    const isActive =
                      index === activeSectionIndex;

                    const isCompleted =
                      index < activeSectionIndex;

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() =>
                          setactiveSectionIndex(index)
                        }
                        className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-center"
                      >

                        {/* Section title */}

                        <span
                          className={`
                            whitespace-nowrap
                            text-[11px]
                            sm:text-[12px]
                            font-medium
                            transition-colors
                            ${isActive
                              ? "text-[#1597ee]"
                              : isCompleted
                                ? "text-gray-700"
                                : "text-gray-500"
                            }
                          `}
                        >
                          {section.title}
                        </span>


                        {/* Progress circle */}

                        <span
                          className={`
                            absolute
                            bottom-[-5px]
                            z-10
                            flex
                            h-[10px]
                            w-[10px]
                            items-center
                            justify-center
                            rounded-full
                            border-[2px]
                            bg-white
                            transition-all
                            ${isActive
                              ? "border-[#1597ee]"
                              : isCompleted
                                ? "border-[#1597ee]"
                                : "border-gray-300"
                            }
                          `}
                        >

                          {isActive && (
                            <span className="h-[4px] w-[4px] rounded-full bg-[#1597ee]" />
                          )}

                        </span>

                      </button>
                    );
                  })}

                </div>

              </div>


              {/* =============================================
                  FORM HEADING
              ============================================== */}

              <div className="flex-shrink-0 px-5 pb-3 pt-5 sm:px-7">

                <h1 className="font-serif text-[23px] font-semibold leading-tight text-slate-800 sm:text-[25px]">
                  {activeSection.id === "personal_info"
                    ? "Contacts"
                    : activeSection.title}
                </h1>

                <p className="mt-1 max-w-2xl text-[13px] leading-5 text-gray-500 sm:text-[14px]">

                  {activeSection.id === "personal_info"
                    ? "Add your up-to-date contact information so employers and recruiters can easily reach you."
                    : activeSection.id === "experience"
                      ? "List your work experience starting with the most recent position first."
                      : activeSection.id === "education"
                        ? "Add your educational background, starting with the most recent qualification."
                        : activeSection.id === "personal_summary"
                          ? "Write a short professional summary that highlights your strengths and experience."
                          : activeSection.id === "skills"
                            ? "Add the skills that are relevant to the job you are applying for."
                            : "Add your important projects and highlight your key contributions."}

                </p>

              </div>


              {/* =============================================
                  FORM CONTENT
              ============================================== */}

              <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 sm:px-7">

                <div className="pt-1">

                  {/* Personal Info */}

                  {activeSection.id === "personal_info" && (
                    <Personalinfo
                      data={resumedata.personal_info}
                      onChange={(data) =>
                        setResumedata((prev) => ({
                          ...prev,
                          personal_info: data,
                        }))
                      }
                      removeBackground={removeBackground}
                      setRemoveBackground={setRemoveBackground}
                    />
                  )}


                  {/* Experience */}

                  {activeSection.id === "experience" && (
                    <ExperienceSection
                      data={resumedata.experience}
                      title={resumedata.experienceTitle}
                      onChange={(data) =>
                        setResumedata((prev) => ({
                          ...prev,
                          experience: data,
                        }))
                      }
                    />
                  )}


                  {/* Education */}

                  {activeSection.id === "education" && (
                    <EducationSection
                      data={resumedata.education}
                      onChange={(data) =>
                        setResumedata((prev) => ({
                          ...prev,
                          education: data,
                        }))
                      }
                    />
                  )}


                  {/* These sections will be connected
                      when their form components are created */}

                  {activeSection.id === "personal_summary" && (
                    <SummarySection
                      data={resumedata.personal_summary}
                      onChange={(data) =>
                        setResumedata((prev) => ({
                          ...prev,
                          personal_summary: data,
                        }))
                      }
                      isVisible={resumedata.personal_summary_visible}
                      onVisibilityChange={(visible) =>
                        setResumedata((prev) => ({
                          ...prev,
                          personal_summary_visible: visible,
                        }))
                      }
                    />
                  )}

                  


                  {activeSection.id === "skills" && (
                    <SkillSection
                      data={resumedata.skills}
                      onChange={(data) =>
                        setResumedata((prev) => ({
                          ...prev,
                          skills: data,
                        }))
                      }
                    />
                  )}

                  {activeSection.id === "projects" && (
                    <ProjectSection
                      data={resumedata.projects}
                      onChange={(projects) =>
                        setResumedata((prev) => ({
                          ...prev,
                          projects,
                        }))
                      }
                    />
                  )}

                </div>

              </div>


              {/* =============================================
                  BOTTOM NAVIGATION
              ============================================== */}

              <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-7">

                {/* Previous */}

                <button
                  type="button"
                  onClick={() =>
                    setactiveSectionIndex((prevIndex) =>
                      Math.max(prevIndex - 1, 0)
                    )
                  }
                  disabled={activeSectionIndex === 0}
                  className={`
                    flex
                    h-[44px]
                    w-[44px]
                    items-center
                    justify-center
                    rounded-lg
                    border
                    transition-all
                    ${activeSectionIndex === 0
                      ? "cursor-not-allowed border-gray-100 text-gray-300"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>


                {/* Step indicator */}

                <span className="text-[11px] text-gray-400 sm:text-xs">
                  {activeSectionIndex + 1} / {sections.length}
                </span>


                {/* Next */}

                <button
                  type="button"
                  onClick={() =>
                    setactiveSectionIndex((prevIndex) =>
                      Math.min(
                        prevIndex + 1,
                        sections.length - 1
                      )
                    )
                  }
                  disabled={
                    activeSectionIndex ===
                    sections.length - 1
                  }
                  className={`
                    flex
                    h-[44px]
                    items-center
                    justify-center
                    gap-1.5
                    rounded-lg
                    bg-[#1597ee]
                    px-7
                    text-sm
                    font-medium
                    text-white
                    transition-all
                    ${activeSectionIndex ===
                      sections.length - 1
                      ? "cursor-not-allowed opacity-40"
                      : "hover:bg-[#0789df] hover:shadow-md"
                    }
                  `}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDE - RESUME PREVIEW
          ================================================== */}

          <div
            className={`
              relative
              h-full
              min-h-0
              overflow-hidden
              bg-[#f0faff]
              lg:block
              ${activeView === "preview"
                ? "block"
                : "hidden"
              }
            `}
          >

            {/* Preview Area */}

            {/* Preview Area */}

            <div className="flex h-full w-full items-start justify-center overflow-auto px-4 py-5 sm:px-6 sm:py-7 lg:px-5 lg:py-7">

              <div
                className="relative flex-shrink-0 cursor-none"
                style={{
                  width: "500px",
                  height: "707px",
                }}
                onMouseEnter={() => setShowZoomCursor(true)}
                onMouseMove={(e) => {
                  setShowZoomCursor(true);

                  setMousePosition({
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
                onMouseLeave={() => setShowZoomCursor(false)}
                onClick={() => {
                  setIsPreviewZoomed(true);
                  setShowZoomCursor(false);
                }}
              >

                {/* Resume */}
                <div
                  style={{
                    width: "794px",
                    transform: "scale(0.65)",
                    transformOrigin: "top left",
                  }}
                >
                  <ResumePreview data={resumedata} />
                </div>

                {/* Custom Zoom Cursor */}
                {showZoomCursor && !isPreviewZoomed && (
                  <div
                    className="pointer-events-none fixed z-[9999] flex items-center justify-center text-gray-800"
                    style={{
                      left: mousePosition.x,
                      top: mousePosition.y,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <ZoomIn
                      size={15}
                      strokeWidth={1.8}
                    />
                  </div>
                )}

              </div>

            </div>

            {/* Fullscreen Resume Preview */}

            {isPreviewZoomed && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
                onClick={() => setIsPreviewZoomed(false)}
              >

                <div
                  className="relative flex max-h-[95vh] max-w-[95vw] items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >

                  {/* Zoom Out Button */}
                  <button
                    onClick={() => setIsPreviewZoomed(false)}
                    className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg hover:bg-gray-100"
                  >
                    <ZoomOut
                      size={21}
                      strokeWidth={2.3}
                    />
                  </button>

                  {/* Big Resume */}
                  <div
                    className="max-h-[95vh] overflow-auto cursor-zoom-out"
                    onClick={() => setIsPreviewZoomed(false)}
                  >
                    <ResumePreview data={resumedata} />
                  </div>

                </div>

              </div>
            )}




            {/* =============================================
                SAVED INDICATOR
            ============================================== */}

            <div className="absolute bottom-3 left-4 hidden items-center gap-2 text-xs text-gray-500 lg:flex">

              <span className="flex h-3 w-3 items-center justify-center rounded-full bg-gray-300 text-[8px] text-white">
                ✓
              </span>

              Saved

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Resumebuilder;