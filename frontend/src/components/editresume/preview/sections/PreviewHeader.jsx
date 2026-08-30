const PreviewHeader = ({ data, accentColor }) => {
  const fullName = [
    data?.firstName,
    data?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const location = [
    data?.address,
    data?.city,
    data?.country,
    data?.postCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <header className="flex flex-col items-center justify-center text-center mb-5">
      <h1 className="text-2xl font-bold text-gray-900">
        {fullName || "Your Name"}
      </h1>

      <p>
        {data?.email}

        {data?.phone && (
          <> | {data.phone}</>
        )}

        {location && (
          <> | {location}</>
        )}
      </p>

      <div>
        {data?.linkedin && (
          <span>LinkedIn</span>
        )}

        {data?.github && (
          <span>GitHub</span>
        )}
      </div>
    </header>
  );
};

export default PreviewHeader;