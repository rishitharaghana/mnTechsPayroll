import { Mail, Phone, Globe, MapPin, Building } from "lucide-react";

const VisitCardTemplate = ({ style, employee, isPreview, sideFront }) => {
  const cardSize = isPreview ? "w-80 h-48" : "w-full h-24";
  const companyName = "Meet Owner";

  const employeeName = employee?.full_name || "Employee Name";
  const employeeDesignation = employee?.designation_name || "Designation";
  const employeeDepartment = employee?.department_name || "Department";
  const employeePhone = employee?.mobile || "-";
  const employeeEmail = employee?.email || "-";
  const employeeAddress = employee?.address || "-";
  console.log("Address:", employee);
  const employeeWebsite = employee?.website || "meetowner.in";

  const renderFrontSide = () => {
    const frontBackground =
      {
        modern: "/assets/ModernTempFront.png",
        classic: "/assets/ClassicTempFront.png",
        minimal: "/assets/MinimalTempFront.png",
        corporate: "/assets/CorporateTempFront.png",
      }[style] || "/assets/DefaultFront.png";

    switch (style) {
      case "modern":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: `url(${frontBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex justify-center items-center">
              <div className="text-center">
                <div className="w-33 h-33 flex items-center justify-center mx-auto">
                  <img
                    src="/assets/CompanyLogo.png"
                    alt="Company Logo"
                    className="w-33 h-33 text-white object-contain"
                  />
                </div>
                {/* <h2
                  className={`font-bold text-black ${
                    isPreview ? "text-2xl" : "text-lg"
                  } mb-1`}
                >
                  {companyName}
                </h2> */}
              </div>
            </div>
          </div>
        );

      case "classic":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: `url(${frontBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex justify-center items-center">
              <div className="text-center">
                <div className="w-33 h-33 flex items-center justify-center mx-auto">
                  <img
                    src="/assets/CompanyLogo.png"
                    alt="Company Logo"
                    className="w-33 h-33 text-white object-contain"
                  />
                </div>
                {/* <h2
                  className={`font-bold text-slate-700 ${
                    isPreview ? "text-xl" : "text-sm"
                  } mb-1`}
                >
                  {companyName}
                </h2> */}
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: `url(${frontBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex justify-center items-center">
              <div className="text-center">
                <div className="w-33 h-33 flex items-center justify-center   p-2 mx-auto">
                  <img
                    src="/assets/CompanyLogo.png"
                    alt="Company Logo"
                    className="w-33 h-33 text-white object-contain"
                  />
                </div>
                {/* <h2
                  className={`font-semibold text-white ${
                    isPreview ? "text-2xl" : "text-lg"
                  } mb-1`}
                >
                  {companyName}
                </h2> */}
              </div>
            </div>
          </div>
        );

      case "corporate":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: `url(${frontBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex justify-start items-center">
              <div className="text-center">
                <div className="w-33 h-33 flex items-center justify-center p-2 mx-auto">
                  <img
                    src="/assets/CompanyLogo.png"
                    alt="Company Logo"
                    className="w-33 h-33 text-white object-contain"
                  />
                </div>
                {/* <h2
                  className={`font-semibold text-slate-700 ${
                    isPreview ? "text-lg" : "text-sm"
                  } mb-1`}
                >
                  {companyName}
                </h2> */}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div
            className={`${cardSize} rounded-lg p-4 shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: `url(${frontBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex justify-center items-center">
              <div className="text-center">
                <div className="w-33 h-33 flex items-center justify-center mx-auto p-2">
                  <img
                    src="/assets/CompanyLogo.png"
                    alt="Company Logo"
                    className="w-33 h-33 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderBackSide = () => {
    const backBackground =
      {
        modern: "/assets/ModernTempBack.png",
        classic: "/assets/ClassicTempBack.png",
        minimal: "/assets/MinimalTempBack.png",
        corporate: "/assets/CorporateTempBack.png",
      }[style] || "/assets/DefaultBack.png";

    const ContactRow = ({ Icon, value }) => (
      <div className="flex items-center space-x-2">
        <Icon
          size={isPreview ? 14 : 10}
          className="text-slate-700 flex-shrink-0"
        />
        <span className={`text-slate-700 ${isPreview ? "text-xs" : "text-xs"}`}>
          {value}
        </span>
      </div>
    );

    switch (style) {
      case "modern":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: `url(${backBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3
                  className={`font-bold text-slate-700 ${
                    isPreview ? "text-lg" : "text-sm"
                  } mb-1 text-right`}
                >
                  {employeeName}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-teal-700 leading-none font-semibold text-right mb-2`}
                >
                  {employeeDesignation}
                </p>
              </div>
              <div className="space-y-2">
                <ContactRow Icon={Phone} value={employeePhone} />
                <ContactRow Icon={Mail} value={employeeEmail} />
                <ContactRow Icon={MapPin} value={employeeAddress} />
                <ContactRow Icon={Globe} value={employeeWebsite} />
              </div>
            </div>
          </div>
        );

      case "classic":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: `url(${backBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex gap-1 flex-col justify-between">
              <div>
                <h3
                  className={`font-bold text-slate-700 ${
                    isPreview ? "text-lg" : "text-sm"
                  } mb-1 text-left`}
                >
                  {employeeName}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-teal-700 leading-none font-semibold text-left mb-1`}
                >
                  {employeeDesignation}
                </p>
              </div>
              <div className="space-y-2">
                <ContactRow Icon={Phone} value={employeePhone} />
                <ContactRow Icon={Mail} value={employeeEmail} />
                <ContactRow Icon={MapPin} value={employeeAddress} />
                <ContactRow Icon={Globe} value={employeeWebsite || "meetowner.in"} />
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: `url(${backBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3
                  className={`font-bold text-white ${
                    isPreview ? "text-lg" : "text-sm"
                  } mb-1 text-right`}
                >
                  {employeeName}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-white leading-none font-semibold text-right mb-2`}
                >
                  {employeeDesignation}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone
                    size={isPreview ? 14 : 10}
                    className="text-white flex-shrink-0"
                  />
                  <span
                    className={`text-white ${
                      isPreview ? "text-xs" : "text-xs"
                    }`}
                  >
                    {employeePhone}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail
                    size={isPreview ? 14 : 10}
                    className="text-white flex-shrink-0"
                  />
                  <span
                    className={`text-white ${
                      isPreview ? "text-xs" : "text-xs"
                    } truncate`}
                  >
                    {employeeEmail}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin
                    size={isPreview ? 14 : 10}
                    className="text-white mt-0.5 flex-shrink-0"
                  />
                  <span
                    className={`text-white ${
                      isPreview ? "text-xs" : "text-xs"
                    } leading-tight`}
                  >
                    {employeeAddress}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe
                    size={isPreview ? 14 : 10}
                    className="text-white flex-shrink-0"
                  />
                  <span
                    className={`text-white ${
                      isPreview ? "text-xs" : "text-xs"
                    }`}
                  >
                    {employeeWebsite || "meetowner.in"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "corporate":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: `url(${backBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3
                  className={`font-bold text-slate-700 ${
                    isPreview ? "text-lg" : "text-sm"
                  } mb-1 text-right`}
                >
                  {employeeName}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-teal-700 leading-none font-semibold text-right mb-2`}
                >
                  {employeeDesignation}
                </p>
              </div>
              <div className="space-y-2 pl-16">
                <ContactRow Icon={Phone} value={employeePhone} />
                <ContactRow Icon={Mail} value={employeeEmail} />
                <ContactRow Icon={MapPin} value={employeeAddress} />
                <ContactRow Icon={Globe} value={employeeWebsite || "meetowner.in"} />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div
            className={`${cardSize} rounded-lg p-4 shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: `url(${backBackground})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3
                  className={`font-bold text-slate-700 ${
                    isPreview ? "text-lg" : "text-sm"
                  } mb-1`}
                >
                  {employeeName}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-teal-700 font-semibold mb-2`}
                >
                  {employeeDesignation}
                </p>
              </div>
              <div className="space-y-2">
                <ContactRow Icon={Phone} value={employeePhone} />
                <ContactRow Icon={Mail} value={employeeEmail} />
                <ContactRow Icon={MapPin} value={employeeAddress} />
                <ContactRow Icon={Globe} value={employeeWebsite || "meetowner.in"} />
              </div>
            </div>
          </div>
        );
    }
  };

  return sideFront === "front" ? renderFrontSide() : renderBackSide();
};

export default VisitCardTemplate;
