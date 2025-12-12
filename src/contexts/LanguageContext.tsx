import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'kn';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    kn: string;
  };
}

const translations: Translations = {
  // Header
  appName: {
    en: "HDMC Civic Eye",
    hi: "एचडीएमसी सिविक आई",
    kn: "ಎಚ್‌ಡಿಎಂಸಿ ಸಿವಿಕ್ ಐ"
  },
  tagline: {
    en: "Report. Track. Resolve.",
    hi: "रिपोर्ट करें। ट्रैक करें। समाधान करें।",
    kn: "ವರದಿ ಮಾಡಿ. ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. ಪರಿಹರಿಸಿ."
  },
  subtitle: {
    en: "Crowdsourced Civic Issue Reporting for Hubli-Dharwad",
    hi: "हुबली-धारवाड़ के लिए क्राउडसोर्स्ड नागरिक समस्या रिपोर्टिंग",
    kn: "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡಕ್ಕಾಗಿ ಕ್ರೌಡ್‌ಸೋರ್ಸ್ಡ್ ನಾಗರಿಕ ಸಮಸ್ಯೆ ವರದಿ"
  },

  // Navigation
  home: {
    en: "Home",
    hi: "होम",
    kn: "ಮುಖಪುಟ"
  },
  reportIssue: {
    en: "Report Issue",
    hi: "समस्या रिपोर्ट करें",
    kn: "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ"
  },
  viewIssues: {
    en: "View Issues",
    hi: "समस्याएं देखें",
    kn: "ಸಮಸ್ಯೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ"
  },

  // Report Form
  capturePhoto: {
    en: "Capture Photo",
    hi: "फोटो खींचें",
    kn: "ಫೋಟೋ ತೆಗೆಯಿರಿ"
  },
  retakePhoto: {
    en: "Retake Photo",
    hi: "फिर से फोटो खींचें",
    kn: "ಮತ್ತೆ ಫೋಟೋ ತೆಗೆಯಿರಿ"
  },
  selectCategory: {
    en: "Select Category",
    hi: "श्रेणी चुनें",
    kn: "ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ"
  },
  describeIssue: {
    en: "Describe the Issue",
    hi: "समस्या का वर्णन करें",
    kn: "ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ"
  },
  location: {
    en: "Location",
    hi: "स्थान",
    kn: "ಸ್ಥಳ"
  },
  detectingLocation: {
    en: "Detecting location...",
    hi: "स्थान का पता लगाया जा रहा है...",
    kn: "ಸ್ಥಳವನ್ನು ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ..."
  },
  submitReport: {
    en: "Submit Report",
    hi: "रिपोर्ट जमा करें",
    kn: "ವರದಿ ಸಲ್ಲಿಸಿ"
  },

  // Categories
  roads: {
    en: "Roads & Potholes",
    hi: "सड़कें और गड्ढे",
    kn: "ರಸ್ತೆಗಳು ಮತ್ತು ಗುಂಡಿಗಳು"
  },
  drainage: {
    en: "Drainage & Sewage",
    hi: "जल निकासी और मल",
    kn: "ಒಳಚರಂಡಿ ಮತ್ತು ಒಳಚರಂಡಿ"
  },
  garbage: {
    en: "Garbage & Cleanliness",
    hi: "कचरा और स्वच्छता",
    kn: "ಕಸ ಮತ್ತು ಸ್ವಚ್ಛತೆ"
  },
  streetlights: {
    en: "Street Lights",
    hi: "स्ट्रीट लाइट",
    kn: "ಬೀದಿ ದೀಪಗಳು"
  },
  water: {
    en: "Water Supply",
    hi: "जल आपूर्ति",
    kn: "ನೀರು ಪೂರೈಕೆ"
  },
  encroachment: {
    en: "Encroachment",
    hi: "अतिक्रमण",
    kn: "ಅತಿಕ್ರಮಣ"
  },
  other: {
    en: "Other",
    hi: "अन्य",
    kn: "ಇತರೆ"
  },

  // Issue Card
  likes: {
    en: "Likes",
    hi: "लाइक्स",
    kn: "ಲೈಕ್‌ಗಳು"
  },
  reports: {
    en: "Reports",
    hi: "रिपोर्ट्स",
    kn: "ವರದಿಗಳು"
  },
  likeThis: {
    en: "Support",
    hi: "समर्थन करें",
    kn: "ಬೆಂಬಲ"
  },
  reReport: {
    en: "Re-report",
    hi: "पुनः रिपोर्ट",
    kn: "ಮರು-ವರದಿ"
  },
  status: {
    en: "Status",
    hi: "स्थिति",
    kn: "ಸ್ಥಿತಿ"
  },
  pending: {
    en: "Pending",
    hi: "लंबित",
    kn: "ಬಾಕಿ ಉಳಿದಿದೆ"
  },
  inProgress: {
    en: "In Progress",
    hi: "प्रगति में",
    kn: "ಪ್ರಗತಿಯಲ್ಲಿದೆ"
  },
  resolved: {
    en: "Resolved",
    hi: "हल किया गया",
    kn: "ಪರಿಹರಿಸಲಾಗಿದೆ"
  },
  reportedBy: {
    en: "Reported by",
    hi: "द्वारा रिपोर्ट किया गया",
    kn: "ವರದಿ ಮಾಡಿದವರು"
  },
  assignedTo: {
    en: "Assigned to",
    hi: "को सौंपा गया",
    kn: "ನಿಯೋಜಿಸಲಾಗಿದೆ"
  },

  // Hero Section
  heroTitle: {
    en: "Your Voice Matters",
    hi: "आपकी आवाज़ मायने रखती है",
    kn: "ನಿಮ್ಮ ಧ್ವನಿ ಮುಖ್ಯ"
  },
  heroSubtitle: {
    en: "Report civic issues in Hubli-Dharwad with a simple photo. Together, let's build a better city.",
    hi: "एक साधारण फोटो के साथ हुबली-धारवाड़ में नागरिक समस्याओं की रिपोर्ट करें। आइए मिलकर एक बेहतर शहर बनाएं।",
    kn: "ಸರಳ ಫೋಟೋದೊಂದಿಗೆ ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡದಲ್ಲಿ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ. ಒಟ್ಟಿಗೆ, ಉತ್ತಮ ನಗರವನ್ನು ನಿರ್ಮಿಸೋಣ."
  },
  startReporting: {
    en: "Start Reporting",
    hi: "रिपोर्टिंग शुरू करें",
    kn: "ವರದಿ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ"
  },

  // Stats
  issuesReported: {
    en: "Issues Reported",
    hi: "रिपोर्ट की गई समस्याएं",
    kn: "ವರದಿ ಮಾಡಲಾದ ಸಮಸ್ಯೆಗಳು"
  },
  issuesResolved: {
    en: "Issues Resolved",
    hi: "हल की गई समस्याएं",
    kn: "ಪರಿಹರಿಸಿದ ಸಮಸ್ಯೆಗಳು"
  },
  activeCitizens: {
    en: "Active Citizens",
    hi: "सक्रिय नागरिक",
    kn: "ಸಕ್ರಿಯ ನಾಗರಿಕರು"
  },

  // Footer
  poweredBy: {
    en: "Powered by Citizens of Hubli-Dharwad",
    hi: "हुबली-धारवाड़ के नागरिकों द्वारा संचालित",
    kn: "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡದ ನಾಗರಿಕರಿಂದ ನಡೆಸಲ್ಪಡುತ್ತದೆ"
  },

  // Messages
  reportSuccess: {
    en: "Report submitted successfully! Officials have been notified.",
    hi: "रिपोर्ट सफलतापूर्वक जमा की गई! अधिकारियों को सूचित कर दिया गया है।",
    kn: "ವರದಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ! ಅಧಿಕಾರಿಗಳಿಗೆ ತಿಳಿಸಲಾಗಿದೆ."
  },
  likeSuccess: {
    en: "Thanks for your support! This helps prioritize the issue.",
    hi: "आपके समर्थन के लिए धन्यवाद! इससे समस्या को प्राथमिकता देने में मदद मिलती है।",
    kn: "ನಿಮ್ಮ ಬೆಂಬಲಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು! ಇದು ಸಮಸ್ಯೆಗೆ ಆದ್ಯತೆ ನೀಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ."
  },
  reReportSuccess: {
    en: "Re-reported successfully! The issue has been escalated.",
    hi: "सफलतापूर्वक पुनः रिपोर्ट किया गया! समस्या को आगे बढ़ाया गया है।",
    kn: "ಯಶಸ್ವಿಯಾಗಿ ಮರು-ವರದಿ ಮಾಡಲಾಗಿದೆ! ಸಮಸ್ಯೆಯನ್ನು ಉಲ್ಬಣಗೊಳಿಸಲಾಗಿದೆ."
  },

  // Recent Issues
  recentIssues: {
    en: "Recent Issues",
    hi: "हाल की समस्याएं",
    kn: "ಇತ್ತೀಚಿನ ಸಮಸ್ಯೆಗಳು"
  },
  viewAll: {
    en: "View All",
    hi: "सभी देखें",
    kn: "ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ"
  },

  // Camera
  allowCamera: {
    en: "Please allow camera access to capture issues",
    hi: "समस्याओं को कैप्चर करने के लिए कृपया कैमरा एक्सेस की अनुमति दें",
    kn: "ಸಮಸ್ಯೆಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ದಯವಿಟ್ಟು ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ"
  },
  cameraError: {
    en: "Unable to access camera. Please check permissions.",
    hi: "कैमरा एक्सेस करने में असमर्थ। कृपया अनुमतियां जांचें।",
    kn: "ಕ್ಯಾಮೆರಾವನ್ನು ಪ್ರವೇಶಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಅನುಮತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."
  },

  // Filters
  all: {
    en: "All",
    hi: "सभी",
    kn: "ಎಲ್ಲಾ"
  },
  filterByCategory: {
    en: "Filter by Category",
    hi: "श्रेणी के अनुसार फ़िल्टर करें",
    kn: "ವರ್ಗದ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ"
  },
  filterByStatus: {
    en: "Filter by Status",
    hi: "स्थिति के अनुसार फ़िल्टर करें",
    kn: "ಸ್ಥಿತಿಯ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ"
  },
  sortBy: {
    en: "Sort by",
    hi: "इसके अनुसार क्रमबद्ध करें",
    kn: "ಇದರ ಪ್ರಕಾರ ವಿಂಗಡಿಸಿ"
  },
  mostRecent: {
    en: "Most Recent",
    hi: "सबसे हाल का",
    kn: "ಅತ್ಯಂತ ಇತ್ತೀಚಿನ"
  },
  mostLiked: {
    en: "Most Supported",
    hi: "सबसे अधिक समर्थित",
    kn: "ಹೆಚ್ಚು ಬೆಂಬಲಿತ"
  },

  // How it works
  howItWorks: {
    en: "How It Works",
    hi: "यह कैसे काम करता है",
    kn: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ"
  },
  step1Title: {
    en: "Capture the Issue",
    hi: "समस्या को कैप्चर करें",
    kn: "ಸಮಸ್ಯೆಯನ್ನು ಸೆರೆಹಿಡಿಯಿರಿ"
  },
  step1Desc: {
    en: "Take a photo of the civic issue. Location is automatically detected.",
    hi: "नागरिक समस्या की फोटो लें। स्थान स्वचालित रूप से पता लगाया जाता है।",
    kn: "ನಾಗರಿಕ ಸಮಸ್ಯೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ. ಸ್ಥಳವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತದೆ."
  },
  step2Title: {
    en: "Submit Report",
    hi: "रिपोर्ट जमा करें",
    kn: "ವರದಿ ಸಲ್ಲಿಸಿ"
  },
  step2Desc: {
    en: "Select category and add description. Report goes to HDMC officials.",
    hi: "श्रेणी चुनें और विवरण जोड़ें। रिपोर्ट HDMC अधिकारियों को जाती है।",
    kn: "ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ವಿವರಣೆ ಸೇರಿಸಿ. ವರದಿ HDMC ಅಧಿಕಾರಿಗಳಿಗೆ ಹೋಗುತ್ತದೆ."
  },
  step3Title: {
    en: "Community Action",
    hi: "सामुदायिक कार्रवाई",
    kn: "ಸಮುದಾಯ ಕ್ರಮ"
  },
  step3Desc: {
    en: "Others can like or re-report to boost priority. Track resolution progress.",
    hi: "अन्य लोग प्राथमिकता बढ़ाने के लिए लाइक या री-रिपोर्ट कर सकते हैं। समाधान की प्रगति ट्रैक करें।",
    kn: "ಇತರರು ಆದ್ಯತೆಯನ್ನು ಹೆಚ್ಚಿಸಲು ಲೈಕ್ ಅಥವಾ ಮರು-ವರದಿ ಮಾಡಬಹುದು. ಪರಿಹಾರ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ."
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
