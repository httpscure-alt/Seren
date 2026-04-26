export type Lang = "en" | "id";

export type Dictionary = {
  nav: {
    philosophy: string;
    results: string;
    inbox: string;
    startConsultation: string;
  };
  intake: {
    title: string;
    step: {
      photos: string;
      profile: string;
      skin: string;
    };
    progress: {
      step1: string;
      step2: string;
      step3: string;
      complete: string; // e.g. "{pct}% complete"
    };
    tips: {
      title: string;
      items: string[];
      privacy: string;
    };
    stepper: {
      photos: string;
      profile: string;
      skin: string;
    };
    photos: {
      title: string;
      subtitle: string;
      helper: string;
      slots: string[]; // 3 labels
      remove: string;
    };
    identity: {
      title: string;
      subtitle: string;
      ageLabel: string;
      agePlaceholder: string;
      genderLabel: string;
      genderPlaceholder: string;
      genderFemale: string;
      genderMale: string;
      genderPreferNot: string;
    };
    chief: {
      title: string;
      subtitle: string;
      options: string[];
      otherLabel: string;
      otherPlaceholder: string;
      durationLabel: string;
      durationPlaceholder: string;
      durationHint: string;
      severityLabel: string;
      severityMild: string;
      severityModerate: string;
      severitySevere: string;
      onsetLabel: string;
      onsetPlaceholder: string;
      courseLabel: string;
      courseStable: string;
      courseWorsening: string;
      courseFlares: string;
    };
    skin: {
      title: string;
      subtitle: string;
      sebumTitle: string;
      sebumHelper: string;
      oilLt2h: string;
      oil2to4h: string;
      oilGte4h: string;
      oilNotOily: string;
      oilyAreasLabel: string;
      areaTzone: string;
      areaAllFace: string;
      areaNone: string;
      barrierTitle: string;
      barrierHelper: string;
      feelTight: string;
      feelNormal: string;
      feelOily: string;
      barrierSignsLabel: string;
      signPeeling: string;
      signItchy: string;
      signDryFeel: string;
      sensitivityTitle: string;
      easyRed: string;
      stings: string;
      allergyHistory: string;
      sensitivityNoteLabel: string;
      sensitivityNotePlaceholder: string;
      lesionsTitle: string;
      acneTitle: string;
      acneYes: string;
      acneNo: string;
      pigmentationTitle: string;
      darkSpotsYes: string;
      darkSpotsNo: string;
      pigmentationTypesLabel: string;
      pigmentAcneMarks: string;
      pigmentMelasma: string;
      pigmentFreckles: string;
    };
    extra: {
      title: string;
      subtitle: string;
      placeholder: string;
    };
    actions: {
      save: string;
      next: string;
      submit: string;
      previous: string;
    };
    validation: {
      requiredToSubmit: string;
      primaryPhotoRequired: string;
    };
    auth: {
      signedInAs: string; // e.g. "Signed in as {email}"
      notSignedIn: string;
      signInToSubmit: string;
    };
    toast: {
      draftSaved: string;
      completeRequired: string;
      submitted: string;
      submitFailed: string;
      photoTooLarge: string;
      photoInvalidFile: string;
    };
    note: {
      identity: string;
      age: string;
      gender: string;
      chiefComplaint: string;
      duration: string;
      severity: string;
      onset: string;
      course: string;
      sebum: string;
      oilyAfterWash: string;
      areas: string;
      barrier: string;
      afterWashFeel: string;
      signs: string;
      sensitivity: string;
      easyRed: string;
      stings: string;
      allergy: string;
      sensitivityNote: string;
      acneActive: string;
      darkSpots: string;
      pigmentationTypes: string;
      extraNote: string;
      yes: string;
      no: string;
    };
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
  };
  landing: {
    eyebrow: string;
    heroTitle1: string;
    heroTitle2: string;
    heroBody: string;
    ctaStart: string;
    ctaPhilosophy: string;
    carouselSlides: Array<{
      eyebrow: string;
      title: string;
      status: string;
      accent: "warm" | "cool" | "neutral";
    }>;
    trustHeading: string;
    trustItems: Array<{ title: string; desc: string }>;
    lessNoiseEyebrow: string;
    lessNoiseTitle: string;
    lessNoiseBody: string;
    pricingHeading: string;
    pricingSingleTitle: string;
    pricingSingleDesc: string;
    pricingSingleCta: string;
    pricingJourneyTitle: string;
    pricingJourneyDesc: string;
    pricingJourneyCta: string;
  };
  philosophy: {
    heroEyebrow: string;
    heroTitle1: string;
    heroTitle2: string;
    heroBody: string;
    ctaStart: string;
    ctaBack: string;
    coreEyebrow: string;
    coreTitle: string;
    coreBody: string;
    closingTitle: string;
    closingBody: string;
  };
};

