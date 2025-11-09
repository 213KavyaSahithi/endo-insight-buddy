import { AssessmentHistory } from "@/types/assessment";

export function buildResultExplanation(assessment: AssessmentHistory): string {
  const { riskLevel, probability, confidence, stage, factors, recommendations } = assessment.result;

  const risk = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
  const probPct = Math.round(probability * 100);
  const confPct = Math.round(confidence * 100);

  const topFactors = (factors || []).slice(0, 5)
    .map((f) => {
      const dir = f.impact >= 0 ? "increases" : "decreases";
      return `${f.feature} (${f.value}) — ${dir} risk`;
    })
    .join("; ");

  const recs = (recommendations || []).slice(0, 5).join("; ");

  const lines = [
    "Here's a quick explanation of your assessment:",
    `- Overall risk: ${risk} (${probPct}%)`,
    `- Model confidence: ${confPct}%`,
    `- Predicted stage: ${stage} (stage reflects extent of disease, not pain severity)`,
    topFactors ? `- Top factors: ${topFactors}` : "",
    recs ? `- Next steps: ${recs}` : "",
    "This is not a diagnosis.",
  ].filter(Boolean);

  return lines.join("\n");
}

interface FAQPattern {
  patterns: RegExp[];
  response: (assessment?: AssessmentHistory) => string;
}

const faqDatabase: FAQPattern[] = [
  {
    patterns: [
      /what\s+(do|does)\s+my\s+results?\s+mean/i,
      /interpret\s+my\s+results?/i,
      /understand\s+my\s+results?/i,
      /explain\s+my\s+results?/i,
      /tell\s+me\s+about\s+my\s+results?/i,
      /what\s+(is|are)\s+my\s+results?/i,
      /summary\s+of\s+my\s+results?/i,
      /results?\s+explanation/i,
    ],
    response: (assessment) => {
      if (!assessment) return "Please provide your assessment details.";
      const risk = assessment.result.riskLevel;
      const prob = Math.round(assessment.result.probability * 100);
      return `Your results indicate a ${risk} risk level (${prob}% probability) of endometriosis based on your symptoms, medical history, and biomarkers.\n\nWhat this means:\n- ${risk === "high" ? "You have several indicators that suggest endometriosis may be present" : risk === "medium" ? "You have some indicators that suggest endometriosis could be present" : "Your indicators show lower likelihood, but symptoms should still be evaluated"}\n- This is a screening tool, not a diagnosis\n- Clinical evaluation by a gynecologist is recommended\n\nNext steps: ${assessment.result.recommendations.slice(0, 2).join(", ")}`;
    },
  },
  {
    patterns: [
      /does\s+this\s+mean\s+I\s+have\s+endometriosis/i,
      /do\s+I\s+have\s+endometriosis/i,
      /am\s+I\s+diagnosed/i,
    ],
    response: (assessment) => {
      const risk = assessment?.result.riskLevel || "unknown";
      return `No, this is not a diagnosis. This assessment indicates a ${risk} risk based on your symptoms and history, but only a healthcare provider can diagnose endometriosis.\n\nKey points:\n- Definitive diagnosis typically requires laparoscopy (minimally invasive surgery)\n- Imaging like ultrasound or MRI can detect endometriomas and deep disease\n- Clinical evaluation by a gynecologist specializing in endometriosis is essential\n- Many people are managed based on symptoms even without surgical confirmation\n\nAction: Schedule an appointment with a gynecologist to discuss your symptoms and this assessment.`;
    },
  },
  {
    patterns: [
      /how\s+accurate/i,
      /is\s+this\s+reliable/i,
      /can\s+I\s+trust/i,
      /confidence/i,
    ],
    response: (assessment) => {
      const conf = assessment ? Math.round(assessment.result.confidence * 100) : 0;
      return `This assessment has a model confidence of ${conf}%.\n\nAccuracy considerations:\n- This tool uses machine learning based on clinical research and symptom patterns\n- It's a screening tool, not a diagnostic test\n- Accuracy varies based on symptom clarity and completeness of information\n- ${conf > 80 ? "High confidence suggests clear symptom patterns" : conf > 60 ? "Moderate confidence suggests mixed indicators" : "Lower confidence suggests less clear patterns"}\n\nImportant: Only clinical evaluation, imaging, and potentially laparoscopy can provide definitive diagnosis. Use this as a guide for discussing with your doctor.`;
    },
  },
  {
    patterns: [
      /is\s+this\s+(mild|severe|moderate)/i,
      /how\s+(bad|serious|severe)/i,
      /stage\s+mean/i,
    ],
    response: (assessment) => {
      const stage = assessment?.result.stage || "unknown";
      return `Your predicted stage is ${stage}.\n\nUnderstanding stages (I-IV):\n- Stage I (Minimal): Small, isolated implants\n- Stage II (Mild): More implants, slightly deeper\n- Stage III (Moderate): Many implants, possible ovarian cysts\n- Stage IV (Severe): Extensive implants, large cysts, dense adhesions\n\nCritical to know:\n- Stage does NOT correlate with pain severity\n- Stage I can cause severe pain; Stage IV can be pain-free\n- Staging reflects disease extent, not symptom intensity\n- Treatment focuses on YOUR symptoms, not just the stage\n\nNext step: Discuss symptom management options with a gynecologist regardless of predicted stage.`;
    },
  },
  {
    patterns: [
      /can\s+endometriosis\s+cause\s+(back\s+pain|fatigue|bloating)/i,
      /symptoms\s+like/i,
      /other\s+symptoms/i,
    ],
    response: () => "Yes, endometriosis can cause many symptoms beyond pelvic pain:\n\nCommon symptoms:\n- Chronic pelvic pain and severe period cramps\n- Pain during or after sex (dyspareunia)\n- Back pain and leg pain (nerve involvement)\n- Chronic fatigue (from inflammation and pain)\n- Bloating and digestive issues\n- Painful bowel movements or urination during periods\n- Heavy bleeding or spotting\n- Infertility or difficulty conceiving\n\nWhy this happens:\n- Endometrial-like tissue grows outside the uterus\n- Causes inflammation, scarring, and adhesions\n- Can affect nerves, bowel, bladder, and other organs\n- Systemic inflammation leads to fatigue\n\nImportant: Symptoms vary widely between individuals. Track your patterns and discuss all symptoms with your doctor.",
  },
  {
    patterns: [
      /symptoms?\s+change/i,
      /month\s+to\s+month/i,
      /vary/i,
      /fluctuate/i,
    ],
    response: () => "Yes, symptoms often fluctuate throughout your cycle and over time.\n\nCommon patterns:\n- Symptoms typically worse during or around menstruation\n- Pain may peak mid-cycle (ovulation) or just before period\n- Some months are worse than others\n- Stress, diet, and inflammation levels affect symptoms\n- Disease progression can change symptom patterns\n\nWhy symptoms vary:\n- Hormonal fluctuations drive endometrial tissue activity\n- Inflammation levels change with cycle\n- Scar tissue and adhesions evolve over time\n- Lifestyle factors (sleep, stress, diet) impact pain perception\n\nHelpful action: Track your symptoms with a diary or app to identify patterns and triggers. This information is valuable for your doctor.",
  },
  {
    patterns: [
      /pain.*after.*period/i,
      /pain.*between.*periods/i,
      /chronic.*pain/i,
    ],
    response: () => "Pain continuing after your period can indicate endometriosis involvement.\n\nWhy this happens:\n- Endometrial-like tissue outside the uterus responds to hormones\n- Inflammation persists even after bleeding stops\n- Adhesions and scar tissue cause ongoing pain\n- Deep infiltrating endometriosis affects surrounding organs\n- Nerve sensitization creates chronic pain cycles\n\nTypes of ongoing pain:\n- Chronic pelvic pain (>6 months)\n- Pain during ovulation\n- Pain with sex, exercise, or bowel movements\n- Lower back or leg pain (nerve involvement)\n\nManagement:\n- NSAIDs and pain management strategies\n- Hormonal treatments to suppress endometriosis activity\n- Pelvic floor physical therapy\n- Discuss persistent pain with your gynecologist for treatment options",
  },
  {
    patterns: [
      /should\s+I\s+see.*gynecologist/i,
      /when.*see.*doctor/i,
      /need.*specialist/i,
    ],
    response: (assessment) => {
      const risk = assessment?.result.riskLevel || "medium";
      return `${risk === "high" ? "Yes, you should see a gynecologist soon" : risk === "medium" ? "Yes, scheduling a gynecologist appointment is recommended" : "Consider seeing a gynecologist if symptoms persist"}.\n\nWhen to seek care:\n- Severe period pain interfering with daily life\n- Pain with sex, bowel movements, or urination\n- Heavy bleeding or irregular cycles\n- Difficulty conceiving after 6-12 months\n- Any of your concerning symptoms\n\nWhat to bring to appointment:\n- This assessment and your symptom history\n- Menstrual cycle tracking (dates, flow, pain levels)\n- List of current medications and treatments tried\n- Family history of endometriosis\n- Questions about diagnosis and treatment options\n\nFinding the right doctor: Look for a gynecologist with endometriosis experience or consider a specialist in reproductive endocrinology or pelvic pain.`;
    },
  },
  {
    patterns: [
      /which.*doctor/i,
      /what.*specialist/i,
      /type.*doctor/i,
    ],
    response: () => "Recommended healthcare providers for endometriosis:\n\n1. Gynecologist (First step)\n- General gynecologists can diagnose and manage most cases\n- Can prescribe medications and order imaging\n- Refer to specialists if needed\n\n2. Endometriosis Specialist\n- Gynecologists with advanced training in endometriosis\n- Skilled in excision surgery (gold standard treatment)\n- Manage complex or severe cases\n\n3. Reproductive Endocrinologist\n- If fertility is a concern\n- Specializes in hormonal treatments and assisted reproduction\n\n4. Additional support:\n- Pelvic floor physical therapist (pain management)\n- Pain management specialist (chronic pain)\n- Colorectal surgeon (for bowel involvement)\n\nFinding a specialist: Look for endometriosis centers, search professional organizations (like AAGL), or ask for referrals from your primary care doctor.",
  },
  {
    patterns: [
      /what.*tests/i,
      /how.*diagnosed/i,
      /confirm.*endometriosis/i,
      /diagnosis.*process/i,
    ],
    response: () => "Endometriosis diagnosis typically involves:\n\n1. Clinical Evaluation\n- Detailed symptom history and pelvic exam\n- Many cases managed based on symptoms alone\n\n2. Imaging Studies\n- Transvaginal ultrasound: Detects ovarian endometriomas (cysts)\n- MRI: Better visualization of deep infiltrating endometriosis\n- Note: Imaging can miss superficial implants\n\n3. Laparoscopy (Definitive diagnosis)\n- Minimally invasive surgery with camera\n- Allows direct visualization of endometrial implants\n- Tissue can be biopsied and removed during procedure\n- Considered gold standard for diagnosis\n\n4. Blood Tests (Supportive, not diagnostic)\n- CA-125 may be elevated but not specific\n- Inflammatory markers\n\nImportant: Many doctors start treatment based on symptoms without requiring surgery, especially if imaging suggests endometriosis or symptoms are classic.",
  },
  {
    patterns: [
      /ultrasound.*laparoscopy/i,
      /should.*I.*get/i,
      /need.*surgery/i,
    ],
    response: () => "The approach depends on your symptoms and goals:\n\nStart with imaging (Ultrasound/MRI):\n- Non-invasive and often helpful\n- Can detect endometriomas and deep disease\n- Good first step before considering surgery\n- Recommendation: Start with transvaginal ultrasound\n\nConsider laparoscopy if:\n- Imaging is inconclusive but symptoms are severe\n- Pain is unmanaged by medications\n- Fertility is a concern and other causes ruled out\n- Imaging shows severe disease requiring treatment\n- You want definitive diagnosis\n\nTreatment-first approach:\n- Many doctors prescribe hormonal treatments without surgery\n- If treatments help, you may not need laparoscopy\n- Surgery reserved for persistent symptoms or fertility issues\n\nDiscuss with your gynecologist: They'll recommend the best approach based on your specific situation, symptom severity, and reproductive goals.",
  },
  {
    patterns: [
      /manage.*pain.*naturally/i,
      /natural.*treatment/i,
      /without.*medication/i,
      /home.*remedies/i,
    ],
    response: () => "Natural pain management strategies for endometriosis:\n\n1. Heat therapy\n- Heating pads, hot water bottles, or warm baths\n- Helps relax muscles and reduce cramping\n\n2. Physical therapy\n- Pelvic floor physical therapy (highly effective)\n- Helps with muscle tension and pain\n\n3. Exercise\n- Gentle activities: yoga, walking, swimming\n- Reduces inflammation and improves mood\n- Avoid overexertion during flares\n\n4. Stress management\n- Meditation, mindfulness, deep breathing\n- Stress worsens pain perception and inflammation\n\n5. TENS units\n- Transcutaneous electrical nerve stimulation\n- Blocks pain signals\n\n6. Supplements (consult doctor first)\n- Omega-3s (anti-inflammatory)\n- Magnesium (muscle relaxation)\n- Turmeric/curcumin\n\nImportant: Natural methods work best alongside medical treatment, not as replacement. Discuss all approaches with your doctor.",
  },
  {
    patterns: [
      /foods.*good.*bad/i,
      /what.*eat/i,
      /diet.*endometriosis/i,
    ],
    response: () => "Diet guidelines for endometriosis:\n\nFoods that may help (anti-inflammatory):\n- Fruits & vegetables: Berries, leafy greens, cruciferous vegetables\n- Omega-3 rich foods: Fatty fish, walnuts, flaxseeds\n- Whole grains: Quinoa, brown rice, oats\n- Legumes: Beans, lentils\n- Healthy fats: Olive oil, avocado\n- Anti-inflammatory spices: Turmeric, ginger\n\nFoods to limit (may increase inflammation):\n- Red meat and processed meats\n- Refined sugars and processed foods\n- Trans fats and fried foods\n- Alcohol\n- Excessive caffeine\n- High-FODMAP foods if you have digestive issues\n\nGeneral principles:\n- Eat whole, unprocessed foods\n- Stay hydrated\n- Consider food diary to identify triggers\n- Some find gluten or dairy worsens symptoms\n\nNote: Diet alone won't cure endometriosis, but it may help reduce inflammation and improve symptoms. Work with a nutritionist familiar with endometriosis if possible.",
  },
  {
    patterns: [
      /exercise.*yoga.*help/i,
      /physical.*activity/i,
      /workout/i,
    ],
    response: () => "Yes, exercise and yoga can help manage endometriosis symptoms!\n\nBenefits of exercise:\n- Reduces inflammation\n- Releases endorphins (natural pain relief)\n- Improves mood and reduces stress\n- Helps regulate hormones\n- Reduces estrogen levels\n\nBest types of exercise:\n\n1. Yoga (Highly recommended)\n- Gentle stretching reduces pelvic tension\n- Breathing exercises manage stress\n- Restorative poses help during flares\n- Focus on hip openers and gentle twists\n\n2. Low-impact cardio\n- Walking, swimming, cycling\n- 20-30 minutes, 3-5 times per week\n\n3. Pilates\n- Strengthens core without high impact\n- Improves pelvic floor function\n\nTips:\n- Listen to your body—rest during flares\n- Start slowly and build gradually\n- Avoid high-intensity exercise during severe pain\n- Focus on gentle movement and stretching\n\nPelvic floor yoga and physical therapy are especially helpful for endometriosis-related pain.",
  },
  {
    patterns: [
      /stress.*affect/i,
      /stress.*symptoms/i,
      /anxiety.*pain/i,
    ],
    response: () => "Stress significantly impacts endometriosis symptoms:\n\nHow stress worsens symptoms:\n- Increases inflammation and cortisol levels\n- Lowers pain threshold (makes pain feel worse)\n- Disrupts hormone balance\n- Weakens immune function\n- Causes muscle tension in pelvis\n- May trigger symptom flares\n\nThe pain-stress cycle:\n- Pain causes stress and anxiety\n- Stress worsens pain perception\n- Creates a difficult cycle to break\n\nStress management strategies:\n\n1. Relaxation techniques\n- Deep breathing exercises\n- Progressive muscle relaxation\n- Meditation and mindfulness apps\n\n2. Lifestyle modifications\n- Prioritize sleep (7-9 hours)\n- Regular gentle exercise\n- Time management to reduce overwhelm\n\n3. Support\n- Therapy or counseling\n- Support groups (online or in-person)\n- Talk to friends and family\n\n4. Mind-body practices\n- Yoga, tai chi\n- Guided imagery\n- Biofeedback\n\nImportant: Managing stress is a key part of comprehensive endometriosis treatment.",
  },
  {
    patterns: [
      /heat.*pads?.*help/i,
      /rest.*help/i,
      /heating.*pad/i,
    ],
    response: () => "Yes! Heat therapy and rest are very effective for endometriosis pain.\n\nHeat therapy benefits:\n- Relaxes uterine and pelvic muscles\n- Increases blood flow to the area\n- Reduces cramping and spasms\n- Provides immediate pain relief\n- Safe and no side effects\n\nHow to use heat effectively:\n- Heating pads: 20-30 minutes at a time\n- Hot water bottles: Wrap in towel to prevent burns\n- Warm baths: Add Epsom salts for extra relaxation\n- Heated blankets: For overall comfort\n- Note: Don't use excessive heat or fall asleep with heating pad\n\nRest and recovery:\n- During flares: Rest is essential, not lazy\n- Listen to your body: Pace activities\n- Quality sleep: Helps with pain management and healing\n- Gentle movement: Light stretching when resting\n\nCombining approaches:\n- Use heat + rest during acute pain\n- Add gentle stretching when comfortable\n- Take prescribed pain medication as needed\n- Practice relaxation techniques\n\nRemember: Chronic pain is exhausting. Rest is part of treatment, not avoidance.",
  },
];

export function findFAQResponse(question: string, assessment?: AssessmentHistory): string | null {
  const normalizedQuestion = question.trim().toLowerCase();
  
  for (const faq of faqDatabase) {
    for (const pattern of faq.patterns) {
      if (pattern.test(normalizedQuestion)) {
        return faq.response(assessment);
      }
    }
  }
  
  return null;
}
