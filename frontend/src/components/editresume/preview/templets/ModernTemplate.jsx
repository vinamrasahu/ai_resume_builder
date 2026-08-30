const ModernTemplate = ({ data }) => {

  const {
    personal_info,
    personal_summary,
    education,
    experience,
    skills,
    projects,
    accent_color,
  } = data;

  return (
    <div className="bg-white min-h-[1123px]">

      {/* Modern Header */}
      <header
        className="p-10 text-white"
        style={{ backgroundColor: accent_color }}
      >
        <h1 className="text-4xl font-bold">
          {personal_info?.name || "Your Name"}
        </h1>

        <div className="mt-2 text-sm">
          {personal_info?.email}
        </div>
      </header>


      <div className="p-10">

        {/* Summary */}
        {personal_summary && (
          <section>
            <h2 className="text-xl font-bold">
              Profile
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              {personal_summary}
            </p>
          </section>
        )}


        {/* Education */}
        {/* Different layout */}


        {/* Experience */}
        {/* Different layout */}


        {/* Skills */}
        {/* Different layout */}

      </div>

    </div>
  );
};

export default ModernTemplate;