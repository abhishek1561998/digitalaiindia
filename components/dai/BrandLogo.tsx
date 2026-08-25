import styles from "./marketing-landing.module.css";

// Single source of truth for the brand lockup.
//
// This used to be copy-pasted into 20 files, which is exactly how /auth and
// the dashboard drifted onto a different mark and wordmark. Change it here
// and it changes everywhere — including switching to the image logo, which
// is a one-line edit to USE_IMAGE_LOGO below.

const USE_IMAGE_LOGO = false;

// Exported so the screens with bespoke lockup layouts (auth, dashboard,
// certificate) draw the identical mark instead of their own copy.
export const BrandMark = ({ size = 16, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const BoltMark = () => <BrandMark size={16} />;

export function BrandLogo({ href }: { href?: string }) {
  const content = USE_IMAGE_LOGO ? (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="DigitalAIIndia" className={styles.logoImage} />
    </>
  ) : (
    <>
      <div className={styles.logoIcon}><BoltMark /></div>
      <span>DigitalAI<span className={styles.logoIndia}>India</span></span>
    </>
  );

  if (href) {
    return <a href={href} className={styles.navLogo}>{content}</a>;
  }
  return <div className={styles.navLogo}>{content}</div>;
}
