import React from "react";

import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";

import Navbar from "../../../../components/v1/Navbar";
import Footer from "../_sections/Footer";

interface TranslationFunction {
  (key: string): string;
}

interface SectionProps {
  titleKey: string;
  descriptionKey: string;
  translate: TranslationFunction;
}


interface SectionConfig {
  title: string;
  description: string;
}

const Section: React.FC<SectionProps> = ({ titleKey, descriptionKey, translate }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
      {translate(titleKey)}
    </h2>
    <p className="text-gray-700 leading-relaxed">
      {translate(descriptionKey)}
    </p>
  </section>
);

const sections: SectionConfig[] = [
  { title: "terms.title", description: "terms.description" },
  { title: "policy.title", description: "policy.description" },
  { title: "collection.title", description: "collection.description" },
  { title: "security.title", description: "security.description" },
  { title: "changes.title", description: "changes.description" },
  { title: "contact.title", description: "contact.description" },
];


async function TermsAndPrivacy() {
  const { translate } = await loadTranslationsSSR();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="my-12 max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          {translate("pages.terms-and-privacy.title")}
        </h1>
        {sections.map((section) => (
          <Section
            key={section.title}
            titleKey={`pages.terms-and-privacy.${section.title}`}
            descriptionKey={`pages.terms-and-privacy.${section.description}`}
            translate={translate}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default TermsAndPrivacy;