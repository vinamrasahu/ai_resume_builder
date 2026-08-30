import React from "react";

import ClassicTemplate from "./preview/templets/ClasssicTemplate";
import ModernTemplate from "./preview/templets/ModernTemplate";



const ResumePreview = ({ data }) => {
  const template = data?.templates || "classic";

  switch (template) {
    case "modern":
      return <ModernTemplate data={data} />;

    case "minimal":
      return <MinimalTemplate data={data} />;

    case "classic":
    default:
      return <ClassicTemplate data={data} />;
  }
};

export default ResumePreview;