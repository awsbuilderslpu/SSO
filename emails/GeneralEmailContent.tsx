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
          style={styles.headerTable}
        >
          <tbody>
            <tr>
              <td style={styles.brandCell}>
                <Img
                  src="https://awslpu.in/image/logo/aws_student_builder_group.png"
                  alt="AWS Student Builder Group"
                  width="64"
                  height="64"
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
        <Text style={styles.greeting}>
          {greeting}
        </Text>

        {heading && (
          <Text style={styles.heading}>
            {heading}
          </Text>
        )}

        <Section style={styles.body}>
          {content}
        </Section>

        <Section style={styles.signature}>
          <Text style={styles.regards}>
            Regards,
          </Text>

          <Text style={styles.senderName}>
            {senderName}
          </Text>

          <Text style={styles.senderRole}>
            {senderRole}
          </Text>
        </Section>
      </Section>

      <Section style={styles.ecosystem}>
        <Text style={styles.ecosystemTitle}>
          Explore the AWS Community Ecosystem
        </Text>

        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={styles.ecosystemTable}
        >
          <tbody>
            <tr>
              <td style={styles.ecosystemItem}>
                <Link
                  href="https://builder.aws"
                  style={styles.ecosystemLink}
                >
                  AWS Builder Center ↗
                </Link>

                <Text style={styles.ecosystemDescription}>
                  Learn, build, and grow with AWS.
                </Text>
              </td>
              
              <td style={styles.ecosystemItem}>
                <Link
                  href="https://aws.amazon.com/education/awseducate/"
                  style={styles.ecosystemLink}
                >
                  AWS Educate ↗
                </Link>

                <Text style={styles.ecosystemDescription}>
                  Resources for students and educators.
                </Text>
              </td>

            </tr>

            <tr>
              <td
                style={{
                  ...styles.ecosystemItem,
                  borderBottom: "none",
                }}
              >
                <Link
                  href="https://aws.amazon.com/training/"
                  style={styles.ecosystemLink}
                >
                  AWS Training & Certification ↗
                </Link>

                <Text style={styles.ecosystemDescription}>
                  Build in-demand cloud skills.
                </Text>
              </td>

              <td
                style={{
                  ...styles.ecosystemItem,
                  borderBottom: "none",
                }}
              >
                <Link
                  href="https://awslpu.in"
                  style={styles.ecosystemLink}
                >
                  AWS LPU ↗
                </Link>

                <Text style={styles.ecosystemDescription}>
                  Explore the AWS community at LPU.
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section style={styles.footer}>
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={styles.footerTable}
        >
          <tbody>
            <tr>
              <td style={styles.footerBrand}>
                <Text style={styles.footerName}>
                  AWS Student Builder Group
                </Text>

                <Text style={styles.footerUniversity}>
                  Lovely Professional University
                </Text>

                <Link
                  href="https://awslpu.in"
                  style={styles.website}
                >
                  awslpu.in
                </Link>
              </td>

              <td style={styles.footerLinksCell}>
                <Text style={styles.footerLinks}>
                  <Link
                    href="https://builder.aws"
                    style={styles.footerLink}
                  >
                    Builder Center
                  </Link>

                  <span style={styles.separator}> · </span>

                  <Link
                    href="https://community.aws"
                    style={styles.footerLink}
                  >
                    Community
                  </Link>

                  <span style={styles.separator}> · </span>

                  <Link
                    href="https://events.aws"
                    style={styles.footerLink}
                  >
                    Events
                  </Link>
                </Text>
              </td>
            </tr>
          </tbody>
        </table>

        <Text style={styles.disclaimer}>
          This is an automated email from the AWS Student Builder
          Group. Please do not reply to this email.
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
    backgroundColor: "#111827",
    color: "#f9fafb",
  },

  header: {
    padding: 0,
    backgroundColor: "#111827",
    borderBottom: "1px solid #374151",
  },

  headerTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },

  brandCell: {
    width: "58%",
    padding: "34px 32px 30px",
    verticalAlign: "middle" as const,
  },

  logo: {
    display: "block",
    margin: "0 0 16px",
  },

  brandName: {
    margin: 0,
    fontSize: "17px",
    lineHeight: "23px",
    fontWeight: "600",
    letterSpacing: "-0.2px",
    color: "#ffffff",
  },

  brandUniversity: {
    margin: "5px 0 0",
    fontSize: "12px",
    lineHeight: "18px",
    color: "#9ca3af",
  },

  patternCell: {
    width: "42%",
    padding: 0,
    verticalAlign: "middle" as const,
  },

  patternTable: {
    borderCollapse: "collapse" as const,
    marginLeft: "auto",
    marginRight: "18px",
  },

  gridEmpty: {
    width: "38px",
    height: "38px",
    border: "1px solid #374151",
    backgroundColor: "#111827",
  },

  gridPurple: {
    width: "38px",
    height: "38px",
    backgroundColor: "#e9a8ff",
  },

  gridCyan: {
    width: "38px",
    height: "38px",
    backgroundColor: "#42e8d0",
  },

  gridPink: {
    width: "38px",
    height: "38px",
    backgroundColor: "#e7a8ff",
  },

  gridCyanSoft: {
    width: "38px",
    height: "38px",
    backgroundColor: "#9ee7ed",
  },
  content: {
    padding: "42px 40px",
    backgroundColor: "#111827",
  },

  greeting: {
    margin: "0 0 26px",
    fontSize: "15px",
    lineHeight: "24px",
    color: "#d1d5db",
  },

  heading: {
    margin: "0 0 24px",
    fontSize: "28px",
    lineHeight: "36px",
    fontWeight: "600",
    color: "#ffffff",
  },

  body: {
    fontSize: "15px",
    lineHeight: "26px",
    color: "#d1d5db",
  },

  signature: {
    marginTop: "34px",
  },

  regards: {
    margin: "0 0 4px",
    fontSize: "14px",
    lineHeight: "22px",
    color: "#9ca3af",
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
    fontSize: "13px",
    lineHeight: "20px",
    color: "#9ca3af",
  },

  ecosystem: {
    padding: "30px 40px",
    backgroundColor: "#0f172a",
    borderTop: "1px solid #374151",
  },

  ecosystemTitle: {
    margin: "0 0 18px",
    fontSize: "15px",
    lineHeight: "22px",
    fontWeight: "600",
    color: "#ffffff",
  },

  ecosystemTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },

  ecosystemItem: {
    width: "50%",
    padding: "14px 18px 14px 0",
    borderBottom: "1px solid #1f2937",
    verticalAlign: "top" as const,
  },

  ecosystemLink: {
    fontSize: "13px",
    lineHeight: "20px",
    fontWeight: "600",
    color: "#67e8f9",
  },

  ecosystemDescription: {
    margin: "4px 0 0",
    fontSize: "11px",
    lineHeight: "17px",
    color: "#9ca3af",
  },

  footer: {
    padding: "28px 40px 30px",
    backgroundColor: "#0b1120",
    borderTop: "1px solid #374151",
  },

  footerTable: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },

  footerBrand: {
    width: "50%",
    verticalAlign: "top" as const,
  },

  footerName: {
    margin: 0,
    fontSize: "12px",
    lineHeight: "18px",
    fontWeight: "600",
    color: "#e5e7eb",
  },

  footerUniversity: {
    margin: "2px 0",
    fontSize: "11px",
    lineHeight: "17px",
    color: "#6b7280",
  },

  website: {
    fontSize: "11px",
    lineHeight: "17px",
    color: "#67e8f9",
  },

  footerLinksCell: {
    width: "50%",
    textAlign: "right" as const,
    verticalAlign: "top" as const,
  },

  footerLinks: {
    margin: 0,
    fontSize: "10px",
    lineHeight: "18px",
  },

  footerLink: {
    color: "#9ca3af",
  },

  separator: {
    color: "#374151",
  },

  disclaimer: {
    margin: "24px 0 0",
    paddingTop: "18px",
    borderTop: "1px solid #1f2937",
    fontSize: "10px",
    lineHeight: "16px",
    color: "#6b7280",
  },
};