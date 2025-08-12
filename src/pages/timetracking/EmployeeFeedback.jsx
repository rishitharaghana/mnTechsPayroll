import React, { useState } from "react";
import { Star, Send, MessageSquare, Camera, CheckCircle } from "lucide-react";

const EmployeeFeedback = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [visitType, setVisitType] = useState("");
  const [issues, setIssues] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [photos, setPhotos] = useState([]); // New state for uploaded photos

  const handleIssueToggle = (issue) => {
    setIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // Create a preview URL for the image
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => {
      const updatedPhotos = prev.filter((_, i) => i !== index);
      // Clean up the object URL to prevent memory leaks
      prev[index] && URL.revokeObjectURL(prev[index].preview);
      return updatedPhotos;
    });
  };

  const handleCameraClick = () => {
    // Placeholder for camera functionality
    alert(
      "Camera functionality requires navigator.mediaDevices.getUserMedia. Implement camera access here."
    );
    // Example (not implemented here due to complexity and permissions):
    // navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => { ... });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission with photos
    console.log({
      rating,
      feedback,
      visitType,
      issues,
      photos: photos.map((p) => p.file), // Send file objects to server
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      // Reset form
      setRating(0);
      setFeedback("");
      setVisitType("");
      setIssues([]);
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview)); // Clean up URLs
      setPhotos([]);
    }, 3000);
  };

  const issueOptions = [
    "Access difficulties",
    "Safety concerns",
    "Equipment issues",
    "Weather conditions",
    "Traffic problems",
    "Documentation missing",
  ];

  const visitTypes = [
    "Initial inspection",
    "Progress review",
    "Quality check",
    "Final inspection",
    "Client meeting",
    "Emergency visit",
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          Site Visit Feedback
        </h3>
        <p className="text-gray-600 text-sm">
          Share your experience to help us improve our processes
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-12">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Feedback Submitted Successfully!
          </h4>
          <p className="text-gray-600 text-sm">
            Thank you for your valuable feedback. HR has been notified and will
            review your input.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Visit Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Visit Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {visitTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVisitType(type)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-300 ${
                    visitType === type
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Overall Experience Rating
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform duration-200 hover:scale-105"
                >
                  <Star
                    className={`w-6 h-6 transition-colors duration-200 ${
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm font-medium text-gray-700">
                  {rating === 5
                    ? "Excellent"
                    : rating === 4
                    ? "Good"
                    : rating === 3
                    ? "Average"
                    : rating === 2
                    ? "Poor"
                    : "Very Poor"}
                </span>
              )}
            </div>
          </div>

          {/* Issues Encountered */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Issues Encountered (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {issueOptions.map((issue) => (
                <button
                  key={issue}
                  type="button"
                  onClick={() => handleIssueToggle(issue)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-300 ${
                    issues.includes(issue)
                      ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {issue}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Additional Comments
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-sm text-gray-900 placeholder-gray-500 transition-all duration-200"
              placeholder="Share any additional details..."
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Add Photos (Optional)
            </label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={handleCameraClick}
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-gray-600 hover:text-blue-600 text-sm"
              >
                <Camera className="w-5 h-5" />
                <span className="font-medium">Take Photo</span>
              </button>
              <label className="flex items-center justify-center space-x-2 px-4 py-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-gray-600 hover:text-blue-600 text-sm cursor-pointer">
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            {/* Image Previews */}
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-30 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r bg-teal-700  text-white py-2 px-4 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Send className="w-4 h-4 inline mr-2" />
              Submit Feedback
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmployeeFeedback;
