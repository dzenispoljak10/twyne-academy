import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  border: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 4,
    borderColor: '#185FA5',
    borderStyle: 'solid',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#185FA5',
  },
  logoGray: {
    color: '#2C2C2A',
  },
  certId: {
    fontSize: 8,
    color: '#888780',
  },
  divider: {
    height: 2,
    backgroundColor: '#185FA5',
    marginBottom: 32,
    opacity: 0.3,
  },
  center: {
    alignItems: 'center',
    marginBottom: 16,
  },
  smallLabel: {
    fontSize: 10,
    color: '#888780',
    marginBottom: 8,
    textAlign: 'center',
  },
  userName: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#2C2C2A',
    textAlign: 'center',
    marginBottom: 4,
  },
  birthDate: {
    fontSize: 11,
    color: '#888780',
    textAlign: 'center',
    marginBottom: 24,
  },
  completedText: {
    fontSize: 13,
    color: '#6B6A63',
    textAlign: 'center',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#185FA5',
    textAlign: 'center',
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  dateText: {
    fontSize: 10,
    color: '#888780',
  },
  signatureArea: {
    alignItems: 'flex-end',
  },
  signatureLine: {
    width: 120,
    height: 1,
    backgroundColor: '#888780',
    marginBottom: 4,
  },
  signatureText: {
    fontSize: 10,
    color: '#888780',
    fontFamily: 'Helvetica-Oblique',
  },
  qrArea: {
    alignItems: 'center',
    marginTop: 24,
  },
  qrPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#F1EFE8',
    borderWidth: 1,
    borderColor: '#D3D1C7',
    marginBottom: 6,
  },
  qrLabel: {
    fontSize: 8,
    color: '#888780',
    textAlign: 'center',
  },
})

interface CertificateTemplateProps {
  certNumber: string
  userName: string
  userBirth?: string
  courseTitle: string
  issuedAt: string
  locale: string
  appUrl: string
}

const completedText: Record<string, string> = {
  de: 'hat den Kurs erfolgreich abgeschlossen',
  en: 'has successfully completed the course',
  fr: 'a réussi le cours',
}

const issuedText: Record<string, string> = {
  de: 'Ausgestellt am',
  en: 'Issued on',
  fr: 'Délivré le',
}

export function CertificateTemplate({
  certNumber,
  userName,
  userBirth,
  courseTitle,
  issuedAt,
  locale,
  appUrl,
}: CertificateTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border} />

        <View style={styles.header}>
          <Text style={styles.logo}>
            <Text style={styles.logoGray}>Twyne</Text>Academy
          </Text>
          <Text style={styles.certId}>{certNumber}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.center}>
          <Text style={styles.smallLabel}>ZERTIFIKAT DER VOLLENDUNG</Text>
          <Text style={styles.userName}>{userName}</Text>
          {userBirth && <Text style={styles.birthDate}>* {userBirth}</Text>}
          <Text style={styles.completedText}>{completedText[locale] ?? completedText.de}</Text>
          <Text style={styles.courseTitle}>{courseTitle}</Text>
        </View>

        <View style={styles.qrArea}>
          <View style={styles.qrPlaceholder} />
          <Text style={styles.qrLabel}>
            {appUrl}/verify/{certNumber}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.dateText}>
            {issuedText[locale] ?? issuedText.de} {issuedAt}
          </Text>
          <View style={styles.signatureArea}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Twyne Academy</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
