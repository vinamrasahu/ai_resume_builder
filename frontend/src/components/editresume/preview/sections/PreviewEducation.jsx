const PreviewEducation = ({ data = [] }) => {
  if (!data.length) return null;

  return (
    <section>
      <h2>Education</h2>

      {data.map((education) => (
        <div key={education.id}>

          <div>
            <h3>{education.schoolName}</h3>

            <p>{education.degree}</p>

            {education.location && (
              <p>{education.location}</p>
            )}
          </div>

          <div>
            {education.startDate}

            {" - "}

            {education.stillEnrolled
              ? "Present"
              : education.endDate}
          </div>

          {education.description && (
            <div
              dangerouslySetInnerHTML={{
                __html: education.description,
              }}
            />
          )}

        </div>
      ))}
    </section>
  );
};

export default PreviewEducation;