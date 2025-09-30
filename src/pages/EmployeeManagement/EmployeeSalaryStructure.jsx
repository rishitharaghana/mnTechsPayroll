// import React, { useState, useCallback, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { createSalaryStructure, clearState } from "../../redux/slices/employeeSlice";
// import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
// import PageMeta from "../../Components/common/PageMeta";

// const EmployeeSalaryStructure = () => {
//   const { employeeId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { loading, error, successMessage } = useSelector((state) => state.employee);

//   const [salaryStructure, setSalaryStructure] = useState({
//     basicSalary: "",
//     hraPercentage: "",
//     hraAmount: "",
//     specialAllowances: "", // Changed to plural
//     pfPercentage: "12",
//     pfAmount: "",
//     esiPercentage: "0.75",
//     esiAmount: "",
//     bonus: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [realTimeCalculations, setRealTimeCalculations] = useState({
//     grossSalary: 0,
//     totalDeductions: 0,
//     netSalary: 0,
//   });

//   useEffect(() => {
//     console.log("EmployeeSalaryStructure: Initializing with employeeId:", employeeId);
//     if (!employeeId || employeeId === "null" || employeeId === "undefined") {
//       console.error("EmployeeSalaryStructure: Invalid employeeId:", employeeId);
//       toast.error("Invalid employee ID");
//       navigate("/admin/employees");
//     }
//   }, [employeeId, navigate]);

//   useEffect(() => {
//     if (error) {
//       console.error("EmployeeSalaryStructure error:", error);
//       if (
//         error.includes("Access token is required") ||
//         error.includes("Invalid or expired token") ||
//         error.includes("Access denied") ||
//         error.includes("Employee not found")
//       ) {
//         toast.error("Session expired or unauthorized. Please log in again.");
//         navigate("/login");
//       } else {
//         toast.error(error);
//         setErrors({ submit: error });
//       }
//     }
//     if (successMessage && !isSubmitting) {
//       console.log("EmployeeSalaryStructure success:", successMessage);
//       toast.success(successMessage);
//       dispatch(clearState());
//       navigate("/admin/employees");
//     }
//   }, [error, successMessage, dispatch, navigate, isSubmitting]);

//   const calculateRealTime = useCallback(() => {
//     const basic = parseFloat(salaryStructure.basicSalary) || 0;
//     const hra = parseFloat(salaryStructure.hraAmount) || 0;
//     const allowances = parseFloat(salaryStructure.specialAllowances) || 0;
//     const bonus = parseFloat(salaryStructure.bonus) || 0;
//     const pf = parseFloat(salaryStructure.pfAmount) || 0;
//     const esi = parseFloat(salaryStructure.esiAmount) || 0;

//     const grossSalary = basic + hra + allowances + bonus;
//     const totalDeductions = pf + esi;
//     const netSalary = grossSalary - totalDeductions;

//     console.log("Real-time calculations:", { grossSalary, totalDeductions, netSalary });

//     setRealTimeCalculations({
//       grossSalary: grossSalary.toFixed(2),
//       totalDeductions: totalDeductions.toFixed(2),
//       netSalary: netSalary.toFixed(2),
//     });
//   }, [salaryStructure]);

//   const handleInput = useCallback(
//     (field, value) => {
//       setSalaryStructure((prev) => ({ ...prev, [field]: value }));
//       setErrors((prev) => ({ ...prev, [field]: "" }));

//       const basic = parseFloat(field === "basicSalary" ? value : salaryStructure.basicSalary) || 0;
//       const gross = basic +
//                     parseFloat(field === "specialAllowances" ? value : salaryStructure.specialAllowances || 0) +
//                     parseFloat(salaryStructure.hraAmount || 0) +
//                     parseFloat(field === "bonus" ? value : salaryStructure.bonus || 0);

//       if (field === "hraPercentage" || field === "basicSalary") {
//         const hraPercent = parseFloat(field === "hraPercentage" ? value : salaryStructure.hraPercentage) || 0;
//         setSalaryStructure((prev) => ({ ...prev, hraAmount: ((basic * hraPercent) / 100).toFixed(2) }));
//       }
//       if (field === "pfPercentage" || field === "basicSalary") {
//         const pfPercent = parseFloat(field === "pfPercentage" ? value : salaryStructure.pfPercentage) || 0;
//         if (basic <= 15000 && pfPercent !== 12) {
//           setErrors((prev) => ({ ...prev, pfPercentage: "PF must be 12% for basic salary ≤ ₹15,000" }));
//         } else {
//           setSalaryStructure((prev) => ({ ...prev, pfAmount: ((basic * pfPercent) / 100).toFixed(2) }));
//         }
//       }
//       if (field === "esiPercentage" || field === "basicSalary" || field === "specialAllowances" || field === "bonus") {
//         const esiPercent = parseFloat(field === "esiPercentage" ? value : salaryStructure.esiPercentage) || 0;
//         if (gross > 21000 && esiPercent > 0) {
//           setErrors((prev) => ({ ...prev, esiPercentage: "ESI not applicable for gross salary > ₹21,000" }));
//           setSalaryStructure((prev) => ({ ...prev, esiAmount: "0" }));
//         } else if (gross <= 21000 && esiPercent !== 0.75) {
//           setErrors((prev) => ({ ...prev, esiPercentage: "ESI must be 0.75% for employee contribution" }));
//         } else {
//           setSalaryStructure((prev) => ({ ...prev, esiAmount: ((gross * esiPercent) / 100).toFixed(2) }));
//         }
//       }
//     },
//     [salaryStructure]
//   );

//   useEffect(() => {
//     calculateRealTime();
//   }, [salaryStructure, calculateRealTime]);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!salaryStructure.basicSalary) newErrors.basicSalary = "Basic Salary is required";
//     if (salaryStructure.basicSalary && (isNaN(salaryStructure.basicSalary) || parseFloat(salaryStructure.basicSalary) <= 0)) {
//       newErrors.basicSalary = "Basic Salary must be a positive number";
//     }
//     if (!salaryStructure.hraPercentage) newErrors.hraPercentage = "HRA Percentage is required";
//     if (salaryStructure.hraPercentage && (isNaN(salaryStructure.hraPercentage) || parseFloat(salaryStructure.hraPercentage) < 0 || parseFloat(salaryStructure.hraPercentage) > 100)) {
//       newErrors.hraPercentage = "HRA Percentage must be between 0 and 100";
//     }
//     if (!salaryStructure.specialAllowances) newErrors.specialAllowances = "Special Allowances is required";
//     if (salaryStructure.specialAllowances && (isNaN(salaryStructure.specialAllowances) || parseFloat(salaryStructure.specialAllowances) < 0)) {
//       newErrors.specialAllowances = "Special Allowances must be a non-negative number";
//     }
//     if (!salaryStructure.pfPercentage) newErrors.pfPercentage = "PF Percentage is required";
//     if (salaryStructure.pfPercentage && (isNaN(salaryStructure.pfPercentage) || parseFloat(salaryStructure.pfPercentage) < 0 || parseFloat(salaryStructure.pfPercentage) > 100)) {
//       newErrors.pfPercentage = "PF Percentage must be between 0 and 100";
//     }
//     if (salaryStructure.esiPercentage && (isNaN(salaryStructure.esiPercentage) || parseFloat(salaryStructure.esiPercentage) < 0 || parseFloat(salaryStructure.esiPercentage) > 100)) {
//       newErrors.esiPercentage = "ESI Percentage must be between 0 and 100";
//     }
//     if (!salaryStructure.bonus) newErrors.bonus = "Bonus is required";
//     if (salaryStructure.bonus && (isNaN(salaryStructure.bonus) || parseFloat(salaryStructure.bonus) < 0)) {
//       newErrors.bonus = "Bonus must be a non-negative number";
//     }
//     const basic = parseFloat(salaryStructure.basicSalary) || 0;
//     const gross = basic +
//                   parseFloat(salaryStructure.hraAmount || 0) +
//                   parseFloat(salaryStructure.specialAllowances || 0) +
//                   parseFloat(salaryStructure.bonus || 0);
//     if (basic <= 15000 && parseFloat(salaryStructure.pfPercentage) !== 12) {
//       newErrors.pfPercentage = "PF must be 12% for basic salary ≤ ₹15,000";
//     }
//     if (gross > 21000 && parseFloat(salaryStructure.esiPercentage) > 0) {
//       newErrors.esiPercentage = "ESI not applicable for gross salary > ₹21,000";
//     }
//     if (gross <= 21000 && parseFloat(salaryStructure.esiPercentage) !== 0.75) {
//       newErrors.esiPercentage = "ESI must be 0.75% for employee contribution";
//     }
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length > 0) {
//       setErrors(formErrors);
//       setIsSubmitting(false);
//       toast.error("Please fix the errors before submitting");
//       return;
//     }

//     const userToken = localStorage.getItem("userToken");
//     if (!userToken) {
//       console.error("No userToken found in localStorage");
//       toast.error("No authentication token found. Please log in.");
//       navigate("/login");
//       setIsSubmitting(false);
//       return;
//     }

//     let token;
//     try {
//       const parsedToken = JSON.parse(userToken);
//       token = parsedToken.token;
//       if (!token) {
//         console.error("Invalid token format in userToken");
//         toast.error("Invalid token format. Please log in again.");
//         navigate("/login");
//         setIsSubmitting(false);
//         return;
//       }
//     } catch (parseError) {
//       console.error("Error parsing userToken:", parseError);
//       toast.error("Invalid token format. Please log in again.");
//       navigate("/login");
//       setIsSubmitting(false);
//       return;
//     }

//     const formData = {
//       employee_id: employeeId,
//       basic_salary: parseFloat(salaryStructure.basicSalary),
//       hra_percentage: parseFloat(salaryStructure.hraPercentage) || 0,
//       hra_amount: parseFloat(salaryStructure.hraAmount) || 0,
//       special_allowances: parseFloat(salaryStructure.specialAllowances) || 0, // Changed to plural
//       pf_percentage: parseFloat(salaryStructure.pfPercentage) || 0,
//       pf_amount: parseFloat(salaryStructure.pfAmount) || 0,
//       esi_percentage: parseFloat(salaryStructure.esiPercentage) || 0,
//       esi_amount: parseFloat(salaryStructure.esiAmount) || 0,
//       bonus: parseFloat(salaryStructure.bonus) || 0,
//     };

//     console.log("Submitting salary structure:", formData);

//     try {
//       const resultAction = await dispatch(createSalaryStructure(formData));
//       console.log("createSalaryStructure result:", resultAction);
//       if (createSalaryStructure.fulfilled.match(resultAction)) {
//         toast.success("Salary structure created successfully");
//         setSalaryStructure({
//           basicSalary: "",
//           hraPercentage: "",
//           hraAmount: "",
//           specialAllowances: "",
//           pfPercentage: "12",
//           pfAmount: "",
//           esiPercentage: "0.75",
//           esiAmount: "",
//           bonus: "",
//         });
//         setErrors({});
//       } else {
//         throw new Error(resultAction.payload || "Failed to create salary structure");
//       }
//     } catch (err) {
//       console.error("createSalaryStructure error:", err.message);
//       toast.error(err.message);
//       setErrors({ submit: err.message });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <svg
//           className="animate-spin h-8 w-8 text-teal-600"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//         >
//           <circle
//             className="opacity-25"
//             cx="12"
//             cy="12"
//             r="10"
//             stroke="currentColor"
//             strokeWidth="4"
//           ></circle>
//           <path
//             className="opacity-75"
//             fill="currentColor"
//             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//           ></path>
//         </svg>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <div className="hidden sm:flex sm:justify-end mb-4">
//         <PageBreadcrumb
//           items={[
//             { label: "Home", link: "/admin/dashboard" },
//             { label: "Employees", link: "/admin/employees" },
//             { label: "Add Salary Structure", link: `/admin/employee/${employeeId}/salary-structure` },
//           ]}
//         />
//         <PageMeta title="Add Salary Structure" description="Add salary structure for an employee" />
//       </div>
//       <div className="min-h-screen bg-white rounded-2xl p-4 sm:p-6">
//         <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 relative z-10">
//           <h2 className="text-xl pt-3 sm:pt-0 sm:text-3xl font-bold text-center text-teal-600 mb-8 sm:mb-10 uppercase tracking-tight">
//             Add Salary Structure
//           </h2>
//           {error && (
//             <div className="text-center text-red-600 mb-4">
//               <p>{error}</p>
//               <button
//                 onClick={() => navigate("/admin/employees")}
//                 className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
//               >
//                 Back to Employees
//               </button>
//             </div>
//           )}
//           {successMessage && !isSubmitting && (
//             <p className="text-green-600 text-center mb-4">{successMessage}</p>
//           )}
//           {errors.submit && (
//             <p className="text-red-600 text-center mb-4">{errors.submit}</p>
//           )}
//           <div className="mb-6 p-4 bg-teal-50 rounded-xl">
//             <h3 className="text-lg font-semibold text-teal-700 mb-2">Real-Time Salary Breakdown</h3>
//             <p>Gross Salary: ₹{realTimeCalculations.grossSalary}</p>
//             <p>Total Deductions (PF + ESI): ₹{realTimeCalculations.totalDeductions}</p>
//             <p>Net Salary: ₹{realTimeCalculations.netSalary}</p>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
//             <div className="space-y-4 sm:space-y-6">
//               {[
//                 { label: "Basic Salary", field: "basicSalary", type: "number", required: true, tooltip: "Monthly basic salary" },
//                 { label: "HRA Percentage", field: "hraPercentage", type: "number", required: true, tooltip: "Percentage of basic salary (e.g., 40 for 40%)" },
//                 { label: "HRA Amount", field: "hraAmount", type: "number", readOnly: true, tooltip: "Auto-calculated based on HRA percentage" },
//                 { label: "Special Allowances", field: "specialAllowances", type: "number", required: true, tooltip: "Additional monthly allowance" },
//                 { label: "PF Percentage", field: "pfPercentage", type: "number", required: true, tooltip: "Percentage of basic salary (default: 12%)" },
//                 { label: "PF Amount", field: "pfAmount", type: "number", readOnly: true, tooltip: "Auto-calculated based on PF percentage" },
//                 { label: "ESI Percentage", field: "esiPercentage", type: "number", tooltip: "Percentage of gross salary (default: 0.75%)" },
//                 { label: "ESI Amount", field: "esiAmount", type: "number", readOnly: true, tooltip: "Auto-calculated based on ESI percentage" },
//                 { label: "Bonus", field: "bonus", type: "number", required: true, tooltip: "Monthly bonus amount" },
//               ].map(({ label, field, type, required, tooltip, readOnly }) => (
//                 <div key={field} className="relative group z-10">
//                   <label className="block text-sm font-medium text-gray-900 mb-2">
//                     {label} {required && <span className="text-red-600 font-bold">*</span>}
//                     {tooltip && (
//                       <span className="ml-1 text-gray-400 cursor-help" title={tooltip}>
//                         ⓘ
//                       </span>
//                     )}
//                   </label>
//                   <input
//                     type={type}
//                     value={salaryStructure[field]}
//                     onChange={(e) => handleInput(field, e.target.value)}
//                     readOnly={readOnly}
//                     required={required}
//                     className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
//                       errors[field] ? "border-red-500 animate-pulse" : ""
//                     } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                     aria-label={label}
//                   />
//                   {errors[field] && (
//                     <p className="mt-1 text-sm text-red-600 font-medium">{errors[field]}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-end pt-6 relative z-50">
//               <button
//                 type="submit"
//                 className={`text-base sm:text-lg px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center z-50 ${
//                   isSubmitting ? "opacity-70 cursor-not-allowed" : ""
//                 }`}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg
//                       className="animate-spin h-5 w-5 mr-2 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Saving...
//                   </>
//                 ) : (
//                   "Save Salary Structure"
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeSalaryStructure;