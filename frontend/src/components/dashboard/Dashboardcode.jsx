import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  FileText,
  Pencil,
  Copy,
  Download,
  Trash2,
} from "lucide-react";

import Sidebar from "../dashboard/Sidebar";
import NewResumeCard from "../dashboard/Addresume";

import {
  getResumes,
  updateResume,
  deleteResume,
  createResume,
} from "../../api/resumeApi";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function timeAgo(date) {
  if (!date) return "edited just now";

  const diffMs = Date.now() - new Date(date).getTime();

  if (Number.isNaN(diffMs)) return "edited just now";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return "edited today";
  if (days === 1) return "edited 1 day ago";
  if (days < 30) return `edited ${days} days ago`;

  const months = Math.floor(days / 30);

  return months === 1
    ? "edited 1 month ago"
    : `edited ${months} months ago`;
}

/*
|--------------------------------------------------------------------------
| Convert Backend Resume → Dashboard Resume
|--------------------------------------------------------------------------
|
| Backend data remains available on the object.
| Dashboard-specific aliases are added so existing UI doesn't need
| to be changed.
|
*/

function normalizeResume(resume) {
  const personalInfo = resume.personal_info || {};

  const experience = Array.isArray(resume.experience)
    ? resume.experience.map((exp) => ({
      role: exp.jobTitle || "",
      company: exp.employer || "",
      bullets: exp.description
        ? exp.description
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
        : [],
      dates: exp.currentlyWorking
        ? `${exp.startDate || ""} - Present`
        : `${exp.startDate || ""}${exp.endDate ? ` - ${exp.endDate}` : ""}`,
    }))
    : [];

  const skills = Array.isArray(resume.skills)
    ? resume.skills
      .map((skill) => skill.skill)
      .filter(Boolean)
      .join(", ")
    : "";

  return {
    ...resume,

    /*
    |--------------------------------------------------------------------------
    | Existing Dashboard State/UI Names
    |--------------------------------------------------------------------------
    */

    id: resume.resumeId || resume._id,
    name: resume.title,
    fullName: personalInfo.fullName || "",
    contact: [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
    ]
      .filter(Boolean)
      .join(" • "),

    summary: resume.personal_summary || "",

    skills,

    experience,

    editedAt: resume.updatedAt || resume.createdAt,
    size: "Resume",
  };
}

/*
|--------------------------------------------------------------------------
| Convert Dashboard Resume → Create Resume Payload
|--------------------------------------------------------------------------
|
| Only fields accepted by backend validation are sent.
|
*/

function getCreatePayload(resume, title) {
  return {
    title,
    personal_info: resume.personal_info || {},
    personal_summary: resume.personal_summary || "",
    personal_summary_visible:
      resume.personal_summary_visible ?? true,

    experience: resume.experience || [],
    experienceTitle: resume.experienceTitle || "Experience",

    education: resume.education || [],
    skills: resume.skills || [],
    projects: resume.projects || [],

    templates: resume.templates || "classic",
    accent_color: resume.accent_color || "#000000",
    public: resume.public ?? false,
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
          {resume.fullName || "Your Name"}
        </p>

        <p className="text-[6.5px] text-gray-500">
          {resume.name || "Resume"}
        </p>

        <p className="mt-0.5 text-gray-400">
          {resume.contact || "Contact information"}
        </p>
      </div>

      <div className="mt-2 border-t border-gray-200 pt-1">
        <p className="font-bold uppercase tracking-wide text-indigo-900">
          Professional Summary
        </p>

        <p className="mt-0.5 text-indigo-900/70 line-clamp-3">
          {resume.summary || "Professional summary"}
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

        {resume.experience?.length > 0 ? (
          resume.experience.map((exp, i) => (
            <div
              key={i}
              className="mt-0.5 flex justify-between gap-1"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {exp.role}
                </p>

                <p className="text-gray-400">
                  {exp.company}
                </p>

                <ul className="mt-0.5 list-disc pl-1.5 text-gray-500">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="line-clamp-1">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <span className="shrink-0 whitespace-nowrap text-gray-400">
                {exp.dates}
              </span>
            </div>
          ))
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
  onDuplicate,
  onDownload,
  onDelete,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const items = [
    {
      label: "Rename",
      icon: Pencil,
      action: onRename,
    },
    {
      label: "Duplicate",
      icon: Copy,
      action: onDuplicate,
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
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Resume options"
        onClick={() => setOpen((o) => !o)}
        className=" rounded-full p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          {items.map(
            ({ label, icon: Icon, action, danger }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  action?.();
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${danger
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
  onDuplicate,
  onDownload,
  onDelete,
}) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(resume.name);

  useEffect(() => {
    setDraftName(resume.name);
  }, [resume.name]);

  const commitRename = () => {
    setEditing(false);

    const trimmed = draftName.trim();

    if (trimmed && trimmed !== resume.name) {
      onRename(trimmed);
    } else {
      setDraftName(resume.name);
    }
  };

  return (
    <div className="group flex flex-col">
      <button
        type="button"
        onClick={onOpen}
        className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-shadow group-hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
      >
        <MiniPreview resume={resume} />
      </button>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          {editing ? (
            <input
              autoFocus
              value={draftName}
              onChange={(e) =>
                setDraftName(e.target.value)
              }
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitRename();
                }

                if (e.key === "Escape") {
                  setDraftName(resume.name);
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
            {timeAgo(resume.editedAt)} • {resume.size}
          </p>
        </div>

        <CardMenu
          onRename={() => setEditing(true)}
          onDuplicate={onDuplicate}
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
  const [active, setActive] = useState("resume");
  const { user, isSignedIn, isLoading } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT:
  | Start with EMPTY array.
  | No demoResume / seedResume.
  |--------------------------------------------------------------------------
  */

  const [resumes, setResumes] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | Load Resumes From Backend
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadResumes = async () => {
      /*
      |--------------------------------------------------------------------------
      | Wait until Firebase finishes restoring the auth session.
      |--------------------------------------------------------------------------
      */

      if (isLoading) {
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | User is not authenticated.
      |--------------------------------------------------------------------------
      */

      if (!isSignedIn || !user) {
        if (mounted) {
          setResumes([]);
        }

        return;
      }

      try {
        const response = await getResumes();

        if (!mounted) return;

        const normalizedResumes = (
          response.resumes || []
        ).map(normalizeResume);

        setResumes(normalizedResumes);
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
  }, [isLoading, isSignedIn, user]);

  /*
  |--------------------------------------------------------------------------
  | Add Newly Created Resume
  |--------------------------------------------------------------------------
  */

  const addResume = (createdResume) => {
    const normalizedResume =
      normalizeResume(createdResume);

    setResumes((prev) => [
      normalizedResume,
      ...prev,
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | Rename Resume
  |--------------------------------------------------------------------------
  */

  const renameResume = async (resumeId, name) => {
    try {
      const response = await updateResume(
        resumeId,
        {
          title: name,
        }
      );

      const updatedResume =
        normalizeResume(response.resume);

      setResumes((prev) =>
        prev.map((resume) =>
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
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Duplicate Resume
  |--------------------------------------------------------------------------
  */

  const duplicateResume = async (resumeId) => {
    try {
      const source = resumes.find(
        (resume) => resume.id === resumeId
      );

      if (!source) return;

      const duplicateTitle = `${source.name} copy`;

      const response = await createResume(
        getCreatePayload(
          source,
          duplicateTitle
        )
      );

      const duplicatedResume =
        normalizeResume(response.resume);

      setResumes((prev) => {
        const index = prev.findIndex(
          (resume) => resume.id === resumeId
        );

        if (index === -1) {
          return [
            duplicatedResume,
            ...prev,
          ];
        }

        const next = [...prev];

        next.splice(
          index + 1,
          0,
          duplicatedResume
        );

        return next;
      });
    } catch (error) {
      console.error(
        "Failed to duplicate resume:",
        error
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Resume
  |--------------------------------------------------------------------------
  */

  const deleteResume = async (resumeId) => {
    try {
      await deleteResumeFromBackend(resumeId);

      setResumes((prev) =>
        prev.filter(
          (resume) => resume.id !== resumeId
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete resume:",
        error
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

  const downloadResume = (resume) => {
    alert(
      `Download for "${resume.name}" will be connected to the PDF export API.`
    );
  };

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
              className="font-semibold text-slate-600 underline underline-offset-2 hover:text-rose-500"
            >
              Upgrade your plan
            </a>
          </p>

          <div className=" mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <NewResumeCard
              onCreate={addResume}
            />

            {resumes.length === 0 ? (
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
              resumes.map((resume) => (
                <ResumeCard
                  key={resume.id || resume.resumeId}
                  resume={resume}
                  onOpen={() =>
  navigate(`/resumebuilder/${resume.id}`)
}
                  onRename={(name) =>
                    renameResume(
                      resume.id,
                      name
                    )
                  }
                  onDuplicate={() =>
                    duplicateResume(
                      resume.id
                    )
                  }
                  onDownload={() =>
                    downloadResume(
                      resume
                    )
                  }
                  onDelete={() =>
                    deleteResume(
                      resume.id
                    )
                  }
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Backend Delete Alias
|--------------------------------------------------------------------------
|
| Prevents conflict between local function name and imported API function.
|
*/

import {
  deleteResume as deleteResumeFromBackend,
} from "../../api/resumeApi";