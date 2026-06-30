/**
 * Antidote+ — shared trilingual strings.
 *
 * Extracted from AntidotePlus_Routing.jsx and extended for the rest of the
 * app. Only decision-critical labels are translated; some longer explanatory
 * copy stays English with a clear marker (see firstAid.note / tracker.note).
 *
 * Pattern (unchanged from the routing file): components do
 *     const t = T[language];
 * then read `t.xxx` (routing keys, kept flat) or `t.section.xxx` (new screens).
 *
 * Languages: te (Telugu, default), hi (Hindi), en (English).
 */
export const LANGS = ["te", "hi", "en"];

/** Short label shown in the header language toggle. */
export const LANG_LABEL = { te: "తె", hi: "हि", en: "EN" };

export const T = {
  en: {
    // ── Routing screen (extracted verbatim — do not rename these keys) ──
    tag: "AI Snakebite Emergency Network",
    bitten: "Bitten", ago: "min ago", victim: "Victim location",
    severity: "Symptom severity", mild: "Mild", moderate: "Moderate", severe: "Severe",
    sevHint: { mild: "Local pain & swelling", moderate: "Spreading swelling, nausea", severe: "Breathing / bleeding / drooping eyelids" },
    goHere: "Go to this hospital", hasAsv: "Antivenom in stock",
    nearestTrap: "Nearest — but no antivenom", wouldWaste: "Going here wastes",
    away: "away", eta: "ETA by road", vials: "ASV vials", updated: "Stock updated",
    confirmBtn: "Confirm & alert hospital", confirming: "Alerting hospital…",
    confirmed: "Hospital confirmed", reserved: "vials reserved for you",
    startNav: "Start navigation", shareLoc: "Share live location", callHosp: "Call hospital",
    locShared: "Live location & symptoms shared", otherOpts: "Other facilities with stock",
    dontChase: "Don't chase the snake",
    dontChaseBody: "Treatment is based on your symptoms, not the species. Antivenom in India is polyvalent — it covers the four major venomous snakes (the Big Four). It does not cover every species well. Photograph it only if completely safe.",
    trust: "Stock updated by hospital staff & ASHA workers. Demo inventory across Vikarabad district.",
    limited: "Limited — can stabilise, may refer onward", stale: "needs reconfirmation",
    reserving: "Reserving antivenom", relaying: "Relaying your symptoms & location",
    minsFurther: "further than the nearest clinic — but treatment is guaranteed here",
    icu: "ICU", phc: "Primary Health Centre", chc: "Community Health Centre",
    ah: "Area Hospital", dh: "District Hospital", tertiary: "Tertiary Hospital",

    // ── Bottom navigation ──
    nav: { emergency: "Emergency", tracker: "Tracker", sos: "SOS", help: "Help" },

    // ── Shared / common ──
    common: {
      retry: "Try again", loading: "Loading…", back: "Back", skip: "Skip",
      next: "Next", done: "Done", min: "min", sinceBite: "since bite",
      noData: "Nothing yet", cached: "cached", lastKnown: "last known",
      assistedNote: "AI-assisted, not a diagnosis",
      startOver: "Start over",
      startOverConfirm: "Clear this emergency and start over?",
      startOverYes: "Clear",
    },

    // ── Home / emergency landing ──
    home: {
      bittenBtn: "I've been bitten",
      reassure: "Stay calm. Most bites are survivable with fast treatment.",
      locating: "Finding your location…",
      locOk: "Location captured",
      locDenied: "Location unavailable — enter your village",
      locManual: "Enter location manually",
      villagePlaceholder: "Village / town name",
      useLoc: "Use this location",
      learn: "Learn & prevent",
      learnHint: "Snakebite risk near you, safety tips",
      start: "Start emergency",
    },

    // ── Snake capture ──
    snake: {
      title: "Snake photo (optional)",
      subtitle: "AI-assisted image analysis — a helper, not the main step.",
      take: "Take / upload photo",
      analyzing: "Analyzing image…",
      skip: "Skip — I didn't see the snake",
      guess: "Tentative guess", confidence: "confidence", venomous: "Venomous",
      assumeVenom: "Treat as venomous. Seek treatment now.",
      assumeVenomBody: "The photo was unclear or the snake is uncertain. The safe default is always to assume the bite is venomous and get to antivenom fast.",
      retake: "Retake photo", continueAid: "Continue to first aid",
      safetyFirst: "Only photograph the snake if you are completely safe. Never approach or chase it.",
      continueTracker: "Continue → severity tracker",
      analyzeFailed: "Couldn't analyze the image",
      lowConfidence: "Low confidence — not naming a species",
      cleared: "Photo cleared",
    },

    // ── First aid ──
    firstAid: {
      title: "First aid — do this now",
      timeSince: "Time since bite",
      notStarted: "Open Home to start the emergency",
      doTitle: "DO", dontTitle: "DON'T — these can kill",
      findAsv: "Find antivenom now",
      continueSnake: "Continue → snake photo (optional)",
      skipPhoto: "Skip photo — go to tracker",
      doItems: [
        "Stay calm; reassure the person — panic speeds venom spread.",
        "Keep the bitten limb still — improvise a splint; keep it at or below heart level.",
        "Remove rings, watch, bangles and tight clothing near the bite (swelling will come).",
        "Note the exact bite time.",
        "Get to a stocked hospital fast.",
      ],
      dontItems: [
        "No tourniquet or tight band.",
        "No cutting the wound.",
        "No sucking out venom (mouth or device).",
        "No ice, no fire, no electric shock.",
        "No traditional remedies, no alcohol, no food.",
        "Don't try to catch or kill the snake.",
      ],
      note: "Follow these steps while moving toward treatment. (English shown for the full wording.)",
    },

    // ── Severity tracker ──
    tracker: {
      title: "Symptom tracker",
      subtitle: "Monitoring to share with the hospital — not a diagnosis.",
      nextCheck: "Next check in", checkNow: "Check now",
      startMonitoring: "Start 15-minute monitoring",
      round: "Check", level: "Severity",
      worsening: "Symptoms worsening since last check",
      stable: "Symptoms stable since last check",
      improving: "Symptoms easing since last check",
      summaryTitle: "Handover summary for the hospital",
      generating: "Writing summary…",
      regen: "Refresh summary",
      noLog: "No checks logged yet. Run the first check to begin monitoring.",
      submit: "Save this check",
      due: "Check due now",
      history: "Monitoring log",
      howDecided: "Any breathing, neuro or bleeding sign counts as severe.",
      firstCheck: "First check recorded",
      onDevice: "Generated on-device — works offline",
      draftBadge: "Draft generated locally — Gemini will enhance when online",
      geminiBadge: "Enhanced by Gemini",
      q: {
        swelling: "Is swelling spreading?",
        swellingOpts: { none: "None", local: "Local only", spreading: "Spreading up the limb" },
        breathing: "Any breathing difficulty?",
        vision: "Drooping eyelids, blurred or double vision?",
        bleeding: "Bleeding from gums, urine or bite site?",
        drowsy: "Drowsy or can't speak clearly?",
        yes: "Yes", no: "No",
      },
      note: "These checks help the hospital prepare. Always defer to clinical assessment.",
    },

    // ── SOS / family alert ──
    sos: {
      title: "SOS — alert family & hospital",
      subtitle: "Sends your live location, symptoms and time since bite.",
      contactTitle: "Emergency contact",
      noContact: "No contact saved",
      addContact: "Add emergency contact",
      namePlaceholder: "Name", phonePlaceholder: "Phone number",
      save: "Save contact",
      messagePreview: "Message preview",
      sendBtn: "Send alert",
      sending: "Sending alert…",
      sent: "Alert sent",
      sentBody: "Family and hospital have your live location and symptoms.",
      queued: "1 alert queued — will send when signal returns",
      timeSince: "Time since bite",
      viewHospital: "View as hospital",
      relayHospital: "Forwarded to", noHospitalYet: "No hospital chosen yet — open routing first.",
      edit: "Edit", regenerate: "Regenerate", recipient: "To",
      autoSend: "Will auto-send when back online",
    },

    // ── Hospital incoming-patient view ──
    hospital: {
      title: "Incoming snakebite alert",
      subtitle: "Simulated hospital view (read-only).",
      incoming: "INCOMING PATIENT",
      eta: "ETA", timeSince: "Time since bite", severityLabel: "Severity",
      summary: "Symptom summary", prepare: "Prepare", facility: "Facility",
      backToSos: "Back to SOS",
      prepareLine: (vials, icu) =>
        `${vials} ASV vials · emergency physician${icu ? " · ICU on standby" : ""}`,
    },

    // ── High-risk indicator (prevention) ──
    risk: {
      title: "High snakebite risk indicator",
      subtitle: "A general indicator for your area — not a forecast for you.",
      band: { low: "Low", medium: "Medium", high: "High" },
      bandLabel: "Risk band right now",
      guidance: {
        low: "Lower-risk window. Still wear shoes outdoors after dark.",
        medium: "Moderate risk. Use a torch at night and watch where you step.",
        high: "High season — use a torch and wear shoes after dark; keep this app one tap away.",
      },
      factors: "Based on", factorMonth: "Season", factorTime: "Time of day",
      factorDensity: "Local history",
      disclaimer: "This is a general indicator, not a prediction for any individual.",
    },

    // ── Offline ──
    offline: {
      banner: "You're offline — emergency features still work",
      cachedStock: "Hospital stock shows last cached values.",
    },

    // ── Resume saved session (§P1) ──
    resume: {
      title: "Emergency in progress",
      body: "Saved on this device. Pick up where you left off.",
      resumeBtn: "Resume",
      discardBtn: "Start over",
      lastStep: "Last step",
      sinceBite: "since bite",
      steps: {
        "/first-aid": "First aid",
        "/snake": "Snake photo",
        "/tracker": "Symptom tracker",
        "/routing": "Find antivenom",
        "/sos": "SOS alert",
        "/hospital": "Hospital view",
      },
    },

    // ── Live GPS navigation (§P2) ──
    navigation: {
      bannerTitle: "Emergency Navigation Active",
      to: "To",
      speed: "Speed",
      distanceLeft: "Distance left",
      arrival: "Arrival",
      eta: "ETA",
      coords: "Your coordinates",
      accuracy: "Accuracy",
      kmh: "km/h",
      recalculating: "Route updated",
      acquiring: "Getting GPS signal…",
      lastKnownNote: "Showing last known location",
      end: "End navigation",
      arrivedTitle: "You have arrived",
      arrivedBody: "Walk in and show this screen to the staff.",
      permTitle: "Location permission needed",
      permBody:
        "Allow location to navigate. Open Settings → Apps → Antidote+ → Permissions → Location → Allow.",
      permRetry: "Enable & retry",
      enableLocation: "Enable Location",
      locationRequired: "Location access required",
      gpsTitle: "Searching for GPS…",
      gpsBody: "Move into the open if you can. Retrying automatically.",
      retry: "Retry",
    },
  },

  hi: {
    tag: "एआई सर्पदंश आपातकालीन नेटवर्क",
    bitten: "काटा", ago: "मिनट पहले", victim: "रोगी का स्थान",
    severity: "लक्षण की गंभीरता", mild: "हल्का", moderate: "मध्यम", severe: "गंभीर",
    sevHint: { mild: "स्थानीय दर्द व सूजन", moderate: "फैलती सूजन, मतली", severe: "साँस / रक्तस्राव / पलकें झुकना" },
    goHere: "इस अस्पताल जाएँ", hasAsv: "एंटीवेनम उपलब्ध",
    nearestTrap: "सबसे नज़दीक — पर एंटीवेनम नहीं", wouldWaste: "यहाँ जाने से बर्बाद होंगे",
    away: "दूर", eta: "सड़क मार्ग से समय", vials: "ASV शीशियाँ", updated: "स्टॉक अपडेट",
    confirmBtn: "पुष्टि करें व अस्पताल को सूचित करें", confirming: "अस्पताल को सूचित किया जा रहा…",
    confirmed: "अस्पताल ने पुष्टि की", reserved: "शीशियाँ आपके लिए सुरक्षित",
    startNav: "रास्ता शुरू करें", shareLoc: "लाइव लोकेशन भेजें", callHosp: "अस्पताल को कॉल करें",
    locShared: "लाइव लोकेशन व लक्षण भेजे गए", otherOpts: "स्टॉक वाले अन्य केंद्र",
    dontChase: "साँप का पीछा न करें",
    dontChaseBody: "इलाज प्रजाति पर नहीं, आपके लक्षणों पर आधारित है। भारत में एंटीवेनम पॉलीवैलेंट है — यह चार प्रमुख विषैले साँपों (बिग फोर) पर काम करता है। यह हर प्रजाति पर अच्छा असर नहीं करता। फोटो तभी लें जब पूरी तरह सुरक्षित हो।",
    trust: "स्टॉक अस्पताल कर्मी व आशा कार्यकर्ता अपडेट करते हैं। विकाराबाद ज़िले का डेमो डेटा।",
    limited: "सीमित — स्थिर कर सकते हैं, आगे रेफर संभव", stale: "पुनः पुष्टि आवश्यक",
    reserving: "एंटीवेनम सुरक्षित किया जा रहा", relaying: "आपके लक्षण व लोकेशन भेजे जा रहे",
    minsFurther: "नज़दीकी क्लिनिक से दूर — पर यहाँ इलाज निश्चित है",
    icu: "आईसीयू", phc: "प्राथमिक स्वास्थ्य केंद्र", chc: "सामुदायिक स्वास्थ्य केंद्र",
    ah: "क्षेत्रीय अस्पताल", dh: "ज़िला अस्पताल", tertiary: "तृतीयक अस्पताल",

    nav: { emergency: "आपातकाल", tracker: "ट्रैकर", sos: "एसओएस", help: "मदद" },

    common: {
      retry: "फिर से कोशिश करें", loading: "लोड हो रहा…", back: "वापस", skip: "छोड़ें",
      next: "आगे", done: "हो गया", min: "मिनट", sinceBite: "काटे जाने के बाद",
      noData: "अभी कुछ नहीं", cached: "कैश किया", lastKnown: "अंतिम ज्ञात",
      assistedNote: "एआई-सहायित, निदान नहीं",
      startOver: "नया शुरू",
      startOverConfirm: "इस आपातकाल को मिटाकर नया शुरू करें?",
      startOverYes: "मिटाएँ",
    },

    home: {
      bittenBtn: "मुझे साँप ने काटा है",
      reassure: "शांत रहें। तेज़ इलाज से अधिकांश काटने जानलेवा नहीं होते।",
      locating: "आपका स्थान खोजा जा रहा…",
      locOk: "स्थान दर्ज हुआ",
      locDenied: "स्थान उपलब्ध नहीं — अपना गाँव लिखें",
      locManual: "स्थान स्वयं लिखें",
      villagePlaceholder: "गाँव / कस्बे का नाम",
      useLoc: "यह स्थान उपयोग करें",
      learn: "जानें व बचाव",
      learnHint: "आपके पास सर्पदंश जोखिम, सुरक्षा सुझाव",
      start: "आपातकाल शुरू करें",
    },

    snake: {
      title: "साँप की फोटो (वैकल्पिक)",
      subtitle: "एआई-सहायित चित्र विश्लेषण — एक सहायक, मुख्य चरण नहीं।",
      take: "फोटो लें / अपलोड करें",
      analyzing: "चित्र का विश्लेषण…",
      skip: "छोड़ें — मैंने साँप नहीं देखा",
      guess: "अनुमानित पहचान", confidence: "विश्वास", venomous: "विषैला",
      assumeVenom: "विषैला मानें। अभी इलाज लें।",
      assumeVenomBody: "फोटो स्पष्ट नहीं थी या साँप अनिश्चित है। सुरक्षित नियम यही है कि काटने को विषैला मानें और जल्दी एंटीवेनम तक पहुँचें।",
      retake: "फिर फोटो लें", continueAid: "प्राथमिक उपचार पर जाएँ",
      safetyFirst: "साँप की फोटो तभी लें जब आप पूरी तरह सुरक्षित हों। उसके पास न जाएँ, पीछा न करें।",
      continueTracker: "आगे → लक्षण ट्रैकर",
      analyzeFailed: "चित्र का विश्लेषण नहीं हो सका",
      lowConfidence: "कम विश्वास — प्रजाति नहीं बता रहे",
      cleared: "फोटो हटाई गई",
    },

    firstAid: {
      title: "प्राथमिक उपचार — अभी करें",
      timeSince: "काटे जाने के बाद का समय",
      notStarted: "आपातकाल शुरू करने के लिए होम खोलें",
      doTitle: "करें", dontTitle: "न करें — ये जानलेवा हैं",
      findAsv: "अभी एंटीवेनम खोजें",
      continueSnake: "आगे → साँप की फोटो (वैकल्पिक)",
      skipPhoto: "फोटो छोड़ें — ट्रैकर पर जाएँ",
      doItems: [
        "शांत रहें; व्यक्ति को ढाढ़स दें — घबराहट से विष तेज़ी फैलता है।",
        "काटे अंग को स्थिर रखें — स्प्लिंट बनाएँ; उसे हृदय के स्तर पर या नीचे रखें।",
        "काटे स्थान के पास अंगूठी, घड़ी, चूड़ियाँ व तंग कपड़े हटाएँ (सूजन आएगी)।",
        "काटने का सही समय नोट करें।",
        "जल्दी से स्टॉक वाले अस्पताल पहुँचें।",
      ],
      dontItems: [
        "कोई टूर्निकेट या तंग पट्टी नहीं।",
        "घाव को न काटें।",
        "विष को न चूसें (मुँह या यंत्र से)।",
        "बर्फ नहीं, आग नहीं, बिजली का झटका नहीं।",
        "कोई देसी इलाज नहीं, शराब नहीं, भोजन नहीं।",
        "साँप को पकड़ने या मारने की कोशिश न करें।",
      ],
      note: "इलाज की ओर बढ़ते हुए ये चरण करें। (पूरी जानकारी अंग्रेज़ी में दिखाई गई है।)",
    },

    tracker: {
      title: "लक्षण ट्रैकर",
      subtitle: "अस्पताल को बताने के लिए निगरानी — निदान नहीं।",
      nextCheck: "अगली जाँच", checkNow: "अभी जाँचें",
      startMonitoring: "15-मिनट निगरानी शुरू करें",
      round: "जाँच", level: "गंभीरता",
      worsening: "पिछली जाँच से लक्षण बिगड़ रहे हैं",
      stable: "पिछली जाँच से लक्षण स्थिर हैं",
      improving: "पिछली जाँच से लक्षण कम हो रहे हैं",
      summaryTitle: "अस्पताल के लिए हैंडओवर सारांश",
      generating: "सारांश लिखा जा रहा…",
      regen: "सारांश ताज़ा करें",
      noLog: "अभी कोई जाँच नहीं। निगरानी शुरू करने के लिए पहली जाँच करें।",
      submit: "यह जाँच सहेजें",
      due: "जाँच अब करें",
      history: "निगरानी लॉग",
      howDecided: "साँस, तंत्रिका या रक्तस्राव का कोई भी संकेत = गंभीर।",
      firstCheck: "पहली जाँच दर्ज",
      onDevice: "डिवाइस पर बना — ऑफ़लाइन काम करता है",
      draftBadge: "ड्राफ़्ट स्थानीय रूप से बना — ऑनलाइन होने पर Gemini बेहतर करेगा",
      geminiBadge: "Gemini द्वारा बेहतर किया गया",
      q: {
        swelling: "क्या सूजन फैल रही है?",
        swellingOpts: { none: "नहीं", local: "केवल स्थानीय", spreading: "अंग में ऊपर फैल रही" },
        breathing: "साँस लेने में कठिनाई?",
        vision: "पलकें झुकना, धुंधला या दोहरा दिखना?",
        bleeding: "मसूड़ों, पेशाब या घाव से रक्तस्राव?",
        drowsy: "सुस्ती या साफ़ बोल नहीं पाना?",
        yes: "हाँ", no: "नहीं",
      },
      note: "ये जाँचें अस्पताल को तैयारी में मदद करती हैं। हमेशा चिकित्सकीय आकलन को प्राथमिकता दें।",
    },

    sos: {
      title: "एसओएस — परिवार व अस्पताल को सूचित करें",
      subtitle: "आपकी लाइव लोकेशन, लक्षण व काटे जाने का समय भेजता है।",
      contactTitle: "आपातकालीन संपर्क",
      noContact: "कोई संपर्क सहेजा नहीं",
      addContact: "आपातकालीन संपर्क जोड़ें",
      namePlaceholder: "नाम", phonePlaceholder: "फ़ोन नंबर",
      save: "संपर्क सहेजें",
      messagePreview: "संदेश पूर्वावलोकन",
      sendBtn: "अलर्ट भेजें",
      sending: "अलर्ट भेजा जा रहा…",
      sent: "अलर्ट भेजा गया",
      sentBody: "परिवार व अस्पताल के पास आपकी लाइव लोकेशन व लक्षण हैं।",
      queued: "1 अलर्ट कतार में — सिग्नल आते ही भेजेगा",
      timeSince: "काटे जाने के बाद का समय",
      viewHospital: "अस्पताल के रूप में देखें",
      relayHospital: "इन्हें भेजा गया", noHospitalYet: "अभी कोई अस्पताल नहीं चुना — पहले रूटिंग खोलें।",
      edit: "संपादित करें", regenerate: "फिर बनाएँ", recipient: "को",
      autoSend: "ऑनलाइन होते ही अपने-आप भेजेगा",
    },

    hospital: {
      title: "आने वाला सर्पदंश अलर्ट",
      subtitle: "नकली अस्पताल दृश्य (केवल पढ़ने के लिए)।",
      incoming: "आने वाला रोगी",
      eta: "पहुँचने का समय", timeSince: "काटे जाने के बाद", severityLabel: "गंभीरता",
      summary: "लक्षण सारांश", prepare: "तैयारी", facility: "केंद्र",
      backToSos: "एसओएस पर वापस",
      prepareLine: (vials, icu) =>
        `${vials} ASV शीशियाँ · आपातकालीन चिकित्सक${icu ? " · आईसीयू तैयार" : ""}`,
    },

    risk: {
      title: "सर्पदंश उच्च जोखिम सूचक",
      subtitle: "आपके क्षेत्र का सामान्य सूचक — आपके लिए पूर्वानुमान नहीं।",
      band: { low: "कम", medium: "मध्यम", high: "उच्च" },
      bandLabel: "अभी जोखिम स्तर",
      guidance: {
        low: "कम जोखिम का समय। फिर भी अंधेरे के बाद जूते पहनें।",
        medium: "मध्यम जोखिम। रात में टॉर्च लें और कदम देखकर रखें।",
        high: "उच्च मौसम — अंधेरे के बाद टॉर्च व जूते रखें; यह ऐप एक टैप दूर रखें।",
      },
      factors: "आधारित", factorMonth: "मौसम", factorTime: "दिन का समय",
      factorDensity: "स्थानीय इतिहास",
      disclaimer: "यह एक सामान्य सूचक है, किसी व्यक्ति के लिए पूर्वानुमान नहीं।",
    },

    offline: {
      banner: "आप ऑफ़लाइन हैं — आपातकालीन सुविधाएँ फिर भी काम करती हैं",
      cachedStock: "अस्पताल स्टॉक अंतिम कैश मान दिखा रहा है।",
    },

    // ── Resume saved session (§P1) ──
    resume: {
      title: "आपातकाल जारी है",
      body: "इस डिवाइस पर सहेजा गया। जहाँ छोड़ा था वहीं से जारी रखें।",
      resumeBtn: "जारी रखें",
      discardBtn: "नया शुरू",
      lastStep: "अंतिम चरण",
      sinceBite: "काटे जाने के बाद",
      steps: {
        "/first-aid": "प्राथमिक उपचार",
        "/snake": "साँप की फोटो",
        "/tracker": "लक्षण ट्रैकर",
        "/routing": "एंटीवेनम खोजें",
        "/sos": "एसओएस अलर्ट",
        "/hospital": "अस्पताल दृश्य",
      },
    },

    // ── Live GPS navigation (§P2) ──
    navigation: {
      bannerTitle: "आपातकालीन नेविगेशन सक्रिय",
      to: "गंतव्य",
      speed: "गति",
      distanceLeft: "शेष दूरी",
      arrival: "पहुँचना",
      eta: "अनुमानित समय",
      coords: "आपके निर्देशांक",
      accuracy: "सटीकता",
      kmh: "किमी/घं",
      recalculating: "मार्ग अपडेट हुआ",
      acquiring: "जीपीएस सिग्नल मिल रहा…",
      lastKnownNote: "अंतिम ज्ञात स्थान दिखा रहे",
      end: "नेविगेशन समाप्त करें",
      arrivedTitle: "आप पहुँच गए",
      arrivedBody: "अंदर जाएँ और यह स्क्रीन स्टाफ को दिखाएँ।",
      permTitle: "स्थान अनुमति आवश्यक",
      permBody:
        "नेविगेट करने के लिए स्थान चालू करें। सेटिंग्स → ऐप्स → Antidote+ → अनुमतियाँ → स्थान → अनुमति दें।",
      permRetry: "चालू करें व पुनः प्रयास",
      enableLocation: "स्थान चालू करें",
      locationRequired: "स्थान पहुँच आवश्यक",
      gpsTitle: "जीपीएस खोजा जा रहा…",
      gpsBody: "हो सके तो खुले में आएँ। अपने-आप पुनः प्रयास हो रहा।",
      retry: "पुनः प्रयास",
    },
  },

  te: {
    tag: "AI పాముకాటు అత్యవసర నెట్‌వర్క్",
    bitten: "కాటు", ago: "నిమి. క్రితం", victim: "బాధితుని ప్రాంతం",
    severity: "లక్షణాల తీవ్రత", mild: "తేలికపాటి", moderate: "మధ్యస్థం", severe: "తీవ్రం",
    sevHint: { mild: "స్థానిక నొప్పి, వాపు", moderate: "వ్యాపించే వాపు, వాంతి", severe: "శ్వాస / రక్తస్రావం / కనురెప్పలు వాలడం" },
    goHere: "ఈ ఆసుపత్రికి వెళ్లండి", hasAsv: "యాంటీవెనమ్ అందుబాటులో ఉంది",
    nearestTrap: "దగ్గర — కానీ యాంటీవెనమ్ లేదు", wouldWaste: "ఇక్కడికి వెళ్తే వృథా",
    away: "దూరం", eta: "రోడ్డు మార్గం సమయం", vials: "ASV సీసాలు", updated: "స్టాక్ నవీకరణ",
    confirmBtn: "నిర్ధారించి ఆసుపత్రికి తెలియజేయండి", confirming: "ఆసుపత్రికి తెలియజేస్తోంది…",
    confirmed: "ఆసుపత్రి నిర్ధారించింది", reserved: "సీసాలు మీ కోసం రిజర్వ్",
    startNav: "నావిగేషన్ ప్రారంభించండి", shareLoc: "లైవ్ లొకేషన్ పంపండి", callHosp: "ఆసుపత్రికి కాల్ చేయండి",
    locShared: "లైవ్ లొకేషన్ & లక్షణాలు పంపబడ్డాయి", otherOpts: "స్టాక్ ఉన్న ఇతర కేంద్రాలు",
    dontChase: "పామును వెంబడించవద్దు",
    dontChaseBody: "చికిత్స జాతిపై కాదు, మీ లక్షణాలపై ఆధారపడుతుంది. భారత్‌లో యాంటీవెనమ్ పాలీవేలెంట్ — నాలుగు ప్రధాన విషపూరిత పాములకు (బిగ్ ఫోర్) పనిచేస్తుంది. ఇది అన్ని జాతులపై బాగా పనిచేయదు. పూర్తిగా సురక్షితమైతేనే ఫోటో తీయండి.",
    trust: "స్టాక్‌ను ఆసుపత్రి సిబ్బంది & ఆశా కార్యకర్తలు నవీకరిస్తారు. వికారాబాద్ జిల్లా డెమో డేటా.",
    limited: "పరిమితం — స్థిరపరచవచ్చు, ముందుకు రెఫర్ చేయవచ్చు", stale: "మళ్లీ నిర్ధారణ అవసరం",
    reserving: "యాంటీవెనమ్ రిజర్వ్ చేస్తోంది", relaying: "మీ లక్షణాలు & లొకేషన్ పంపుతోంది",
    minsFurther: "దగ్గరి క్లినిక్ కంటే దూరం — కానీ ఇక్కడ చికిత్స ఖచ్చితం",
    icu: "ఐసీయూ", phc: "ప్రాథమిక ఆరోగ్య కేంద్రం", chc: "సామాజిక ఆరోగ్య కేంద్రం",
    ah: "ఏరియా ఆసుపత్రి", dh: "జిల్లా ఆసుపత్రి", tertiary: "తృతీయ ఆసుపత్రి",

    nav: { emergency: "అత్యవసరం", tracker: "ట్రాకర్", sos: "SOS", help: "సహాయం" },

    common: {
      retry: "మళ్లీ ప్రయత్నించండి", loading: "లోడ్ అవుతోంది…", back: "వెనుకకు", skip: "దాటవేయి",
      next: "తదుపరి", done: "పూర్తయింది", min: "నిమి", sinceBite: "కాటు తర్వాత",
      noData: "ఇంకా ఏమీ లేదు", cached: "కాష్ చేయబడింది", lastKnown: "చివరిగా తెలిసిన",
      assistedNote: "AI-సహాయం, రోగనిర్ధారణ కాదు",
      startOver: "మళ్లీ ప్రారంభం",
      startOverConfirm: "ఈ అత్యవసరాన్ని తొలగించి మళ్లీ ప్రారంభించాలా?",
      startOverYes: "తొలగించు",
    },

    home: {
      bittenBtn: "నాకు కాటు వేసింది",
      reassure: "ప్రశాంతంగా ఉండండి. వేగవంతమైన చికిత్సతో చాలా కాట్లు ప్రాణాంతకం కావు.",
      locating: "మీ ప్రాంతం కనుగొంటోంది…",
      locOk: "ప్రాంతం నమోదైంది",
      locDenied: "ప్రాంతం అందుబాటులో లేదు — మీ గ్రామం రాయండి",
      locManual: "ప్రాంతాన్ని మీరే నమోదు చేయండి",
      villagePlaceholder: "గ్రామం / పట్టణం పేరు",
      useLoc: "ఈ ప్రాంతాన్ని వాడండి",
      learn: "తెలుసుకోండి & నివారణ",
      learnHint: "మీ చుట్టూ పాముకాటు ప్రమాదం, భద్రతా చిట్కాలు",
      start: "అత్యవసరం ప్రారంభించండి",
    },

    snake: {
      title: "పాము ఫోటో (ఐచ్ఛికం)",
      subtitle: "AI-సహాయ చిత్ర విశ్లేషణ — ఒక సహాయకం, ప్రధాన దశ కాదు.",
      take: "ఫోటో తీయండి / అప్‌లోడ్ చేయండి",
      analyzing: "చిత్రాన్ని విశ్లేషిస్తోంది…",
      skip: "దాటవేయి — నేను పామును చూడలేదు",
      guess: "తాత్కాలిక అంచనా", confidence: "నమ్మకం", venomous: "విషపూరితం",
      assumeVenom: "విషపూరితంగా భావించండి. ఇప్పుడే చికిత్స పొందండి.",
      assumeVenomBody: "ఫోటో స్పష్టంగా లేదు లేదా పాము అనిశ్చితం. కాటును విషపూరితంగా భావించి వేగంగా యాంటీవెనమ్ చేరుకోవడమే సురక్షితమైన నియమం.",
      retake: "మళ్లీ ఫోటో తీయండి", continueAid: "ప్రథమ చికిత్సకు కొనసాగండి",
      safetyFirst: "మీరు పూర్తిగా సురక్షితంగా ఉంటేనే పామును ఫోటో తీయండి. దగ్గరకు వెళ్లవద్దు, వెంబడించవద్దు.",
      continueTracker: "కొనసాగండి → లక్షణాల ట్రాకర్",
      analyzeFailed: "చిత్రాన్ని విశ్లేషించలేకపోయాం",
      lowConfidence: "తక్కువ నమ్మకం — జాతిని పేర్కొనడం లేదు",
      cleared: "ఫోటో తొలగించబడింది",
    },

    firstAid: {
      title: "ప్రథమ చికిత్స — ఇప్పుడే చేయండి",
      timeSince: "కాటు తర్వాత సమయం",
      notStarted: "అత్యవసరం ప్రారంభించడానికి హోమ్ తెరవండి",
      doTitle: "చేయండి", dontTitle: "చేయవద్దు — ఇవి ప్రాణాంతకం",
      findAsv: "ఇప్పుడే యాంటీవెనమ్ కనుగొనండి",
      continueSnake: "కొనసాగండి → పాము ఫోటో (ఐచ్ఛికం)",
      skipPhoto: "ఫోటో దాటవేయి — ట్రాకర్‌కు",
      doItems: [
        "ప్రశాంతంగా ఉండండి; వ్యక్తికి ధైర్యం చెప్పండి — భయం విషం వ్యాప్తిని వేగవంతం చేస్తుంది.",
        "కాటు వేసిన అవయవాన్ని కదలకుండా ఉంచండి — స్ప్లింట్ తయారు చేయండి; దానిని గుండె స్థాయిలో లేదా కింద ఉంచండి.",
        "కాటు దగ్గర ఉంగరాలు, వాచీ, గాజులు, బిగుతు దుస్తులు తీసివేయండి (వాపు వస్తుంది).",
        "కాటు వేసిన ఖచ్చితమైన సమయాన్ని గుర్తుంచుకోండి.",
        "స్టాక్ ఉన్న ఆసుపత్రికి వేగంగా చేరుకోండి.",
      ],
      dontItems: [
        "టూర్నికెట్ లేదా బిగుతు కట్టు వద్దు.",
        "గాయాన్ని కోయవద్దు.",
        "విషాన్ని పీల్చవద్దు (నోటితో లేదా పరికరంతో).",
        "మంచు వద్దు, నిప్పు వద్దు, విద్యుత్ షాక్ వద్దు.",
        "సంప్రదాయ చిట్కాలు వద్దు, మద్యం వద్దు, ఆహారం వద్దు.",
        "పామును పట్టుకోవడానికి లేదా చంపడానికి ప్రయత్నించవద్దు.",
      ],
      note: "చికిత్స వైపు వెళ్తూ ఈ దశలను పాటించండి. (పూర్తి వివరణ ఆంగ్లంలో చూపబడింది.)",
    },

    tracker: {
      title: "లక్షణాల ట్రాకర్",
      subtitle: "ఆసుపత్రికి చెప్పడానికి పర్యవేక్షణ — రోగనిర్ధారణ కాదు.",
      nextCheck: "తదుపరి తనిఖీ", checkNow: "ఇప్పుడే తనిఖీ చేయండి",
      startMonitoring: "15-నిమిషాల పర్యవేక్షణ ప్రారంభించండి",
      round: "తనిఖీ", level: "తీవ్రత",
      worsening: "చివరి తనిఖీ నుండి లక్షణాలు తీవ్రమవుతున్నాయి",
      stable: "చివరి తనిఖీ నుండి లక్షణాలు స్థిరంగా ఉన్నాయి",
      improving: "చివరి తనిఖీ నుండి లక్షణాలు తగ్గుతున్నాయి",
      summaryTitle: "ఆసుపత్రికి హ్యాండోవర్ సారాంశం",
      generating: "సారాంశం రాస్తోంది…",
      regen: "సారాంశం రిఫ్రెష్ చేయండి",
      noLog: "ఇంకా తనిఖీలు లేవు. పర్యవేక్షణ ప్రారంభించడానికి మొదటి తనిఖీ చేయండి.",
      submit: "ఈ తనిఖీ సేవ్ చేయండి",
      due: "ఇప్పుడు తనిఖీ అవసరం",
      history: "పర్యవేక్షణ లాగ్",
      howDecided: "శ్వాస, నాడీ లేదా రక్తస్రావ సంకేతం ఏదైనా = తీవ్రం.",
      firstCheck: "మొదటి తనిఖీ నమోదైంది",
      onDevice: "పరికరంలో రూపొందించబడింది — ఆఫ్‌లైన్‌లో పనిచేస్తుంది",
      draftBadge: "డ్రాఫ్ట్ స్థానికంగా రూపొందింది — ఆన్‌లైన్‌లో ఉన్నప్పుడు Gemini మెరుగుపరుస్తుంది",
      geminiBadge: "Gemini చేత మెరుగుపరచబడింది",
      q: {
        swelling: "వాపు వ్యాపిస్తోందా?",
        swellingOpts: { none: "లేదు", local: "స్థానికంగా మాత్రమే", spreading: "అవయవంలో పైకి వ్యాపిస్తోంది" },
        breathing: "శ్వాస తీసుకోవడంలో ఇబ్బంది ఉందా?",
        vision: "కనురెప్పలు వాలడం, మసకబారడం లేదా రెట్టింపు చూపు?",
        bleeding: "చిగుళ్లు, మూత్రం లేదా కాటు నుండి రక్తస్రావం?",
        drowsy: "నిద్రమత్తు లేదా స్పష్టంగా మాట్లాడలేకపోవడం?",
        yes: "అవును", no: "కాదు",
      },
      note: "ఈ తనిఖీలు ఆసుపత్రి సిద్ధం కావడానికి సహాయపడతాయి. ఎల్లప్పుడూ వైద్య అంచనాకు ప్రాధాన్యత ఇవ్వండి.",
    },

    sos: {
      title: "SOS — కుటుంబం & ఆసుపత్రికి హెచ్చరిక",
      subtitle: "మీ లైవ్ లొకేషన్, లక్షణాలు, కాటు తర్వాత సమయాన్ని పంపుతుంది.",
      contactTitle: "అత్యవసర సంప్రదింపు",
      noContact: "సంప్రదింపు సేవ్ కాలేదు",
      addContact: "అత్యవసర సంప్రదింపు జోడించండి",
      namePlaceholder: "పేరు", phonePlaceholder: "ఫోన్ నంబర్",
      save: "సంప్రదింపు సేవ్ చేయండి",
      messagePreview: "సందేశం ప్రివ్యూ",
      sendBtn: "హెచ్చరిక పంపండి",
      sending: "హెచ్చరిక పంపుతోంది…",
      sent: "హెచ్చరిక పంపబడింది",
      sentBody: "కుటుంబం & ఆసుపత్రి వద్ద మీ లైవ్ లొకేషన్ & లక్షణాలు ఉన్నాయి.",
      queued: "1 హెచ్చరిక క్యూలో — సిగ్నల్ తిరిగి వచ్చాక పంపబడుతుంది",
      timeSince: "కాటు తర్వాత సమయం",
      viewHospital: "ఆసుపత్రిగా చూడండి",
      relayHospital: "వీరికి పంపబడింది", noHospitalYet: "ఇంకా ఆసుపత్రి ఎంచుకోలేదు — ముందు రూటింగ్ తెరవండి.",
      edit: "మార్చు", regenerate: "మళ్లీ రూపొందించు", recipient: "కు",
      autoSend: "ఆన్‌లైన్ అయ్యాక ఆటోమేటిక్‌గా పంపుతుంది",
    },

    hospital: {
      title: "వస్తున్న పాముకాటు హెచ్చరిక",
      subtitle: "అనుకరణ ఆసుపత్రి వీక్షణ (చదవడానికి మాత్రమే).",
      incoming: "వస్తున్న రోగి",
      eta: "చేరే సమయం", timeSince: "కాటు తర్వాత", severityLabel: "తీవ్రత",
      summary: "లక్షణాల సారాంశం", prepare: "సిద్ధం చేయండి", facility: "కేంద్రం",
      backToSos: "SOS కు తిరిగి",
      prepareLine: (vials, icu) =>
        `${vials} ASV సీసాలు · అత్యవసర వైద్యుడు${icu ? " · ఐసీయూ సిద్ధం" : ""}`,
    },

    risk: {
      title: "పాముకాటు అధిక ప్రమాద సూచిక",
      subtitle: "మీ ప్రాంతానికి సాధారణ సూచిక — మీ కోసం అంచనా కాదు.",
      band: { low: "తక్కువ", medium: "మధ్యస్థం", high: "అధికం" },
      bandLabel: "ప్రస్తుత ప్రమాద స్థాయి",
      guidance: {
        low: "తక్కువ ప్రమాద సమయం. అయినా చీకటి తర్వాత బూట్లు ధరించండి.",
        medium: "మధ్యస్థ ప్రమాదం. రాత్రి టార్చ్ వాడండి, అడుగు చూసి వేయండి.",
        high: "అధిక సీజన్ — చీకటి తర్వాత టార్చ్ & బూట్లు; ఈ యాప్‌ను ఒక ట్యాప్ దూరంలో ఉంచండి.",
      },
      factors: "ఆధారం", factorMonth: "సీజన్", factorTime: "రోజులో సమయం",
      factorDensity: "స్థానిక చరిత్ర",
      disclaimer: "ఇది సాధారణ సూచిక, ఏ వ్యక్తికీ అంచనా కాదు.",
    },

    offline: {
      banner: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు — అత్యవసర ఫీచర్లు ఇంకా పనిచేస్తాయి",
      cachedStock: "ఆసుపత్రి స్టాక్ చివరి కాష్ విలువలను చూపుతోంది.",
    },

    // ── Resume saved session (§P1) ──
    resume: {
      title: "అత్యవసరం కొనసాగుతోంది",
      body: "ఈ పరికరంలో సేవ్ చేయబడింది. ఆపిన చోటి నుండి కొనసాగించండి.",
      resumeBtn: "కొనసాగించు",
      discardBtn: "మళ్లీ ప్రారంభం",
      lastStep: "చివరి దశ",
      sinceBite: "కాటు తర్వాత",
      steps: {
        "/first-aid": "ప్రథమ చికిత్స",
        "/snake": "పాము ఫోటో",
        "/tracker": "లక్షణాల ట్రాకర్",
        "/routing": "యాంటీవెనమ్ కనుగొనండి",
        "/sos": "SOS హెచ్చరిక",
        "/hospital": "ఆసుపత్రి వీక్షణ",
      },
    },

    // ── Live GPS navigation (§P2) ──
    navigation: {
      bannerTitle: "అత్యవసర నావిగేషన్ యాక్టివ్",
      to: "గమ్యం",
      speed: "వేగం",
      distanceLeft: "మిగిలిన దూరం",
      arrival: "చేరే సమయం",
      eta: "అంచనా సమయం",
      coords: "మీ కోఆర్డినేట్లు",
      accuracy: "ఖచ్చితత్వం",
      kmh: "కిమీ/గం",
      recalculating: "మార్గం నవీకరించబడింది",
      acquiring: "GPS సిగ్నల్ పొందుతోంది…",
      lastKnownNote: "చివరిగా తెలిసిన ప్రాంతం చూపుతోంది",
      end: "నావిగేషన్ ముగించు",
      arrivedTitle: "మీరు చేరుకున్నారు",
      arrivedBody: "లోపలికి వెళ్లి ఈ స్క్రీన్‌ను సిబ్బందికి చూపండి.",
      permTitle: "లొకేషన్ అనుమతి అవసరం",
      permBody:
        "నావిగేట్ చేయడానికి లొకేషన్ ఆన్ చేయండి. సెట్టింగ్స్ → యాప్స్ → Antidote+ → అనుమతులు → లొకేషన్ → అనుమతించు.",
      permRetry: "ఆన్ చేసి మళ్లీ ప్రయత్నించు",
      enableLocation: "లొకేషన్ ఆన్ చేయండి",
      locationRequired: "లొకేషన్ యాక్సెస్ అవసరం",
      gpsTitle: "GPS వెతుకుతోంది…",
      gpsBody: "వీలైతే ఆరుబయటకు రండి. ఆటోమేటిక్‌గా మళ్లీ ప్రయత్నిస్తోంది.",
      retry: "మళ్లీ ప్రయత్నించు",
    },
  },
};

/**
 * Convenience accessor mirroring the routing file's `const t = T[lang]`.
 * @param {"te"|"hi"|"en"} lang
 * @returns {object} the string table for that language (falls back to te).
 */
export function tFor(lang) {
  return T[lang] || T.te;
}
