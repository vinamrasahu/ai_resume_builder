const PreviewSummary = ({ data }) => {
  if (!data?.trim()) return null;

  return (
    <section>
      <h2>Professional Summary</h2>

      <p>{data}</p>
    </section>
  );
};

export default PreviewSummary;