import React from "react";

const PreviewSkills = ({
  data = [],
  accentColor = "#000000",
}) => {
  const skills = Array.isArray(data) ? data : [];

  if (skills.length === 0) return null;

  return (
    <section className="mb-5">

      {/* Section Heading */}
      <div className="mb-2 flex items-center gap-2">
        <h2
          className="text-[14px] font-bold uppercase tracking-wide"
          style={{
            color: accentColor,
          }}
        >
          Skills
        </h2>

        <div
          className="h-[1px] flex-1"
          style={{
            backgroundColor: accentColor,
          }}
        />
      </div>


      {/* Skills */}
      <div className="space-y-2.5">

        {skills.map((entry, index) => {

          if (!entry) return null;

          const skill =
            entry.skill?.trim() || "";

          const information =
            entry.information || "";

          // Skip empty entries
          if (!skill && !information) {
            return null;
          }

          return (
            <div
              key={entry.id || index}
              className="
                text-[10.5px]
                leading-[1.5]
                text-gray-700
              "
            >

              {/* Skill Name */}
              {skill && (
                <div
                  className="
                    mb-0.5
                    font-semibold
                    text-gray-800
                  "
                >
                  {skill}
                </div>
              )}


              {/* Information / Sub-skills */}
              {information && (
                <div
                  className="
                    text-gray-600

                    [&_p]:m-0
                    [&_p]:mb-0.5

                    [&_ul]:my-0.5
                    [&_ul]:list-disc
                    [&_ul]:pl-5

                    [&_ol]:my-0.5
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
                    __html: information,
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

export default PreviewSkills;