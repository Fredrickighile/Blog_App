import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content:
        "We collect information you provide directly, including your name, email address, and any content you post. We also automatically collect usage data through cookies and similar technologies.",
    },
    {
      title: "How We Use Information",
      content: "We use the information we collect to:",
      listItems: [
        "Provide, maintain, and improve our services",
        "Respond to your comments, questions, and requests",
        "Monitor and analyze usage trends",
        "Detect, investigate, and prevent fraudulent activities",
      ],
    },
    {
      title: "Information Sharing",
      content:
        "We do not sell your personal information. We may share information with:",
      listItems: [
        "Service providers who assist with our operations",
        "Law enforcement when required by law",
        "Other parties in connection with a business transfer",
      ],
    },
    {
      title: "Data Security",
      content:
        "We implement appropriate security measures to protect your information. However, no internet transmission is completely secure, and we cannot guarantee absolute security.",
    },
    {
      title: "Your Choices",
      content:
        "You may update your account information at any time through your profile settings. You can also request deletion of your account by contacting us.",
    },
    {
      title: "Children's Privacy",
      content:
        "Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.",
    },
    {
      title: "Changes to This Policy",
      content:
        "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
    },
    {
      title: "Contact Us",
      content: (
        <>
          If you have any questions about this Privacy Policy, please contact us
          at{" "}
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
        Privacy Policy
      </h1>

      <p className="text-sm text-gray-500 mb-8">Last Updated: May 5, 2025</p>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <section key={index}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {index + 1}. {section.title}
            </h2>
            <p className="text-gray-600 mb-3">{section.content}</p>
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

export default PrivacyPolicy;
