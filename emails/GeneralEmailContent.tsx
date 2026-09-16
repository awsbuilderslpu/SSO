import {
  Container,
  Img,
  Link,
  Section,
  Text,
} from "react-email";

interface GeneralEmailContentProps {
  content: React.ReactNode;
  greeting?: string;
  heading?: string;
  senderName?: string;
  senderRole?: string;
}

export default function GeneralEmailContent({
  content,
  greeting = "Dear Student,",
  heading,
  senderName = "AWS Student Builder Group",
  senderRole = "Lovely Professional University",
}: GeneralEmailContentProps) {
  return (
    <Container style={styles.container}>
      <Section style={styles.header}>
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          border={0}
          style={{ borderCollapse: "collapse" }}
        >
          <tbody>
            <tr>
              <td style={{ verticalAlign: "middle" }}>
                <Img
                  src="https://awslpu.in/image/logo/aws_student_builder_group.png"
                  alt="AWS Student Builder Group"
                  width="52"
                  height="52"
                  style={styles.logo}
                />

                <Text style={styles.brandName}>
                  AWS Student Builder Group
                </Text>

                <Text style={styles.brandUniversity}>
                  Lovely Professional University
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section style={styles.content}>
        <Text style={styles.greeting}>{greeting}</Text>

        {heading && (
          <>
            <Text style={styles.heading}>{heading}</Text>
            <div style={styles.headingLine} />
          </>
        )}

        <Section style={styles.body}>
          {content}
        </Section>

        <Section style={styles.signature}>
          <Text style={styles.regards}>Regards,</Text>

          <Text style={styles.senderName}>
            {senderName}
          </Text>

          <Text style={styles.senderRole}>
            {senderRole}
          </Text>
        </Section>
      </Section>

      <Section style={styles.footer}>
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          border={0}
          style={{ borderCollapse: "collapse" }}
        >
          <tbody>
            <tr>
              <td style={{ verticalAlign: "top" }}>
                <Text style={styles.footerName}>
                  AWS Student Builder Group
                </Text>

                <Text style={styles.footerUniversity}>
                  Lovely Professional University
                </Text>
              </td>

              <td
                style={{
                  verticalAlign: "top",
                  textAlign: "right",
                }}
              >
                <Link
                  href="https://awslpu.in"
                  style={styles.footerLink}
                >
                  awslpu.in ↗
                </Link>
              </td>
            </tr>
          </tbody>
        </table>

        <Text style={styles.disclaimer}>
          This is an automated email from the AWS Student
          Builder Group. Please do not reply to this email.
        </Text>
      </Section>
    </Container>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "640px",
    margin: "0 auto",
    backgroundColor: "#0f1724",
    color: "#f8fafc",
  },

  header: {
    padding: "34px 40px 30px",
    backgroundColor: "#0f1724",
    borderBottom: "1px solid #263244",
  },

  logo: {
    display: "block",
    margin: "0 0 13px",
  },

  brandName: {
    margin: 0,
    fontSize: "16px",
    lineHeight: "23px",
    fontWeight: "600",
    color: "#ffffff",
  },

  brandUniversity: {
    margin: "3px 0 0",
    fontSize: "12px",
    lineHeight: "18px",
    color: "#8794a7",
  },

  headerMark: {
    width: "72px",
    height: "60px",
    marginLeft: "auto",
    position: "relative" as const,
  },

  markPurple: {
    position: "absolute" as const,
    top: 0,
    right: "28px",
    width: "28px",
    height: "28px",
    backgroundColor: "#d7a1f9",
    display: "block",
  },

  markCyan: {
    position: "absolute" as const,
    top: "28px",
    right: 0,
    width: "28px",
    height: "28px",
    backgroundColor: "#49ded0",
    display: "block",
  },

  markPink: {
    position: "absolute" as const,
    top: "28px",
    right: "28px",
    width: "28px",
    height: "28px",
    backgroundColor: "#e3a3f4",
    display: "block",
  },

  content: {
    padding: "44px 40px 48px",
    backgroundColor: "#0f1724",
  },

  greeting: {
    margin: "0 0 22px",
    fontSize: "15px",
    lineHeight: "24px",
    color: "#b8c4d4",
  },

  heading: {
    margin: 0,
    fontSize: "29px",
    lineHeight: "37px",
    fontWeight: "600",
    letterSpacing: "-0.7px",
    color: "#ffffff",
  },

  headingLine: {
    width: "42px",
    height: "3px",
    margin: "17px 0 27px",
    backgroundColor: "#55dfd2",
  },

  body: {
    fontSize: "15px",
    lineHeight: "27px",
    color: "#c4cfdd",
  },

  signature: {
    marginTop: "38px",
    paddingTop: "24px",
    borderTop: "1px solid #263244",
  },

  regards: {
    margin: "0 0 4px",
    fontSize: "13px",
    lineHeight: "20px",
    color: "#7f8da0",
  },

  senderName: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "22px",
    fontWeight: "600",
    color: "#ffffff",
  },

  senderRole: {
    margin: "2px 0 0",
    fontSize: "12px",
    lineHeight: "19px",
    color: "#7f8da0",
  },

  footer: {
    padding: "25px 40px 29px",
    backgroundColor: "#080e18",
    borderTop: "1px solid #263244",
  },

  footerName: {
    margin: 0,
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: "600",
    color: "#d6dee8",
  },

  footerUniversity: {
    margin: "2px 0 0",
    fontSize: "11px",
    lineHeight: "17px",
    color: "#667487",
  },

  footerLink: {
    fontSize: "11px",
    lineHeight: "18px",
    color: "#86d9d2",
    textDecoration: "none",
  },

  disclaimer: {
    margin: "20px 0 0",
    paddingTop: "14px",
    borderTop: "1px solid #1b2533",
    fontSize: "10px",
    lineHeight: "16px",
    color: "#566375",
  },
};