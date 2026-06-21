import jsPDF from "jspdf";

export const generateCertificate = (user, course) => {
  const doc = new jsPDF("landscape");

  const pageWidth = doc.internal.pageSize.getWidth();

  const name =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || "Student";
  const courseTitle = course?.title || "Course";
  const hours = course?.duration || "N/A";
  const date = new Date().toLocaleDateString();

  /* =========================
     BACKGROUND
  ========================= */
  doc.setFillColor(37, 99, 235); // blue
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setFillColor(16, 185, 129); // green accent
  doc.rect(0, 40, pageWidth, 6, "F");

  /* =========================
     LOGO (TEXT-BASED)
     (Replace with image later if you want)
  ========================= */
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("LearnHub", 15, 25);

  /* =========================
     TITLE
  ========================= */
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(30);
  doc.text("Certificate of Completion", pageWidth / 2, 80, {
    align: "center",
  });

  /* =========================
     BODY TEXT
  ========================= */
  doc.setFontSize(16);
  doc.setTextColor(55, 65, 81);

  doc.text("This certifies that", pageWidth / 2, 105, {
    align: "center",
  });

  doc.setFontSize(24);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");

  doc.text(name, pageWidth / 2, 120, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(55, 65, 81);

  doc.text("has successfully completed the course", pageWidth / 2, 140, {
    align: "center",
  });

  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);

  doc.text(courseTitle, pageWidth / 2, 155, {
    align: "center",
  });

  /* =========================
     DETAILS BOX
  ========================= */
  doc.setDrawColor(200, 200, 200);
  doc.rect(pageWidth / 2 - 60, 170, 120, 30);

  doc.setFontSize(12);
  doc.setTextColor(75, 85, 99);

  doc.text(`Hours: ${hours}`, pageWidth / 2, 182, {
    align: "center",
  });

  doc.text(`Completed: ${date}`, pageWidth / 2, 192, {
    align: "center",
  });

  /* =========================
     FOOTER SIGNATURE AREA
  ========================= */
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);

  doc.text("LearnHub Academy", 30, 230);
  doc.text("Authorized Platform", 30, 238);

  doc.text("____________________", pageWidth - 70, 230);
  doc.text("Signature", pageWidth - 60, 238);

  /* =========================
     SAVE FILE
  ========================= */
  doc.save(`${courseTitle}-certificate.pdf`);
};
