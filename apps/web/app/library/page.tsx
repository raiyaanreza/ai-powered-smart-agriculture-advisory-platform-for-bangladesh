import { Metadata } from "next";
import { Navbar, Footer } from "@/features/landing/components/Layout";
import { AnimatedBanner } from "@/features/landing/components/AnimatedBanner";
import { LibraryContainer } from "@/features/library/components/LibraryContainer";

export const metadata: Metadata = {
  title: "Crop Disease Library | AgriVision Encyclopedia",
  description: "Explore our expert-curated library of crop diseases, symptoms, and treatment plans for smart farming in Bangladesh.",
};

export default function LibraryPage() {
  return (
    <>
      <AnimatedBanner />
      <Navbar />
      <main id="main-content" role="main">
        <LibraryContainer />
      </main>
      <Footer />
    </>
  );
}
