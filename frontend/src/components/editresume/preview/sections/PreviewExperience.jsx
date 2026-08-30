import React from "react";
import { Link } from "lucide-react";

const PreviewExperience = ({ data = [], accentColor }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <section className="mt-5">
      <h2
        className="text-sm font-bold uppercase border-b pb-1"
        style={{
          color: accentColor || "#000000",
          borderColor: accentColor || "#000000",
        }}
      >
        Experience
      </h2>

      <div className="mt-3 space-y-4">
        {data.map((experience) => (
          <div key={experience.id}>

            {/* Job title + employer */}
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-semibold text-sm text-gray-900">
                  {experience.jobTitle}
                </h3>

                {experience.employer && (
                  <p className="text-xs text-gray-700">
                    {experience.employerLink ? (
                      <a
                        href={
                          experience.employerLink.startsWith("http")
                            ? experience.employerLink
                            : `https://${experience.employerLink}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:underline"
                        title="Visit company website"
                      >
                        <span>{experience.employer}</span>

                        <Link
                          size={11}
                          strokeWidth={2}
                          className="text-gray-500"
                        />
                      </a>
                    ) : (
                      experience.employer
                    )}
                  </p>
                )}

                {experience.location && (
                  <p className="text-xs text-gray-500">
                    {experience.location}
                  </p>
                )}
              </div>

              {/* Dates */}
              <p className="text-xs text-gray-600 whitespace-nowrap">
                {experience.startDate}
                {" - "}
                {experience.currentlyWorking
                  ? "Present"
                  : experience.endDate}
              </p>
            </div>

            {/* Description */}
            {experience.description && (
              <div
                className="
                  mt-2
                  text-xs
                  leading-relaxed
                  text-gray-700

                  [&_ul]:list-disc
                  [&_ul]:pl-4
                  [&_ol]:list-decimal
                  [&_ol]:pl-4

                  [&_li]:mb-1
                "
                dangerouslySetInnerHTML={{
                  __html: experience.description,
                }}
              />
            )}

          </div>
        ))}
      </div>
    </section>
  );
};

export default PreviewExperience;