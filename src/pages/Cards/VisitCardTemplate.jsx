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
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building size={isPreview ? 32 : 20} className="text-white" />
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
            <div className="h-full flex flex-col justify-between text-center">
              <div>
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building size={isPreview ? 24 : 16} className="text-white" />
                </div>
                <h2
                  className={`font-bold text-gray-800 ${
                    isPreview ? "text-xl" : "text-sm"
                  } mb-1`}
                >
                  {companyName}
                </h2>
                <p
                  className={`text-gray-600 ${
                    isPreview ? "text-sm" : "text-xs"
                  }`}
                >
                  {companyTagline}
                </p>
              </div>
              <div>
                <p
                  className={`text-gray-500 ${
                    isPreview ? "text-xs" : "text-xs"
                  }`}
                >
                  Est. 2020
                </p>
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
            <div className="h-full flex flex-col justify-between">
              <div className="text-center">
                <h2
                  className={`font-light text-gray-900 ${
                    isPreview ? "text-2xl" : "text-lg"
                  } mb-2`}
                >
                  {companyName}
                </h2>
                <p
                  className={`text-gray-600 ${
                    isPreview ? "text-sm" : "text-xs"
                  }`}
                >
                  {companyTagline}
                </p>
              </div>
              <div className="text-center">
                <div className="w-full h-px bg-gray-300"></div>
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
            <div className="relative z-10 h-full flex flex-col justify-between text-center">
              <div>
                <h2
                  className={`font-bold ${
                    isPreview ? "text-xl" : "text-sm"
                  } mb-1`}
                >
                  {companyName}
                </h2>
                <p
                  className={`text-blue-300 ${
                    isPreview ? "text-sm" : "text-xs"
                  }`}
                >
                  {companyTagline}
                </p>
              </div>
              <div className="flex justify-center">
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
                  className={`font-bold ${
                    isPreview ? "text-lg" : "text-sm"
                  } mb-3 text-center`}
                >
                  {employee.name}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-blue-300 text-center mb-4`}
                >
                  {employee.position}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail
                    size={isPreview ? 14 : 10}
                    className="text-blue-300 flex-shrink-0"
                  />
                  <span
                    className={`${isPreview ? "text-xs" : "text-xs"} truncate`}
                  >
                    {employee.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone
                    size={isPreview ? 14 : 10}
                    className="text-blue-300 flex-shrink-0"
                  />
                  <span className={`${isPreview ? "text-xs" : "text-xs"}`}>
                    {employee.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe
                    size={isPreview ? 14 : 10}
                    className="text-blue-300 flex-shrink-0"
                  />
                  <span className={`${isPreview ? "text-xs" : "text-xs"}`}>
                    {employee.website}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin
                    size={isPreview ? 14 : 10}
                    className="text-blue-300 mt-0.5 flex-shrink-0"
                  />
                  <span
                    className={`${
                      isPreview ? "text-xs" : "text-xs"
                    } leading-tight`}
                  >
                    {employee.address}
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
            <div className="h-full flex flex-col justify-between text-gray-700">
              <div className="text-center mb-3">
                <h3
                  className={`font-bold ${
                    isPreview ? "text-lg" : "text-sm"
                  } text-gray-800`}
                >
                  {employee.name}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-gray-600`}
                >
                  {employee.position}
                </p>
                <div className="w-12 h-0.5 bg-gray-400 mx-auto mt-2"></div>
              </div>
              <div className="space-y-1">
                <p className={`${isPreview ? "text-xs" : "text-xs"}`}>
                  <span className="font-medium">Email:</span> {employee.email}
                </p>
                <p className={`${isPreview ? "text-xs" : "text-xs"}`}>
                  <span className="font-medium">Phone:</span> {employee.phone}
                </p>
                <p className={`${isPreview ? "text-xs" : "text-xs"}`}>
                  <span className="font-medium">Web:</span> {employee.website}
                </p>
                <p
                  className={`${
                    isPreview ? "text-xs" : "text-xs"
                  } leading-tight`}
                >
                  <span className="font-medium">Address:</span>{" "}
                  {employee.address}
                </p>
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
            <div className="h-full flex flex-col justify-between text-gray-700">
              <div className="text-center mb-3">
                <h3
                  className={`font-light ${
                    isPreview ? "text-lg" : "text-sm"
                  } text-gray-900`}
                >
                  {employee.name}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-gray-600`}
                >
                  {employee.position}
                </p>
              </div>
              <div className="space-y-2">
                <p className={`${isPreview ? "text-xs" : "text-xs"}`}>
                  {employee.email}
                </p>
                <p className={`${isPreview ? "text-xs" : "text-xs"}`}>
                  {employee.phone}
                </p>
                <p className={`${isPreview ? "text-xs" : "text-xs"}`}>
                  {employee.website}
                </p>
                <p
                  className={`${
                    isPreview ? "text-xs" : "text-xs"
                  } text-gray-500 leading-tight`}
                >
                  {employee.address}
                </p>
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
            <div className="h-full flex flex-col justify-between">
              <div className="text-center mb-3">
                <h3
                  className={`font-bold ${isPreview ? "text-lg" : "text-sm"}`}
                >
                  {employee.name}
                </h3>
                <p
                  className={`${
                    isPreview ? "text-sm" : "text-xs"
                  } text-blue-300`}
                >
                  {employee.position}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail
                    size={isPreview ? 14 : 10}
                    className="text-blue-300 flex-shrink-0"
                  />
                  <span
                    className={`${isPreview ? "text-xs" : "text-xs"} truncate`}
                  >
                    {employee.email}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone
                    size={isPreview ? 14 : 10}
                    className="text-blue-300 flex-shrink-0"
                  />
                  <span className={`${isPreview ? "text-xs" : "text-xs"}`}>
                    {employee.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe
                    size={isPreview ? 14 : 10}
                    className="text-blue-300 flex-shrink-0"
                  />
                  <span className={`${isPreview ? "text-xs" : "text-xs"}`}>
                    {employee.website}
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin
                    size={isPreview ? 14 : 10}
                    className="text-blue-300 mt-0.5 flex-shrink-0"
                  />
                  <span
                    className={`${
                      isPreview ? "text-xs" : "text-xs"
                    } leading-tight`}
                  >
                    {employee.address}
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
