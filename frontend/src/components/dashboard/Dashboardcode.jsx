import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  FileText,
  Pencil,
  Download,
  Trash2,
} from "lucide-react";

import Sidebar from "../dashboard/Sidebar";
import NewResumeCard from "../dashboard/Addresume";

import {
  getResumes,
  updateResume,
  deleteResume as deleteResumeFromBackend,
} from "../../api/resumeApi";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function timeAgo(date) {
  if (!date) return "edited just now";

  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) {
    return "edited just now";
  }

  const diffMs = Math.max(
    0,
    Date.now() - timestamp
  );

  const days = Math.floor(
    diffMs / (1000 * 60 * 60 * 24)
  );

  if (days === 0) {
    return "edited today";
  }

  if (days === 1) {
    return "edited 1 day ago";
  }

  if (days < 30) {
    return `edited ${days} days ago`;
  }

  const months = Math.floor(days / 30);

  return months === 1
    ? "edited 1 month ago"
    : `edited ${months} months ago`;
}

/*
|--------------------------------------------------------------------------
| Convert Backend Resume → Dashboard Resume
|--------------------------------------------------------------------------
*/

function normalizeResume(resume = {}) {
  const personalInfo =
    resume.personal_info || {};

  const experience = Array.isArray(
    resume.experience
  )
    ? resume.experience.map((exp = {}) => ({
        role: exp.jobTitle || "",

        company: exp.employer || "",

        bullets: String(
          exp.description || ""
        )
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        dates: exp.currentlyWorking
          ? `${exp.startDate || ""} - Present`
          : `${exp.startDate || ""}${
              exp.endDate
                ? ` - ${exp.endDate}`
                : ""
            }`,
      }))
    : [];

  const skills = Array.isArray(
    resume.skills
  )
    ? resume.skills
        .map((skill) =>
          typeof skill === "string"
            ? skill
            : skill?.skill
        )
        .filter(Boolean)
        .join(", ")
    : "";

  /*
  |--------------------------------------------------------------------------
  | Resume ID
  |--------------------------------------------------------------------------
  |
  | Backend primary identifier:
  | resumeId
  |
  | Fallbacks are kept for safety.
  |
  */

  const id =
    resume.resumeId ||
    resume._id ||
    resume.id;

  return {
    ...resume,

    /*
    |--------------------------------------------------------------------------
    | Existing Dashboard Names
    |--------------------------------------------------------------------------
    */

    id,

    resumeId:
      resume.resumeId || id,

    name:
      resume.title ||
      "Untitled Resume",

    fullName:
      personalInfo.fullName || "",

    contact: [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
    ]
      .filter(Boolean)
      .join(" • "),

    summary:
      resume.personal_summary || "",

    skills,

    experience,

    editedAt:
      resume.updatedAt ||
      resume.createdAt,

    size: "Resume",
  };
}

/*
|--------------------------------------------------------------------------
| Mini Preview
|--------------------------------------------------------------------------
*/

function MiniPreview({ resume }) {
  return (
    <div className="h-full w-full overflow-hidden bg-white p-4 text-[6px] leading-[8px] text-gray-700 select-none">
      <div className="text-center">
        <p className="text-[8px] font-bold text-gray-900">
          {resume.fullName ||
            "Your Name"}
        </p>

        <p className="text-[6.5px] text-gray-500">
          {resume.name || "Resume"}
        </p>

        <p className="mt-0.5 text-gray-400">
          {resume.contact ||
            "Contact information"}
        </p>
      </div>

      <div className="mt-2 border-t border-gray-200 pt-1">
        <p className="font-bold uppercase tracking-wide text-indigo-900">
          Professional Summary
        </p>

        <p className="mt-0.5 text-indigo-900/70 line-clamp-3">
          {resume.summary ||
            "Professional summary"}
        </p>
      </div>

      <div className="mt-1.5 border-t border-gray-200 pt-1">
        <p className="font-bold uppercase tracking-wide text-indigo-900">
          Skills
        </p>

        <p className="mt-0.5 text-indigo-900/70 line-clamp-2">
          {resume.skills || "Skills"}
        </p>
      </div>

      <div className="mt-1.5 border-t border-gray-200 pt-1">
        <p className="font-bold uppercase tracking-wide text-gray-900">
          Professional Experience
        </p>

        {resume.experience?.length >
        0 ? (
          resume.experience.map(
            (exp, index) => (
              <div
                key={`${exp.role || "experience"}-${index}`}
                className="mt-0.5 flex justify-between gap-1"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {exp.role}
                  </p>

                  <p className="text-gray-400">
                    {exp.company}
                  </p>

                  {exp.bullets?.length >
                    0 && (
                    <ul className="mt-0.5 list-disc pl-1.5 text-gray-500">
                      {exp.bullets.map(
                        (
                          bullet,
                          bulletIndex
                        ) => (
                          <li
                            key={`${bullet}-${bulletIndex}`}
                            className="line-clamp-1"
                          >
                            {bullet}
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </div>

                <span className="shrink-0 whitespace-nowrap text-gray-400">
                  {exp.dates}
                </span>
              </div>
            )
          )
        ) : (
          <p className="mt-1 text-gray-400">
            Experience
          </p>
        )}
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Card Menu
|--------------------------------------------------------------------------
*/

function CardMenu({
  onRename,
  onDownload,
  onDelete,
}) {
  const [open, setOpen] =
    useState(false);

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        ref.current &&
        !ref.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Duplicate Removed
  |--------------------------------------------------------------------------
  */

  const items = [
    {
      label: "Rename",
      icon: Pencil,
      action: onRename,
    },
    {
      label: "Download",
      icon: Download,
      action: onDownload,
    },
    {
      label: "Delete",
      icon: Trash2,
      action: onDelete,
      danger: true,
    },
  ];

  return (
    <div
      className="relative"
      ref={ref}
    >
      <button
        type="button"
        aria-label="Resume options"
        aria-expanded={open}
        onClick={() =>
          setOpen(
            (value) => !value
          )
        }
        className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          {items.map(
            ({
              label,
              icon: Icon,
              action,
              danger,
            }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  action?.();
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                  danger
                    ? "text-red-600"
                    : "text-gray-700"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Resume Card
|--------------------------------------------------------------------------
*/

function ResumeCard({
  resume,
  onOpen,
  onRename,
  onDownload,
  onDelete,
}) {
  const [editing, setEditing] =
    useState(false);

  const [draftName, setDraftName] =
    useState(resume.name);

  const commitRename = () => {
    const trimmedName =
      draftName.trim();

    setEditing(false);

    if (
      !trimmedName ||
      trimmedName === resume.name
    ) {
      setDraftName(resume.name);
      return;
    }

    onRename(trimmedName);
  };

  return (
    <div className="group flex flex-col">
      <button
        type="button"
        onClick={onOpen}
        className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-shadow group-hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
      >
        <MiniPreview
          resume={resume}
        />
      </button>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          {editing ? (
            <input
              autoFocus
              value={draftName}
              onChange={(event) =>
                setDraftName(
                  event.target.value
                )
              }
              onBlur={commitRename}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  event.preventDefault();
                  commitRename();
                }

                if (
                  event.key ===
                  "Escape"
                ) {
                  setDraftName(
                    resume.name
                  );

                  setEditing(false);
                }
              }}
              className="w-full rounded-md border border-rose-300 px-1.5 py-0.5 text-base font-semibold text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            />
          ) : (
            <p className="truncate text-base font-semibold text-gray-900">
              {resume.name}
            </p>
          )}

          <p className="text-sm text-gray-400">
            {timeAgo(
              resume.editedAt
            )}{" "}
            • {resume.size}
          </p>
        </div>

        <CardMenu
          onRename={() => {
            setDraftName(resume.name);
            setEditing(true);
          }}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Main Dashboard
|--------------------------------------------------------------------------
*/

export default function ResumeDashboard() {
  const navigate = useNavigate();

  const [active, setActive] =
    useState("resume");

  const {
    user,
    isSignedIn,
    isLoading,
  } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | Resumes
  |--------------------------------------------------------------------------
  */

  const [resumes, setResumes] =
    useState([]);

  /*
  |--------------------------------------------------------------------------
  | Load Resumes From Backend
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadResumes =
      async () => {
        /*
        |--------------------------------------------------------------------------
        | Wait for Firebase Auth
        |--------------------------------------------------------------------------
        */

        if (isLoading) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | User Not Authenticated
        |--------------------------------------------------------------------------
        */

        if (
          !isSignedIn ||
          !user
        ) {
          if (mounted) {
            setResumes([]);
          }

          return;
        }

        try {
          const response =
            await getResumes();

          if (!mounted) {
            return;
          }

          /*
          |--------------------------------------------------------------------------
          | Backend response:
          |
          | {
          |   success: true,
          |   count: ...,
          |   resumes: [...]
          | }
          |--------------------------------------------------------------------------
          */

          const resumeList =
            Array.isArray(
              response?.resumes
            )
              ? response.resumes
              : [];

          const normalizedResumes =
            resumeList.map(
              normalizeResume
            );

          setResumes(
            normalizedResumes
          );
        } catch (error) {
          console.error(
            "Failed to load resumes:",
            error
          );
        }
      };

    loadResumes();

    return () => {
      mounted = false;
    };
  }, [
    isLoading,
    isSignedIn,
    user,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Add Newly Created Resume
  |--------------------------------------------------------------------------
  */

  const addResume = (
    createdResume
  ) => {
    if (!createdResume) {
      return;
    }

    const normalizedResume =
      normalizeResume(
        createdResume
      );

    setResumes(
      (previousResumes) => {
        /*
        |--------------------------------------------------------------------------
        | Prevent duplicate card
        |--------------------------------------------------------------------------
        */

        const alreadyExists =
          previousResumes.some(
            (resume) =>
              resume.id ===
              normalizedResume.id
          );

        if (alreadyExists) {
          return previousResumes.map(
            (resume) =>
              resume.id ===
              normalizedResume.id
                ? normalizedResume
                : resume
          );
        }

        return [
          normalizedResume,
          ...previousResumes,
        ];
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Rename Resume
  |--------------------------------------------------------------------------
  */

  const renameResume = async (
    resumeId,
    name
  ) => {
    const trimmedName =
      name.trim();

    if (
      !resumeId ||
      !trimmedName
    ) {
      return;
    }

    try {
      const response =
        await updateResume(
          resumeId,
          {
            title: trimmedName,
          }
        );

      if (!response?.resume) {
        throw new Error(
          "Updated resume was not returned by the server."
        );
      }

      const updatedResume =
        normalizeResume(
          response.resume
        );

      setResumes(
        (previousResumes) =>
          previousResumes.map(
            (resume) =>
              resume.id === resumeId
                ? updatedResume
                : resume
          )
      );
    } catch (error) {
      console.error(
        "Failed to rename resume:",
        error
      );

      window.alert(
        error?.message ||
          "Failed to rename resume. Please try again."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Resume
  |--------------------------------------------------------------------------
  */

  const handleDeleteResume =
    async (resumeId) => {
      if (!resumeId) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this resume?"
        );

      if (!confirmed) {
        return;
      }

      try {
        /*
        |--------------------------------------------------------------------------
        | Backend delete FIRST
        |--------------------------------------------------------------------------
        */

        await deleteResumeFromBackend(
          resumeId
        );

        /*
        |--------------------------------------------------------------------------
        | Remove from local dashboard
        |--------------------------------------------------------------------------
        */

        setResumes(
          (previousResumes) =>
            previousResumes.filter(
              (resume) =>
                resume.id !==
                resumeId
            )
        );
      } catch (error) {
        console.error(
          "Failed to delete resume:",
          error
        );

        window.alert(
          error?.message ||
            "Failed to delete resume. Please try again."
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Download
  |--------------------------------------------------------------------------
  |
  | PDF export will be connected later.
  |
  */

  const downloadResume = (
    resume
  ) => {
    window.alert(
      `Download for "${resume.name}" will be connected to the PDF export API.`
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
      <Sidebar
        active={active}
        onNavigate={setActive}
      />

      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            My Resumes
          </h1>

          <p className="mt-2 text-[16px] text-slate-500 sm:text-[17px]">
            Your first resume is free forever. Need more than one resume?{" "}
            <a
              href="#"
              onClick={(event) =>
                event.preventDefault()
              }
              className="font-semibold text-slate-600 underline underline-offset-2 hover:text-rose-500"
            >
              Upgrade your plan
            </a>
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <NewResumeCard
              onCreate={addResume}
            />

            {resumes.length ===
            0 ? (
              <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
                <FileText
                  size={28}
                  className="mb-2"
                />

                <p className="text-sm">
                  No resumes yet. Create one to get started.
                </p>
              </div>
            ) : (
              resumes.map(
                (resume) => (
                  <ResumeCard
                    key={
                      resume.id
                    }
                    resume={
                      resume
                    }
                    onOpen={() =>
                      navigate(
                        `/resumebuilder/${resume.id}`
                      )
                    }
                    onRename={(
                      name
                    ) =>
                      renameResume(
                        resume.id,
                        name
                      )
                    }
                    onDownload={() =>
                      downloadResume(
                        resume
                      )
                    }
                    onDelete={() =>
                      handleDeleteResume(
                        resume.id
                      )
                    }
                  />
                )
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
  