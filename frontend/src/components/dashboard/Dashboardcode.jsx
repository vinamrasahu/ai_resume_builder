import React, { useState, useRef, useEffect } from "react";
import { Plus, MoreVertical, FileText, Briefcase, ListChecks, User, Pencil, Copy, Download, Trash2 } from "lucide-react";
import { seedResume } from "..//../utils/seedresume";
import { demoResume } from "..//../data/Demoresume";
import Sidebar from "../dashboard/Sidebar";
import NewResumeCard from "../dashboard/Addresume";

/**
 * ResumeDashboard
 * A responsive, dynamic "My Resumes" dashboard inspired by a FlowCV-style layout.
 *
 * - Sidebar nav is data-driven and highlights the active section.
 * - Resume grid is generated from state, so adding / duplicating / deleting
 *   resumes updates the UI immediately.
 * - "New resume" card creates a fresh entry with a live mini-preview.
 * - Card menu (⋮) supports rename, duplicate, download (stub), and delete.
 * - Fully responsive: sidebar collapses to a top bar on small screens,
 *   grid reflows from 1 -> 2 -> 3+ columns.
 */






function timeAgo(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "edited today";
  if (days === 1) return "edited 1 day ago";
  if (days < 30) return `edited ${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "edited 1 month ago" : `edited ${months} months ago`;
}

function MiniPreview({ resume }) {
  return (
    <div className="h-full w-full overflow-hidden bg-white p-4 text-[6px] leading-[8px] text-gray-700 select-none">
      <div className="text-center">
        <p className="text-[8px] font-bold text-gray-900">{resume.fullName}</p>
        <p className="text-[6.5px] text-gray-500">{resume.title}</p>
        <p className="mt-0.5 text-gray-400">{resume.contact}</p>
      </div>

      <div className="mt-2 border-t border-gray-200 pt-1">
        <p className="font-bold uppercase tracking-wide text-indigo-900">Professional Summary</p>
        <p className="mt-0.5 text-indigo-900/70 line-clamp-3">{resume.summary}</p>
      </div>

      <div className="mt-1.5 border-t border-gray-200 pt-1">
        <p className="font-bold uppercase tracking-wide text-indigo-900">Skills</p>
        <p className="mt-0.5 text-indigo-900/70 line-clamp-2">{resume.skills}</p>
      </div>

      <div className="mt-1.5 border-t border-gray-200 pt-1">
        <p className="font-bold uppercase tracking-wide text-gray-900">Professional Experience</p>
        {resume.experience.map((exp, i) => (
          <div key={i} className="mt-0.5 flex justify-between gap-1">
            <div>
              <p className="font-semibold text-gray-800">{exp.role}</p>
              <p className="text-gray-400">{exp.company}</p>
              <ul className="mt-0.5 list-disc pl-1.5 text-gray-500">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="line-clamp-1">{b}</li>
                ))}
              </ul>
            </div>
            <span className="shrink-0 whitespace-nowrap text-gray-400">{exp.dates}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CardMenu({ onRename, onDuplicate, onDownload, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items = [
    { label: "Rename", icon: Pencil, action: onRename },
    { label: "Duplicate", icon: Copy, action: onDuplicate },
    { label: "Download", icon: Download, action: onDownload },
    { label: "Delete", icon: Trash2, action: onDelete, danger: true },
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
          {items.map(({ label, icon: Icon, action, danger }) => (
            <button
              key={label}
              type="button" 
              onClick={() => {
                action?.();
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                danger ? "text-red-600" : "text-gray-700"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ResumeCard({ resume, onRename, onDuplicate, onDownload, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(resume.name);

  const commitRename = () => {
    setEditing(false);
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== resume.name) onRename(trimmed);
    else setDraftName(resume.name);
  };

  return (
    <div className="group flex flex-col">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow group-hover:shadow-md">
        <MiniPreview resume={resume} />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          {editing ? (
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") {
                  setDraftName(resume.name);
                  setEditing(false);
                }
              }}
              className="w-full rounded-md border border-rose-300 px-1.5 py-0.5 text-base font-semibold text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            />
          ) : (
            <p className="truncate text-base font-semibold text-gray-900">{resume.name}</p>
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


  



////main kaaam ....................../////
export default function ResumeDashboard() {
  const [active, setActive] = useState("resume");
  const [resumes, setResumes] = useState([demoResume]);
 
  //// seed ko chala raha hai , ceat resume click karne par new resume dummy create ho jaayega
  const addResume = () => {
    const next = seedResume({ name: `Resume ${resumes.length + 1}`, editedAt: new Date() });
    setResumes((prev) => [...prev, next]);
  };

  const updateResume = (id, patch) => {
    setResumes((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch, editedAt: new Date() } : r)));
  };

  const duplicateResume = (id) => {
    setResumes((prev) => {
      const source = prev.find((r) => r.id === id);
      if (!source) return prev;
      const copy = { ...source, id: crypto.randomUUID(), name: `${source.name} copy`, editedAt: new Date() };
      const idx = prev.findIndex((r) => r.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };

  const deleteResume = (id) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
      <Sidebar active={active} onNavigate={setActive} />

      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">
            My Resumes
          </h1>
          <p className="mt-2 text-[16px] text-slate-500 sm:text-[17px]">
            Your first resume is free forever. Need more than one resume?{" "}
            <a href="#" className="font-semibold text-slate-600 underline underline-offset-2 hover:text-rose-500">
              Upgrade your plan
            </a>
          </p>

          <div className=" mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <NewResumeCard onCreate={addResume} />

            {resumes.length === 0 ? (    
              <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
                <FileText size={28} className="mb-2" />
                <p className="text-sm">No resumes yet. Create one to get started.</p>
              </div> 
            ) : (
              resumes.map((resume) => (   
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onRename={(name) => updateResume(resume.id, { name })}
                  onDuplicate={() => duplicateResume(resume.id)}
                  onDownload={() => alert(`Downloading "${resume.name}"...`)}
                  onDelete={() => deleteResume(resume.id)}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}