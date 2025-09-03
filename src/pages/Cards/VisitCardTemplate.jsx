import { Mail, Phone, Globe, MapPin, Building } from "lucide-react";

const VisitCardTemplate = ({ style, employee, isPreview, sideFront }) => {
  const cardSize = isPreview ? "w-80 h-48" : "w-full h-24";
  const companyName = "TechCorp Solutions";

  const employeeName = employee?.full_name || "Employee Name";
  const employeeDesignation = employee?.designation_name || "Designation";
  const employeeDepartment = employee?.department_name || "Department";
  const employeePhone = employee?.mobile || "-";
  const employeeEmail = employee?.email || "-";
  const employeeAddress = employee?.address || "-";
  const employeeWebsite = employee?.website || "-";

  const renderFrontSide = () => {
    const frontBackground = {
      modern: "/assets/ModernTempFront.png",
      classic: "/assets/ClassicTempFront.png",
      minimal: "/assets/MinimalTempFront.png",
      corporate: "/assets/CorporateTempFront.png",
    }[style] || "/assets/DefaultFront.png";

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
            <div className="w-12 h-12 flex items-center justify-center mx-auto bg-white rounded-full p-2">
              <img
                src="/assets/CompanyLogo.png"
                alt="Company Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <h2 className={`font-bold text-black ${isPreview ? "text-2xl" : "text-lg"} mb-1`}>
              {companyName}
            </h2>
          </div>
        </div>
      </div>
    );
  };

  const renderBackSide = () => {
    const backBackground = {
      modern: "/assets/ModernTempBack.png",
      classic: "/assets/ClassicTempBack.png",
      minimal: "/assets/MinimalTempBack.png",
      corporate: "/assets/CorporateTempBack.png",
    }[style] || "/assets/DefaultBack.png";

    const ContactRow = ({ Icon, value }) => (
      <div className="flex items-center space-x-2">
        <Icon size={isPreview ? 14 : 10} className="text-slate-700 flex-shrink-0" />
        <span className={`text-slate-700 ${isPreview ? "text-xs" : "text-xs"}`}>{value}</span>
      </div>
    );

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
            <h3 className={`font-bold text-slate-700 ${isPreview ? "text-lg" : "text-sm"} mb-1`}>
              {employeeName}
            </h3>
            <p className={`${isPreview ? "text-sm" : "text-xs"} text-teal-700 font-semibold mb-2`}>
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
  };

  return sideFront === "front" ? renderFrontSide() : renderBackSide();
};

export default VisitCardTemplate;
