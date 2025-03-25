import React from "react";

import { loadTranslationsSSR } from "@/utils/loadTranslationsSSR";

import Navbar from "../../../../components/Navbar";
import Footer from "../_sections/Footer";

async function TermsAndPrivacy() {
  const { translate } = await loadTranslationsSSR();

  return (
    <div className="bg-gray-100">
      <Navbar />
      <div className="mt-12 max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          {translate("pages.terms-and-privacy.title")}
        </h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("pages.terms-and-privacy.terms.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("pages.terms-and-privacy.terms.description")}
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("pages.terms-and-privacy.policy.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("pages.terms-and-privacy.policy.description")}
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("pages.terms-and-privacy.collection.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("pages.terms-and-privacy.collection.description")}
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("pages.terms-and-privacy.security.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("pages.terms-and-privacy.security.description")}
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("pages.terms-and-privacy.changes.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("pages.terms-and-privacy.changes.description")}
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("pages.terms-and-privacy.contact.title")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("pages.terms-and-privacy.contact.description")}
          </p>
        </section>
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default TermsAndPrivacy;
