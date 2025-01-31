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
          {translate("terms-privacy-title")}
        </h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("terms-privacy-terms-of-use")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("terms-privacy-terms-of-use-description")}
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("terms-privacy-privacy-policy")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("terms-privacy-privacy-policy-description")}
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("terms-privacy-data-collection")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("terms-privacy-data-collection-description")}
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("terms-privacy-data-security")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("terms-privacy-data-security-description")}
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("terms-privacy-changes-policy")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("terms-privacy-changes-policy-description")}
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {translate("terms-privacy-contact-us")}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {translate("terms-privacy-contact-us-description")}
          </p>
        </section>
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default TermsAndPrivacy;
