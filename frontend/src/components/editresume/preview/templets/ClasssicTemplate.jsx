import React from "react";

import PreviewHeader from "../sections/PreviewHeader";
import PreviewSummary from "../sections/PreviewSummary";
import PreviewEducation from "../sections/PreviewEducation";
import PreviewExperience from "../sections/PreviewExperience";
import PreviewSkills from "../sections/PreviewSkills";
import PreviewProjects from "../sections/PreviewProjects";

const ClassicTemplate = ({ data }) => {
  return (
    <div
      className="
        w-[794px]
        min-h-[1123px]
        mx-auto
        bg-white
        p-10
        shadow-lg
        box-border
      "
    >

      <PreviewHeader
        data={data?.personal_info}
        accentColor={data?.accent_color}
      />

      {data?.personal_summary_visible !== false && (
        <PreviewSummary
          data={data?.personal_summary}
          accentColor={data?.accent_color}
        />
      )}

      <PreviewEducation
        data={data?.education}
        accentColor={data?.accent_color}
      />

      <PreviewExperience
        data={data?.experience}
        accentColor={data?.accent_color}
      />

      <PreviewSkills
        data={data?.skills}
        accentColor={data?.accent_color}
      />

      <PreviewProjects
        data={data?.projects}
        accentColor={data?.accent_color}
      />

    </div>
  );
};

export default ClassicTemplate;