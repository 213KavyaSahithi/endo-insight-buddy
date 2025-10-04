import jsPDF from 'jspdf';
import { AssessmentHistory } from '@/types/assessment';

export const exportToPDF = (assessment: AssessmentHistory) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = 20;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * (fontSize * 0.5) + 5;
  };

  const addSpace = (space: number = 10) => {
    yPosition += space;
  };

  const checkPageBreak = (neededSpace: number = 50) => {
    if (yPosition + neededSpace > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Header
  doc.setFillColor(147, 51, 234); // primary color
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('EndoAI Assessment Report', margin, 25);
  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // Date
  addText(`Assessment Date: ${new Date(assessment.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 10);
  addSpace(5);

  // Risk Assessment Section
  addText('RISK ASSESSMENT', 16, true);
  doc.setDrawColor(147, 51, 234);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  addSpace(10);

  // Risk Level with color coding
  const riskLevel = assessment.result.riskLevel;
  const riskColors: { [key: string]: [number, number, number] } = {
    'Low': [34, 197, 94],
    'Moderate': [234, 179, 8],
    'High': [239, 68, 68]
  };
  const color = riskColors[riskLevel] || [100, 100, 100];
  
  doc.setFillColor(...color);
  doc.roundedRect(margin, yPosition, 60, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${riskLevel} Risk`, margin + 30, yPosition + 8, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPosition += 20;

  addText(`Risk Probability: ${(assessment.result.probability * 100).toFixed(1)}%`, 12);
  addText(`Confidence Level: ${(assessment.result.confidence * 100).toFixed(1)}%`, 12);
  addText(`Predicted Stage: Stage ${assessment.result.stage}`, 12);
  addSpace(15);

  checkPageBreak();

  // Contributing Factors Section
  addText('CONTRIBUTING FACTORS', 16, true);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  addSpace(10);

  assessment.result.factors.forEach((factor) => {
    checkPageBreak();
    addText(`${factor.feature}:`, 11, true);
    addText(`Impact: ${(factor.impact * 100).toFixed(1)}%`, 10);
    addText(`Value: ${factor.value}`, 10);
    addSpace(5);
  });

  addSpace(10);
  checkPageBreak(80);

  // Recommendations Section
  addText('RECOMMENDATIONS', 16, true);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  addSpace(10);

  assessment.result.recommendations.forEach((rec, index) => {
    checkPageBreak();
    addText(`${index + 1}. ${rec}`, 11);
    addSpace(3);
  });

  addSpace(15);
  checkPageBreak(60);

  // Patient Information Section
  addText('PATIENT INFORMATION', 16, true);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  addSpace(10);

  const { data } = assessment;
  addText(`Age: ${data.age} years`, 11);
  addText(`BMI: ${data.bmi?.toFixed(1) || 'N/A'}`, 11);
  if (data.cycleLength) addText(`Cycle Length: ${data.cycleLength} days`, 11);
  if (data.ageOfMenarche) addText(`Age of Menarche: ${data.ageOfMenarche} years`, 11);
  addSpace(10);

  // Symptoms
  if (data.dysmenorrheaScore !== undefined || data.pelvicPainScore !== undefined) {
    checkPageBreak();
    addText('Symptoms (0-10 scale):', 12, true);
    if (data.dysmenorrheaScore !== undefined) addText(`Dysmenorrhea: ${data.dysmenorrheaScore}`, 10);
    if (data.pelvicPainScore !== undefined) addText(`Pelvic Pain: ${data.pelvicPainScore}`, 10);
    if (data.dyspareuniaScore !== undefined) addText(`Dyspareunia: ${data.dyspareuniaScore}`, 10);
    if (data.dscheziaScore !== undefined) addText(`Dyschezia: ${data.dscheziaScore}`, 10);
    if (data.urinarySymptomsScore !== undefined) addText(`Urinary Symptoms: ${data.urinarySymptomsScore}`, 10);
    if (data.mentalHealthScore !== undefined) addText(`Mental Health Impact: ${data.mentalHealthScore}`, 10);
    addSpace(10);
  }

  // Medical History
  checkPageBreak();
  addText('Medical History:', 12, true);
  addText(`Family History: ${data.familyHistory ? 'Yes' : 'No'}`, 10);
  addText(`Infertility: ${data.infertilityStatus ? 'Yes' : 'No'}`, 10);
  addSpace(10);

  // Biomarkers if available
  if (data.ca125Level || data.crpLevel) {
    checkPageBreak();
    addText('Biomarkers:', 12, true);
    if (data.ca125Level) addText(`CA-125: ${data.ca125Level} U/mL`, 10);
    if (data.crpLevel) addText(`CRP: ${data.crpLevel} mg/L`, 10);
    addSpace(10);
  }

  // Disclaimer
  checkPageBreak(50);
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 45, 3, 3, 'F');
  yPosition += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT DISCLAIMER', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const disclaimerText = doc.splitTextToSize(
    'This AI-powered assessment is designed to provide informational insights only. It should not be used as a substitute for professional medical diagnosis or treatment. If you have concerns about endometriosis or related symptoms, please consult a qualified healthcare provider for proper evaluation and care.',
    pageWidth - 2 * margin - 10
  );
  doc.text(disclaimerText, margin, yPosition);

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount} | EndoAI Report | Generated ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `EndoAI_Assessment_${new Date(assessment.date).toLocaleDateString('en-US').replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
