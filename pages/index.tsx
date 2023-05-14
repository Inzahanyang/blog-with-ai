import Image from "next/image";
import HeroImage from "../public/hero.webp";
import { Logo } from "../components/Logo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
      <Image src={HeroImage} alt="hero" fill className="absolute" />
      <div className="z-10 relative text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          The AI-powered SAAS solution to generate SEO-optimized blog posts in
          minutes. Get high-quality content, without sacrificing your time.
        </p>
        <Link className="btn mt-6 mb-4 max-w-xs mx-auto" href="/post/new">
          Begin
        </Link>
      </div>
    </div>
  );
}
