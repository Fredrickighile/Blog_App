import React from "react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing or using our website (the 'Service'), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.",
    },
    {
      title: "User Responsibilities",
      content:
        "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
    },
    {
      title: "Content Ownership",
      content:
        "All content posted by users remains the property of its respective owner. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content.",
    },
    {
      title: "Prohibited Conduct",
      listItems: [
        "Posting illegal, defamatory, or harmful content",
        "Impersonating others or providing false information",
        "Engaging in any activity that disrupts the Service",
        "Attempting to gain unauthorized access to our systems",
      ],
    },
    {
      title: "Termination",
      content:
        "We may terminate or suspend your account immediately, without prior notice, for any reason whatsoever, including without limitation if you breach these Terms.",
    },
    {
      title: "Changes to Terms",
      content:
        "We reserve the right to modify these terms at any time. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.",
    },
    {
      title: "Contact Information",
      content: (
        <>
          If you have any questions about these Terms, please contact us at{" "}
          <Link
            to="/contact"
            className="text-blue-600 hover:underline font-medium"
          >
            our contact page
          </Link>
          .
        </>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow-sm border border-gray-100 my-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Terms of Service
      </h1>

      <p className="text-sm text-gray-500 mb-8">Last Updated: May 5, 2025</p>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <section key={index}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {index + 1}. {section.title}
            </h2>
            {section.content && (
              <p className="text-gray-600 mb-3">{section.content}</p>
            )}
            {section.listItems && (
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                {section.listItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default TermsOfService;
