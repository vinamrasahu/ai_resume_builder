export const seedResume = (overrides = {}) => ({
  id: crypto.randomUUID(),
  name: "Untitled Resume",
  editedAt: new Date(),
  size: "A4",
  fullName: "Your Name",
  title: "Job Title",
  contact: "you@email.com | +91 00000 00000 | City, State",
  summary:
    "A short professional summary highlighting your experience, skills, and what makes you a great fit.",
  skills: "Skill 1, Skill 2, Skill 3, Skill 4",
  experience: [
    {
      role: "Job Title",
      company: "Company Name",
      dates: "MM/YYYY - MM/YYYY",
      bullets: [
        "Key responsibility or achievement",
        "Another notable contribution",
      ],
    },
  ],
  ...overrides,
});