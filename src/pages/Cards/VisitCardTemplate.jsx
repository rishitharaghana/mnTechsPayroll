import { Mail, Phone, Globe, MapPin, Building } from "lucide-react";

const VisitCardTemplate = ({ style, employee, isPreview, sideFront }) => {
  const cardSize = isPreview ? "w-80 h-48" : "w-full h-24";
  const companyName = "TechCorp Solutions";
  const companyTagline = "Innovating Your Future";

  const renderFrontSide = () => {
    switch (style) {
      case "modern":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: "url(/assets/ModernTempFront.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Foreground content */}
            <div className="relative z-10 h-full flex justify-center items-center">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center mx-auto">
                  <img
                    src="/assets/CompanyLogo.png" 
                    alt="Company Logo"
                    className="w-8 h-8 text-white object-contain"
                  />
                </div>
                <h2
                  className={`font-bold text-black ${
                    isPreview ? "text-2xl" : "text-lg"
                  } mb-1`}
                >
                  {companyName}
                </h2>
              </div>
            </div>
          </div>
        );

      case "classic":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: "url(/assets/ClassicTempFront.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex justify-center items-center">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center mx-auto">
                  <img
                    src="/assets/CompanyLogo.png" 
                    alt="Company Logo"
                    className="w-8 h-8 text-white object-contain"
                  />
                </div>
                <h2
                  className={`font-bold text-slate-700 ${
                    isPreview ? "text-xl" : "text-sm"
                  } mb-1`}
                >
                  {companyName}
                </h2>
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: "url(/assets/MinimalTempFront.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex justify-center items-center">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-2 mx-auto">
                  <img
                    src="/assets/CompanyLogo.png" 
                    alt="Company Logo"
                    className="w-8 h-8 text-white object-contain"
                  />
                </div>
                <h2
                  className={`font-semibold text-white ${
                    isPreview ? "text-2xl" : "text-lg"
                  } mb-1`}
                >
                  {companyName}
                </h2>
              </div>
            </div>
          </div>
        );

      case "corporate":
        return (
          <div
            className={`${cardSize} rounded-lg p-4 text-white shadow-lg relative overflow-hidden`}
            style={{
              backgroundImage: "url(/assets/CorporateTempFront.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 h-full flex justify-start items-center">
              <div className="text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full p-2 mx-auto">
                  <img
                    src="/assets/CompanyLogo.png" 
                    alt="Company Logo"
                    className="w-8 h-8 text-white object-contain"
                  />
                </div>
                <h2
                  className={`font-semibold text-slate-700 ${
                    isPreview ? "text-lg" : "text-lx"
                  } mb-1`}
                >
                  {companyName}
                </h2>
              </div>
            </div>
          </div>
        );

      default:
        return renderFrontSide();
    }
  };

  const renderBackSide = () => {
    const baseBackStyle = `${cardSize} rounded-lg p-4 shadow-lg`;

    switch (style) {
      case "modern":
        return (
          <div
            className={`${baseBackStyle} text-white relative overflow-hidden`}
            style={{
              backgroundImage: "url(../assets/ModernTempBack.png)",
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
                  {employee.name}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-teal-700 leading-none font-semibold text-right mb-2`}
                >
                  {employee.position}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 flex-shrink-0"
                  />
                  <span
                    className={`text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    }`}
                  >
                    {employee.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 flex-shrink-0"
                  />
                  <span
                    className={` text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    } truncate`}
                  >
                    {employee.email}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 mt-0.5 flex-shrink-0"
                  />
                  <span
                    className={`text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    } leading-tight`}
                  >
                    {employee.address}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 flex-shrink-0"
                  />
                  <span
                    className={`text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    }`}
                  >
                    {employee.website}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "classic":
        return (
          <div
            className={`${baseBackStyle} text-white relative overflow-hidden`}
            style={{
              backgroundImage: "url(../assets/ClassicTempBack.png)",
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
                  {employee.name}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-teal-700 leading-none font-semibold text-left mb-1`}
                >
                  {employee.position}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 flex-shrink-0"
                  />
                  <span
                    className={`text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    }`}
                  >
                    {employee.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 flex-shrink-0"
                  />
                  <span
                    className={` text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    } truncate`}
                  >
                    {employee.email}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 mt-0.5 flex-shrink-0"
                  />
                  <span
                    className={`text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    } leading-tight`}
                  >
                    {employee.address}
                  </span>
                </div>
                <div className="flex justify-end items-center space-x-2">
                  <Globe
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 flex-shrink-0"
                  />
                  <span
                    className={`text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    }`}
                  >
                    {employee.website}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div
            className={`${baseBackStyle} `}
            style={{
              backgroundImage: "url(../assets/MinimalTempBack.png)",
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
                  {employee.name}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-white leading-none font-semibold text-right mb-2`}
                >
                  {employee.position}
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
                    {employee.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail
                    size={isPreview ? 14 : 10}
                    className="text-white flex-shrink-0"
                  />
                  <span
                    className={` text-white ${
                      isPreview ? "text-xs" : "text-xs"
                    } truncate`}
                  >
                    {employee.email}
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
                    {employee.address}
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
                    {employee.website}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "corporate":
        return (
          <div
            className={`${baseBackStyle} text-white relative overflow-hidden`}
            style={{
              backgroundImage: "url(../assets/CorporateTempBack.png)",
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
                  {employee.name}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-teal-700 leading-none font-semibold text-right mb-2`}
                >
                  {employee.position}
                </p>
              </div>
              <div className="space-y-2 pl-16">
                <div className="flex items-center space-x-2">
                  <Phone
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 flex-shrink-0"
                  />
                  <span
                    className={`text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    }`}
                  >
                    {employee.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 flex-shrink-0"
                  />
                  <span
                    className={` text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    } truncate`}
                  >
                    {employee.email}
                  </span>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 mt-0.5 flex-shrink-0"
                  />
                  <span
                    className={`text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    } leading-tight`}
                  >
                    {employee.address}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe
                    size={isPreview ? 14 : 10}
                    className="text-slate-700 flex-shrink-0"
                  />
                  <span
                    className={`text-slate-700 ${
                      isPreview ? "text-xs" : "text-xs"
                    }`}
                  >
                    {employee.website}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return renderBackSide();
    }
  };

  return sideFront === "front" ? renderFrontSide() : renderBackSide();
};

export default VisitCardTemplate;
