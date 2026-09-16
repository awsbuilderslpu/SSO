import GeneralEmailContent from "@/emails/GeneralEmailContent";

export default function MailPreview() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#e5e7eb",
        padding: "48px 16px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <GeneralEmailContent
        greeting="Dear Shashank,"
        heading="Application Update"
        content={
          <>
            <p style={{ margin: "0 0 18px" }}>
              Thank you for your interest in joining the AWS
              Student Builder Group at Lovely Professional
              University.
            </p>

            <p style={{ margin: "0 0 18px" }}>
              We are pleased to inform you that your application
              has been shortlisted for the next stage of the
              recruitment process.
            </p>

            <p style={{ margin: 0 }}>
              Further details regarding the next stage will be
              shared with you shortly.
            </p>
          </>
        }
        senderName="AWS Student Builder Group"
        senderRole="Recruitment Team"
      />
    </main>
  );
}