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
  hdmcBadge: {
    en: "Hubli-Dharwad Municipal Corporation",
    hi: "हुबली-धारवाड़ नगर निगम",
    kn: "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ಮಹಾನಗರ ಪಾಲಿಕೆ"
  },
  civicSenseParagraph: {
    en: "is the foundation of a thriving community. It means taking responsibility for our shared spaces—keeping our streets clean, respecting public property, following traffic rules, and being considerate neighbors. When each citizen contributes to the well-being of their city, we create safer, cleaner, and more harmonious environments for everyone. Together, let's build a city we're proud to call home.",
    hi: "एक समृद्ध समुदाय की नींव है। इसका मतलब है हमारे साझा स्थानों की जिम्मेदारी लेना—हमारी सड़कों को साफ रखना, सार्वजनिक संपत्ति का सम्मान करना, यातायात नियमों का पालन करना और विचारशील पड़ोसी बनना। जब प्रत्येक नागरिक अपने शहर की भलाई में योगदान देता है, तो हम सभी के लिए सुरक्षित, स्वच्छ और अधिक सामंजस्यपूर्ण वातावरण बनाते हैं। आइए मिलकर एक ऐसा शहर बनाएं जिसे हम गर्व से अपना घर कह सकें।",
    kn: "ಅಭಿವೃದ್ಧಿ ಹೊಂದುತ್ತಿರುವ ಸಮುದಾಯದ ಅಡಿಪಾಯವಾಗಿದೆ. ಇದರರ್ಥ ನಮ್ಮ ಹಂಚಿಕೆಯ ಸ್ಥಳಗಳ ಜವಾಬ್ದಾರಿ ತೆಗೆದುಕೊಳ್ಳುವುದು—ನಮ್ಮ ಬೀದಿಗಳನ್ನು ಸ್ವಚ್ಛವಾಗಿಡುವುದು, ಸಾರ್ವಜನಿಕ ಆಸ್ತಿಯನ್ನು ಗೌರವಿಸುವುದು, ಸಂಚಾರ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸುವುದು ಮತ್ತು ಪರಿಗಣಿಸುವ ನೆರೆಹೊರೆಯವರಾಗಿರುವುದು. ಪ್ರತಿ ನಾಗರಿಕರು ತಮ್ಮ ನಗರದ ಒಳಿತಿಗೆ ಕೊಡುಗೆ ನೀಡಿದಾಗ, ನಾವು ಎಲ್ಲರಿಗೂ ಸುರಕ್ಷಿತ, ಸ್ವಚ್ಛ ಮತ್ತು ಹೆಚ್ಚು ಸಾಮರಸ್ಯದ ವಾತಾವರಣವನ್ನು ಸೃಷ್ಟಿಸುತ್ತೇವೆ. ಒಟ್ಟಾಗಿ, ನಾವು ಹೆಮ್ಮೆಯಿಂದ ಮನೆ ಎಂದು ಕರೆಯುವ ನಗರವನ್ನು ನಿರ್ಮಿಸೋಣ."
  },
  civicSenseLabel: {
    en: "Civic Sense",
    hi: "नागरिक बोध",
    kn: "ನಾಗರಿಕ ಪ್ರಜ್ಞೆ"
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
  feedbackMatters: {
    en: "Your valuable feedback matters to us!",
    hi: "आपकी बहुमूल्य प्रतिक्रिया हमारे लिए महत्वपूर्ण है!",
    kn: "ನಿಮ್ಮ ಅಮೂಲ್ಯ ಪ್ರತಿಕ್ರಿಯೆ ನಮಗೆ ಮುಖ್ಯವಾಗಿದೆ!"
  },
  feedbackButton: {
    en: "Give Feedback",
    hi: "प्रतिक्रिया दें",
    kn: "ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿ"
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

  // Auth
  login: {
    en: "Login",
    hi: "लॉगिन",
    kn: "ಲಾಗಿನ್"
  },
  signup: {
    en: "Sign Up",
    hi: "साइन अप",
    kn: "ಸೈನ್ ಅಪ್"
  },
  logout: {
    en: "Log Out",
    hi: "लॉग आउट",
    kn: "ಲಾಗ್ ಔಟ್"
  },
  username: {
    en: "Username",
    hi: "उपयोगकर्ता नाम",
    kn: "ಬಳಕೆದಾರ ಹೆಸರು"
  },
  password: {
    en: "Password",
    hi: "पासवर्ड",
    kn: "ಪಾಸ್‌ವರ್ಡ್"
  },
  confirmPassword: {
    en: "Confirm Password",
    hi: "पासवर्ड की पुष्टि करें",
    kn: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ"
  },
  enterUsername: {
    en: "Enter your username",
    hi: "अपना उपयोगकर्ता नाम दर्ज करें",
    kn: "ನಿಮ್ಮ ಬಳಕೆದಾರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ"
  },
  enterPassword: {
    en: "Enter your password",
    hi: "अपना पासवर्ड दर्ज करें",
    kn: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ"
  },
  chooseUsername: {
    en: "Choose a username",
    hi: "एक उपयोगकर्ता नाम चुनें",
    kn: "ಬಳಕೆದಾರ ಹೆಸರನ್ನು ಆಯ್ಕೆಮಾಡಿ"
  },
  createPassword: {
    en: "Create a password",
    hi: "एक पासवर्ड बनाएं",
    kn: "ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ"
  },
  createAccount: {
    en: "Create Account",
    hi: "खाता बनाएं",
    kn: "ಖಾತೆ ರಚಿಸಿ"
  },
  welcomeBack: {
    en: "Welcome",
    hi: "स्वागत है",
    kn: "ಸ್ವಾಗತ"
  },
  authSubtitle: {
    en: "Login or create an account to report issues",
    hi: "समस्याओं की रिपोर्ट करने के लिए लॉगिन करें या खाता बनाएं",
    kn: "ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಲು ಲಾಗಿನ್ ಮಾಡಿ ಅಥವಾ ಖಾತೆ ರಚಿಸಿ"
  },
  usernameHint: {
    en: "At least 3 characters",
    hi: "कम से कम 3 अक्षर",
    kn: "ಕನಿಷ್ಠ 3 ಅಕ್ಷರಗಳು"
  },
  loginSuccess: {
    en: "Logged in successfully!",
    hi: "सफलतापूर्वक लॉगिन किया!",
    kn: "ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ!"
  },
  signupSuccess: {
    en: "Account created successfully!",
    hi: "खाता सफलतापूर्वक बनाया गया!",
    kn: "ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!"
  },
  passwordMismatch: {
    en: "Passwords do not match",
    hi: "पासवर्ड मेल नहीं खाते",
    kn: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ"
  },
  viewMyIssues: {
    en: "View My Issues",
    hi: "मेरी समस्याएं देखें",
    kn: "ನನ್ನ ಸಮಸ್ಯೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ"
  },
  myReportedIssues: {
    en: "My Reported Issues",
    hi: "मेरी रिपोर्ट की गई समस्याएं",
    kn: "ನಾನು ವರದಿ ಮಾಡಿದ ಸಮಸ್ಯೆಗಳು"
  },
  reportNew: {
    en: "Report New",
    hi: "नई रिपोर्ट",
    kn: "ಹೊಸ ವರದಿ"
  },
  noIssuesYet: {
    en: "No issues reported yet",
    hi: "अभी तक कोई समस्या रिपोर्ट नहीं की गई",
    kn: "ಇನ್ನೂ ಯಾವುದೇ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿಲ್ಲ"
  },
  noIssuesDesc: {
    en: "Start reporting civic issues to help improve your city",
    hi: "अपने शहर को बेहतर बनाने में मदद के लिए नागरिक समस्याओं की रिपोर्ट करना शुरू करें",
    kn: "ನಿಮ್ಮ ನಗರವನ್ನು ಸುಧಾರಿಸಲು ಸಹಾಯ ಮಾಡಲು ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ"
  },
  reportFirstIssue: {
    en: "Report Your First Issue",
    hi: "अपनी पहली समस्या रिपोर्ट करें",
    kn: "ನಿಮ್ಮ ಮೊದಲ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ"
  },
  loginRequired: {
    en: "Please login to continue",
    hi: "जारी रखने के लिए कृपया लॉगिन करें",
    kn: "ಮುಂದುವರಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ"
  },
  loginToReport: {
    en: "Login to Report Issue",
    hi: "समस्या रिपोर्ट करने के लिए लॉगिन करें",
    kn: "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಲು ಲಾಗಿನ್ ಮಾಡಿ"
  },
  loginToSupport: {
    en: "Login to support this issue",
    hi: "इस समस्या का समर्थन करने के लिए लॉगिन करें",
    kn: "ಈ ಸಮಸ್ಯೆಯನ್ನು ಬೆಂಬಲಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ"
  },
  viewDatabase: {
    en: "View Database",
    hi: "डेटाबेस देखें",
    kn: "ಡೇಟಾಬೇಸ್ ವೀಕ್ಷಿಸಿ"
  },
  // Feedback
  feedbackTitle: {
    en: "Rate the Resolution",
    hi: "समाधान को रेट करें",
    kn: "ಪರಿಹಾರವನ್ನು ರೇಟ್ ಮಾಡಿ"
  },
  feedbackDescription: {
    en: "Please rate your experience with how this issue was resolved",
    hi: "कृपया इस समस्या को कैसे हल किया गया उसके बारे में अपना अनुभव रेट करें",
    kn: "ಈ ಸಮಸ್ಯೆಯನ್ನು ಹೇಗೆ ಪರಿಹರಿಸಲಾಗಿದೆ ಎಂಬುದರ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನುಭವವನ್ನು ರೇಟ್ ಮಾಡಿ"
  },
  additionalComments: {
    en: "Additional Comments (Optional)",
    hi: "अतिरिक्त टिप्पणियाँ (वैकल्पिक)",
    kn: "ಹೆಚ್ಚುವರಿ ಕಾಮೆಂಟ್‌ಗಳು (ಐಚ್ಛಿಕ)"
  },
  feedbackCommentsPlaceholder: {
    en: "Share any additional feedback about the resolution...",
    hi: "समाधान के बारे में कोई अतिरिक्त प्रतिक्रिया साझा करें...",
    kn: "ಪರಿಹಾರದ ಬಗ್ಗೆ ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ..."
  },
  submitFeedback: {
    en: "Submit Feedback",
    hi: "प्रतिक्रिया जमा करें",
    kn: "ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿ"
  },
  feedbackSuccess: {
    en: "Thank you for your feedback!",
    hi: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
    kn: "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಗೆ ಧನ್ಯವಾದಗಳು!"
  },
  feedbackError: {
    en: "Failed to submit feedback. Please try again.",
    hi: "प्रतिक्रिया जमा करने में विफल। कृपया पुनः प्रयास करें।",
    kn: "ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
  },
  feedbackAlreadySubmitted: {
    en: "You have already submitted feedback for this issue.",
    hi: "आपने इस समस्या के लिए पहले ही प्रतिक्रिया जमा कर दी है।",
    kn: "ಈ ಸಮಸ್ಯೆಗಾಗಿ ನೀವು ಈಗಾಗಲೇ ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಿದ್ದೀರಿ."
  },
  rateFeedback: {
    en: "Rate Resolution",
    hi: "समाधान रेट करें",
    kn: "ಪರಿಹಾರವನ್ನು ರೇಟ್ ಮಾಡಿ"
  },
  cancel: {
    en: "Cancel",
    hi: "रद्द करें",
    kn: "ರದ್ದುಮಾಡಿ"
  },
  support: {
    en: "Support",
    hi: "समर्थन करें",
    kn: "ಬೆಂಬಲ"
  },
  rating: {
    en: "Rating",
    hi: "रेटिंग",
    kn: "ರೇಟಿಂಗ್"
  },
  feedbackSubmitted: {
    en: "Feedback Submitted",
    hi: "प्रतिक्रिया जमा हुई",
    kn: "ಪ್ರತಿಕ್ರಿಯೆ ಸಲ್ಲಿಸಲಾಗಿದೆ"
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
