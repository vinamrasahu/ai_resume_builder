import React from "react";

const PreviewProjects = ({
  data = [],
  accentColor = "#1597ee",
}) => {
  const projects = Array.isArray(data) ? data : [];

  if (projects.length === 0) return null;

  return (
    <section className="mb-5">
      {/* Section Heading */}
      <div className="mb-2 flex items-center gap-2">
        <h2
          className="text-[14px] font-bold uppercase tracking-wide"
          style={{ color: accentColor }}
        >
          Projects
        </h2>

        <div
          className="h-[1px] flex-1"
          style={{
            backgroundColor: accentColor,
          }}
        />
      </div>

      {/* Projects */}
      <div className="space-y-3">
        {projects.map((project, index) => {
          // Don't show completely empty projects
          if (
            !project?.projectTitle &&
            !project?.subTitle &&
            !project?.description
          ) {
            return null;
          }

          return (
            <div
              key={project?.id || index}
              className="text-gray-700"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* Project Title */}
                  {project?.projectTitle && (
                    <h3 className="text-[12px] font-bold leading-tight text-gray-800">
                      {project.projectTitle}
                    </h3>
                  )}

                  {/* Subtitle */}
                  {project?.subTitle && (
                    <p className="mt-0.5 text-[10.5px] font-medium text-gray-600">
                      {project.subTitle}
                    </p>
                  )}
                </div>

                {/* Project Link */}
                {project?.projectLink && (
                  <a
                    href={
                      project.projectLink.startsWith("http")
                        ? project.projectLink
                        : `https://${project.projectLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[9.5px] text-blue-600 underline"
                  >
                    Project Link
                  </a>
                )}
              </div>

              {/* Date */}
              {(project?.startDate || project?.endDate) && (
                <p className="mt-0.5 text-[9.5px] text-gray-500">
                  {project.startDate || ""}
                  {project.startDate && project.endDate
                    ? " – "
                    : ""}
                  {project.endDate || ""}
                </p>
              )}

              {/* Description */}
              {project?.description && (
                <div
                  className="
                    mt-1.5
                    text-[10.5px]
                    leading-[1.5]
                    text-gray-700

                    [&_p]:mb-1
                    [&_ul]:my-1
                    [&_ul]:list-disc
                    [&_ul]:pl-5
                    [&_ol]:my-1
                    [&_ol]:list-decimal
                    [&_ol]:pl-5
                    [&_li]:mb-0.5
                    [&_a]:text-blue-600
                    [&_a]:underline
                    [&_strong]:font-semibold
                    [&_b]:font-semibold
                    [&_em]:italic
                    [&_i]:italic
                    [&_u]:underline
                  "
                  dangerouslySetInnerHTML={{
                    __html: project.description,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PreviewProjects;