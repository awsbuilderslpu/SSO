import {
  Body,
  Head,
  Html,
  Preview,
} from "react-email";

import GeneralEmailContent from "./GeneralEmailContent";

interface GeneralEmailProps {
  subject: string;
  greeting?: string;
  heading?: string;
  content: React.ReactNode;
  senderName?: string;
  senderRole?: string;
}

export default function GeneralEmail({
  subject,
  greeting,
  heading,
  content,
  senderName,
  senderRole,
}: GeneralEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>{subject}</Preview>

      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#0b1220",
          fontFamily:
            "Arial, Helvetica, sans-serif",
        }}
      >
        <GeneralEmailContent
          greeting={greeting}
          heading={heading}
          content={content}
          senderName={senderName}
          senderRole={senderRole}
        />
      </Body>
    </Html>
  );
}