import React, { useState } from "react";
import { ChevronUp, ChevronDown, AlertCircle } from "lucide-react";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
];

export default function ContactsForm({ data, onChange }) {
  const [focusedField, setFocusedField] = useState(null);

  const [touched, setTouched] = useState({
    email: false,
  });

  const [showAdditional, setShowAdditional] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRY_CODES[0]
  );

  const [showCountryList, setShowCountryList] = useState(false);

  const handleChange = (field) => (e) => {
    onChange({
      ...data,
      [field]: e.target.value,
    });
  };

  const handleFocus = (field) => () => {
    setFocusedField(field);
  };

  const handleBlur = (field) => () => {
    setFocusedField(null);

    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const isValidEmailFormat = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const emailIsEmpty = (data?.email || "").trim() === "";

  const emailIsInvalid =
    !emailIsEmpty &&
    !isValidEmailFormat(data?.email || "");

  const showEmailError =
    touched.email &&
    (emailIsEmpty || emailIsInvalid);

  const emailErrorMessage = emailIsEmpty
    ? "Email is required"
    : "Enter a valid email address";

  const getInputClasses = (
    fieldName,
    hasError = false
  ) => {
    const base =
      "w-full px-4 py-3 rounded-lg text-gray-700 placeholder-gray-400 " +
      "outline-none transition-all duration-150 border";

    if (hasError) {
      return `${base} bg-white border-red-300 focus:border-red-400 ring-4 ring-red-50`;
    }

    if (focusedField === fieldName) {
      return `${base} bg-white border-blue-400 ring-5 ring-blue-50 shadow-sm`;
    }

    return (
      `${base} bg-gray-50 border-gray-200 ` +
      `hover:border-blue-300 hover:ring-4 hover:ring-blue-50/70`
    );
  };

  return (
    <form
      className="max-w-1xl mx-auto bg-white mt-5"
    >

      {/* ---------------- First name / Last name ---------------- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

        <div>
          <label
            htmlFor="firstName"
            className="block text-sm text-gray-700 mb-2"
          >
            First name
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            value={data?.firstName || ""}
            onChange={handleChange("firstName")}
            onFocus={handleFocus("firstName")}
            onBlur={handleBlur("firstName")}
            className={getInputClasses("firstName")}
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm text-gray-700 mb-2"
          >
            Last name
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            value={data?.lastName || ""}
            onChange={handleChange("lastName")}
            onFocus={handleFocus("lastName")}
            onBlur={handleBlur("lastName")}
            className={getInputClasses("lastName")}
          />
        </div>

      </div>


      {/* ---------------- Desired job title ---------------- */}

      <div className="mb-6">

        <label
          htmlFor="jobTitle"
          className="block text-sm text-gray-700 mb-2"
        >
          Desired job title
        </label>

        <input
          id="jobTitle"
          name="jobTitle"
          type="text"
          value={data?.jobTitle || ""}
          onChange={handleChange("jobTitle")}
          onFocus={handleFocus("jobTitle")}
          onBlur={handleBlur("jobTitle")}
          className={getInputClasses("jobTitle")}
        />

      </div>


      {/* ---------------- Phone / Email ---------------- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2">

        {/* Phone */}

        <div className="relative">

          <label
            htmlFor="phone"
            className="block text-sm text-gray-700 mb-2"
          >
            Phone
          </label>

          <div
            className={
              "flex items-center rounded-lg border transition-all duration-150 " +
              "bg-gray-50 border-gray-200 hover:border-blue-200 hover:ring-4 hover:ring-blue-50/70 " +
              "focus-within:bg-white focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50"
            }
          >

            <button
              type="button"
              onClick={() =>
                setShowCountryList((open) => !open)
              }
              className="flex items-center gap-1.5 pl-4 pr-3 py-3 text-gray-700 shrink-0"
            >
              <span className="text-lg leading-none">
                {selectedCountry.flag}
              </span>

              <span>
                {selectedCountry.code}
              </span>

              <ChevronDown
                size={14}
                className="text-gray-400"
              />
            </button>

            <span className="w-px h-6 bg-gray-200 shrink-0" />

            <input
              id="phone"
              name="phone"
              type="tel"
              value={data?.phone || ""}
              onChange={handleChange("phone")}
              onFocus={handleFocus("phone")}
              onBlur={handleBlur("phone")}
              placeholder="305-123-44444"
              className="w-full px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 rounded-r-lg"
            />

          </div>


          {/* Country dropdown */}

          {showCountryList && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() =>
                  setShowCountryList(false)
                }
              />

              <div className="absolute z-20 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">

                {COUNTRY_CODES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c);
                      setShowCountryList(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors"
                  >
                    <span className="text-base">
                      {c.flag}
                    </span>

                    <span className="text-gray-700">
                      {c.code}
                    </span>

                    <span className="text-gray-400 text-xs">
                      {c.name}
                    </span>
                  </button>
                ))}

              </div>
            </>
          )}

        </div>


        {/* Email */}

        <div>

          <label
            htmlFor="email"
            className="block text-sm text-gray-700 mb-2"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={data?.email || ""}
            onChange={handleChange("email")}
            onFocus={handleFocus("email")}
            onBlur={handleBlur("email")}
            placeholder="e.g. mail@example.com"
            className={getInputClasses(
              "email",
              showEmailError
            )}
          />

          {showEmailError && (
            <p className="flex items-center gap-1 text-red-500 text-sm mt-1.5">

              <AlertCircle size={14} />

              {emailErrorMessage}

            </p>
          )}

        </div>

      </div>


      {/* ---------------- Additional information toggle ---------------- */}

      <button
        type="button"
        onClick={() =>
          setShowAdditional((open) => !open)
        }
        className="flex items-center gap-1 text-[#05a2ff] font-medium mt-8 mb-6 hover:text-blue-500 transition-colors"
      >

        Additional information

        {showAdditional ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}

      </button>


      {/* ---------------- Additional information ---------------- */}

      <div
        className={
          "overflow-hidden transition-all duration-300 ease-in-out " +
          (showAdditional
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0")
        }
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

          <div>

            <label
              htmlFor="address"
              className="block text-sm text-gray-700 mb-2"
            >
              Address
            </label>

            <input
              id="address"
              name="address"
              type="text"
              value={data?.address || ""}
              onChange={handleChange("address")}
              onFocus={handleFocus("address")}
              onBlur={handleBlur("address")}
              className={getInputClasses("address")}
            />

          </div>


          <div>

            <label
              htmlFor="city"
              className="block text-sm text-gray-700 mb-2"
            >
              City
            </label>

            <input
              id="city"
              name="city"
              type="text"
              value={data?.city || ""}
              onChange={handleChange("city")}
              onFocus={handleFocus("city")}
              onBlur={handleBlur("city")}
              className={getInputClasses("city")}
            />

          </div>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div>

            <label
              htmlFor="country"
              className="block text-sm text-gray-700 mb-2"
            >
              Country
            </label>

            <input
              id="country"
              name="country"
              type="text"
              value={data?.country || ""}
              onChange={handleChange("country")}
              onFocus={handleFocus("country")}
              onBlur={handleBlur("country")}
              className={getInputClasses("country")}
            />

          </div>


          <div>

            <label
              htmlFor="postCode"
              className="block text-sm text-gray-700 mb-2"
            >
              Post code
            </label>

            <input
              id="postCode"
              name="postCode"
              type="text"
              value={data?.postCode || ""}
              onChange={handleChange("postCode")}
              onFocus={handleFocus("postCode")}
              onBlur={handleBlur("postCode")}
              className={getInputClasses("postCode")}
            />

          </div>

        </div>

      </div>


      {/* ---------------- Submit ---------------- */}

      <button
        type="button"
        className="mt-8 px-6 py-3 bg-[#05a2ff] hover:bg-[#048cce] text-white font-medium rounded-lg transition-colors"
      >
        Save contact information
      </button>

    </form>
  );
};