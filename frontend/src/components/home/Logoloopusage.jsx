import LogoLoop from "./LogoLoop";

import Google from "../../assets/logos/google.svg";
import Microsoft from "../../assets/logos/microsoft.svg";
import Amazon from "../../assets/logos/amazon.svg";
import Netflix from "../../assets/logos/netflix.svg";
import Adobe from "../../assets/logos/adobe.svg";
import Spotify from "../../assets/logos/spotify.svg";
import Disney from "../../assets/logos/disney.svg";

const companyLogos = [
  {
    src: Google,
    alt: "Google",
    href: "https://google.com",
  },
  {
    src: Microsoft,
    alt: "Microsoft",
    href: "https://microsoft.com",
  },
  {
    src: Amazon,
    alt: "Amazon",
    href: "https://amazon.com",
  },
  {
    src: Netflix,
    alt: "Netflix",
    href: "https://netflix.com",
  },
  {
    src: Adobe,
    alt: "Adobe",
    href: "https://adobe.com",
  },
  {
    src: Spotify,
    alt: "Spotify",
    href: "https://spotify.com",
  },
  {
    src: Disney,
    alt: "Disney",
    href: "https://disney.com",
  },
];

export default function LogoLoopUsage() {
  return (
    <div className="bg-[#f0faff] mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
      <div className="relative w-full overflow-hidden py-8">
      <LogoLoop
        logos={companyLogos}
        speed={80}
        direction="left"
        logoHeight={64}
        gap={100}
        pauseOnHover
        scaleOnHover
        // fadeOut
        // fadeOutColor="#ffffff"
        ariaLabel="Company Logos"
      />
    </div>
    </div>
  );
}