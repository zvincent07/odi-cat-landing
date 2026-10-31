import React, { useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, X, ZoomIn, ZoomOut } from 'lucide-react';
import { ODI_DATA } from '../data/catData';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAge: string;
}

// All certificate styles are 100% inline to guarantee PDF matches preview exactly.
const S = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    backgroundColor: 'rgba(15,23,42,0.75)',
    backdropFilter: 'blur(4px)',
  },
  shell: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
    maxWidth: '920px',
    width: '100%',
    maxHeight: '96vh',
    display: 'flex',
    flexDirection: 'column' as const,
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(245,158,11,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  headerTitle: {
    fontWeight: 800,
    fontSize: 14,
    letterSpacing: '0.08em',
    color: '#0f172a',
    fontFamily: 'Cinzel, Georgia, serif',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  downloadBtn: {
    backgroundColor: '#f59e0b',
    color: '#0f172a',
    fontWeight: 900,
    fontSize: 13,
    padding: '8px 18px',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(245,158,11,0.25)',
  },
  closeBtn: {
    padding: 8,
    borderRadius: 10,
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    cursor: 'pointer',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto' as const,
    overflowX: 'auto' as const,
    backgroundColor: '#e2e8f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '24px',
  },
};

// Certificate inner styles — all inline, no Tailwind, so html2canvas captures them perfectly
const certPx = {
  root: {
    width: 840,
    minWidth: 840,
    height: 560,
    minHeight: 560,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
    padding: '32px 36px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    border: '2px solid rgba(180,120,30,0.35)',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  outerBorder: {
    position: 'absolute' as const,
    inset: 10,
    border: '1.5px solid rgba(180,120,30,0.40)',
    borderRadius: 10,
    pointerEvents: 'none' as const,
  },
  innerBorder: {
    position: 'absolute' as const,
    inset: 15,
    border: '0.5px solid rgba(180,120,30,0.20)',
    borderRadius: 7,
    pointerEvents: 'none' as const,
  },
  cornerTL: {
    position: 'absolute' as const,
    top: 18,
    left: 18,
    fontSize: 10,
    color: '#b45309',
    fontFamily: 'Cinzel, Georgia, serif',
    letterSpacing: 2,
  },
  cornerTR: {
    position: 'absolute' as const,
    top: 18,
    right: 18,
    fontSize: 10,
    color: '#b45309',
    fontFamily: 'Cinzel, Georgia, serif',
    letterSpacing: 2,
  },
  cornerBL: {
    position: 'absolute' as const,
    bottom: 18,
    left: 18,
    fontSize: 10,
    color: '#b45309',
    fontFamily: 'Cinzel, Georgia, serif',
    letterSpacing: 2,
  },
  cornerBR: {
    position: 'absolute' as const,
    bottom: 18,
    right: 18,
    fontSize: 10,
    color: '#b45309',
    fontFamily: 'Cinzel, Georgia, serif',
    letterSpacing: 2,
  },
  watermark: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 200,
    opacity: 0.025,
    pointerEvents: 'none' as const,
    userSelect: 'none' as const,
    zIndex: 0,
  },
  // Header
  certHeader: {
    textAlign: 'center' as const,
    position: 'relative' as const,
    zIndex: 1,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '2px 12px',
    borderRadius: 999,
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    color: '#78350f',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    fontFamily: 'Georgia, serif',
    marginBottom: 6,
  },
  certTitle: {
    fontFamily: 'Cinzel, Georgia, serif',
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: '0.12em',
    color: '#0f172a',
    textTransform: 'uppercase' as const,
    margin: '0 0 3px',
  },
  certSubtitle: {
    fontSize: 9,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.22em',
    fontWeight: 700,
    color: '#475569',
    fontFamily: 'Georgia, serif',
  },
  // Identity section
  identityRow: {
    display: 'flex',
    gap: 14,
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '12px 14px',
    position: 'relative' as const,
    zIndex: 1,
    alignItems: 'center',
  },
  // Photo block
  photoWrap: {
    position: 'relative' as const,
    width: 68,
    height: 68,
    flexShrink: 0,
  },
  photo: {
    width: 68,
    height: 68,
    borderRadius: 10,
    objectFit: 'cover' as const,
    border: '2px solid #f59e0b',
    display: 'block',
  },
  photoBadge: {
    position: 'absolute' as const,
    bottom: -4,
    right: -4,
    backgroundColor: '#f59e0b',
    borderRadius: '50%',
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    zIndex: 2,
  },
  // Name block
  nameBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    minWidth: 90,
  },
  nameLabel: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: '#b45309',
    fontFamily: 'Cinzel, Georgia, serif',
  },
  nameValue: {
    fontFamily: 'Cinzel, Georgia, serif',
    fontSize: 24,
    fontWeight: 900,
    color: '#0f172a',
    letterSpacing: '0.05em',
    lineHeight: 1.1,
    margin: '2px 0 0',
  },
  nameSub: {
    fontSize: 9,
    fontWeight: 700,
    color: '#475569',
    marginTop: 3,
    fontFamily: 'Georgia, serif',
  },
  // Divider
  vDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#e2e8f0',
    flexShrink: 0,
    margin: '0 2px',
  },
  // Lineage block
  lineageBlock: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    gap: 4,
  },
  lineageLabel: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: '#64748b',
    fontFamily: 'Cinzel, Georgia, serif',
    marginBottom: 2,
  },
  lineageBreed: {
    fontSize: 11,
    fontWeight: 800,
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
  },
  lineageRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 9,
    fontFamily: 'Georgia, serif',
  },
  lineageKey: {
    color: '#64748b',
    fontWeight: 600,
  },
  lineageVal: {
    fontWeight: 700,
    color: '#1e293b',
  },
  // Age / milestone block
  milestoneBlock: {
    textAlign: 'right' as const,
    minWidth: 110,
  },
  milestoneLabel: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: '#b45309',
    fontFamily: 'Cinzel, Georgia, serif',
  },
  milestoneValue: {
    fontSize: 17,
    fontWeight: 900,
    color: '#0f172a',
    fontFamily: 'Georgia, serif',
    margin: '2px 0 0',
  },
  milestoneDob: {
    fontSize: 8,
    fontWeight: 600,
    color: '#64748b',
    marginTop: 2,
    fontFamily: 'Georgia, serif',
  },
  milestoneChip: {
    display: 'inline-block',
    marginTop: 4,
    fontSize: 7,
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: '1px solid #6ee7b7',
    borderRadius: 999,
    padding: '2px 8px',
    fontWeight: 700,
    fontFamily: 'Georgia, serif',
  },
  // Grid of 3 info boxes
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 10,
    position: 'relative' as const,
    zIndex: 1,
  },
  infoBox: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  infoBoxTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    color: '#1e293b',
    fontFamily: 'Cinzel, Georgia, serif',
    marginBottom: 6,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 9,
    marginBottom: 3,
    fontFamily: 'Georgia, serif',
  },
  infoKey: { color: '#64748b', fontWeight: 600 },
  infoVal: { fontWeight: 700, color: '#1e293b' },
  infoValGreen: { fontWeight: 700, color: '#047857' },
  infoValBlue: { fontWeight: 700, color: '#1d4ed8' },
  // Footer / signatures
  sigFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 10,
    position: 'relative' as const,
    zIndex: 1,
  },
  sigBlock: {
    width: 200,
  },
  sigLine: {
    borderBottom: '1.5px dashed #cbd5e1',
    height: 22,
    display: 'flex',
    alignItems: 'flex-end',
    fontFamily: 'Georgia, serif',
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
    paddingBottom: 2,
  },
  sigLabel: {
    fontSize: 7.5,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.12em',
    color: '#64748b',
    marginTop: 4,
    fontFamily: 'Cinzel, Georgia, serif',
  },
  seal: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 3,
  },
  sealRing: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    backgroundColor: '#f59e0b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
  },
  sealInner: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: '1px solid #fbbf24',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  sealPaw: { fontSize: 16, lineHeight: 1 },
  sealText: {
    fontSize: 5,
    fontWeight: 900,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    color: '#b45309',
    fontFamily: 'Cinzel, Georgia, serif',
  },
  sealCaption: {
    fontSize: 6,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    color: '#64748b',
    fontFamily: 'Cinzel, Georgia, serif',
  },
  dateBlock: {
    width: 200,
    textAlign: 'right' as const,
  },
  dateLine: {
    borderBottom: '1.5px dashed #cbd5e1',
    height: 22,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    fontFamily: 'Georgia, serif',
    fontSize: 11,
    fontWeight: 700,
    color: '#0f172a',
    paddingBottom: 2,
  },
};

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  currentAge,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'fit' | 'full'>('fit');

  useEffect(() => {
    if (!isOpen) return;

    const measure = () => {
      setIsMobile(window.innerWidth < 768);
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      } else {
        setContainerWidth(window.innerWidth);
      }
    };

    measure();
    const t = setTimeout(measure, 50);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const issueDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate dynamic responsive scale
  const paddingH = isMobile ? 16 : 40;
  const availW = containerWidth > 0 ? Math.max(260, containerWidth - paddingH) : (typeof window !== 'undefined' ? window.innerWidth - 32 : 840);
  const fitScale = Math.min(1, availW / 840);
  const actualScale = (viewMode === 'fit' && !isGenerating) ? fitScale : 1;
  const renderedWidth = 840 * actualScale;
  const renderedHeight = 560 * actualScale;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    try {
      // Small pause to allow scale reset
      await new Promise((r) => setTimeout(r, 60));

      // Capture at 3x for crisp PDF
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        width: 840,
        height: 560,
        windowWidth: 840,
        windowHeight: 560,
        onclone: (clonedDoc) => {
          const scaleWrap = clonedDoc.getElementById('odi-cert-scale-wrapper');
          if (scaleWrap) {
            scaleWrap.style.transform = 'none';
            scaleWrap.style.width = '840px';
            scaleWrap.style.height = '560px';
          }
        },
      });

      const imgData = canvas.toDataURL('image/png');

      // A4 landscape: 297mm × 210mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageW = pdf.internal.pageSize.getWidth();  // 297
      const pageH = pdf.internal.pageSize.getHeight(); // 210

      // Add 10mm margin all around
      const margin = 10;
      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2;

      // canvas is 840*3=2520 x 560*3=1680 px
      const ratio = Math.min(availW / canvas.width, availH / canvas.height);
      const drawW = canvas.width * ratio;
      const drawH = canvas.height * ratio;
      const offsetX = margin + (availW - drawW) / 2;
      const offsetY = margin + (availH - drawH) / 2;

      pdf.addImage(imgData, 'PNG', offsetX, offsetY, drawW, drawH);

      const blobUrl = URL.createObjectURL(pdf.output('blob'));
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'Odi_Royal_Pedigree_Certificate.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      style={{
        ...S.overlay,
        padding: isMobile ? '8px' : '16px',
      }}
    >
      <div
        style={{
          ...S.shell,
          borderRadius: isMobile ? '16px' : '20px',
          maxHeight: isMobile ? '98vh' : '96vh',
        }}
      >
        {/* Loading overlay for high-res PDF generation */}
        {isGenerating && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(4px)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                border: '3px solid #f59e0b',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <div
              style={{
                fontWeight: 800,
                fontSize: 14,
                color: '#0f172a',
                fontFamily: 'Cinzel, Georgia, serif',
                letterSpacing: '0.05em',
              }}
            >
              Rendering High-Definition PDF…
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Formatting A4 Landscape with official seal
            </div>
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '10px 12px' : '14px 18px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            flexShrink: 0,
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10, minWidth: 0 }}>
            <div
              style={{
                width: isMobile ? 30 : 34,
                height: isMobile ? 30 : 34,
                borderRadius: 10,
                backgroundColor: 'rgba(245,158,11,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? 16 : 18,
                flexShrink: 0,
              }}
            >
              👑
            </div>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: isMobile ? 12 : 14,
                  letterSpacing: '0.06em',
                  color: '#0f172a',
                  fontFamily: 'Cinzel, Georgia, serif',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                ROYAL FELINE DIPLOMA
              </div>
              {!isMobile && (
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
                  Official High-Definition Print Layout
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 8, flexShrink: 0 }}>
            {/* View Mode Toggle when scaled */}
            {fitScale < 0.98 && (
              <button
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: 12,
                  padding: isMobile ? '6px 10px' : '8px 12px',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  border: '1px solid #cbd5e1',
                  cursor: 'pointer',
                }}
                onClick={() => setViewMode((v) => (v === 'fit' ? 'full' : 'fit'))}
                title={viewMode === 'fit' ? 'View 100% full scale' : 'Fit to screen'}
              >
                {viewMode === 'fit' ? (
                  <>
                    <ZoomIn size={13} />
                    <span>100%</span>
                  </>
                ) : (
                  <>
                    <ZoomOut size={13} />
                    <span>Fit</span>
                  </>
                )}
              </button>
            )}

            <button
              style={{
                backgroundColor: '#f59e0b',
                color: '#0f172a',
                fontWeight: 900,
                fontSize: isMobile ? 12 : 13,
                padding: isMobile ? '6px 12px' : '8px 18px',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                border: 'none',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                opacity: isGenerating ? 0.6 : 1,
                boxShadow: '0 4px 14px rgba(245,158,11,0.25)',
                whiteSpace: 'nowrap',
              }}
              onClick={handleDownloadPDF}
              disabled={isGenerating}
            >
              <Download size={14} />
              {isGenerating ? 'Rendering…' : (isMobile ? 'PDF' : 'Download .PDF')}
            </button>

            <button
              style={{
                padding: isMobile ? 6 : 8,
                borderRadius: 10,
                border: 'none',
                background: 'transparent',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={onClose}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scroll area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'auto',
            backgroundColor: '#e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: viewMode === 'fit' ? 'center' : 'flex-start',
            padding: isMobile ? '12px 8px' : '20px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div
            ref={containerRef}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100%',
            }}
          >
            {/* Scaled certificate container */}
            <div
              style={{
                width: renderedWidth,
                height: renderedHeight,
                margin: '0 auto',
                position: 'relative',
                flexShrink: 0,
                transition: 'width 0.2s ease, height 0.2s ease',
              }}
            >
              <div
                id="odi-cert-scale-wrapper"
                style={{
                  transform: `scale(${actualScale})`,
                  transformOrigin: 'top left',
                  width: 840,
                  height: 560,
                  transition: 'transform 0.2s ease',
                }}
              >
                {/* ── CERTIFICATE CANVAS (inline-styled only) ── */}
                <div ref={certificateRef} id="odi-cert-canvas" style={certPx.root}>
            {/* Decorative borders */}
            <div style={certPx.outerBorder} />
            <div style={certPx.innerBorder} />

            {/* Corner filigree */}
            <div style={certPx.cornerTL}>✦ ──── ✦</div>
            <div style={certPx.cornerTR}>✦ ──── ✦</div>
            <div style={certPx.cornerBL}>✦ ──── ✦</div>
            <div style={certPx.cornerBR}>✦ ──── ✦</div>

            {/* Watermark */}
            <div style={certPx.watermark}>🐾</div>

            {/* ── HEADER ── */}
            <div style={certPx.certHeader}>
              <div>
                <span style={certPx.badge}>
                  ★ OFFICIAL FELINE REGISTRATION &amp; DIPLOMA ★
                </span>
              </div>
              <h1 style={certPx.certTitle}>Certificate of Pedigree</h1>
              <p style={certPx.certSubtitle}>
                Distinguished Turkish Angora &amp; Persian Bloodline
              </p>
            </div>

            {/* ── IDENTITY ROW ── */}
            <div style={certPx.identityRow}>
              {/* Photo */}
              <div style={certPx.photoWrap}>
                <img src="/odi-portrait.jpg" alt="Odi" style={certPx.photo} />
                <div style={certPx.photoBadge}>🐾</div>
              </div>

              {/* Name block */}
              <div style={certPx.nameBlock}>
                <span style={certPx.nameLabel}>Feline Name</span>
                <h2 style={certPx.nameValue}>ODI</h2>
                <p style={certPx.nameSub}>♂ Male • Smoke Charcoal</p>
              </div>

              <div style={certPx.vDivider} />

              {/* Lineage */}
              <div style={certPx.lineageBlock}>
                <span style={certPx.lineageLabel}>Breed Classification</span>
                <p style={certPx.lineageBreed}>Turkish Angora × Persian Mix</p>
                <div style={certPx.lineageRow}>
                  <span style={certPx.lineageKey}>Sire (Father):</span>
                  <span style={certPx.lineageVal}>{ODI_DATA.father}</span>
                </div>
                <div style={certPx.lineageRow}>
                  <span style={certPx.lineageKey}>Dam (Mother):</span>
                  <span style={certPx.lineageVal}>{ODI_DATA.mother}</span>
                </div>
              </div>

              <div style={certPx.vDivider} />

              {/* Milestone */}
              <div style={certPx.milestoneBlock}>
                <span style={certPx.milestoneLabel}>Current Milestone</span>
                <p style={certPx.milestoneValue}>{currentAge}</p>
                <p style={certPx.milestoneDob}>Born: {ODI_DATA.dob}</p>
                <span style={certPx.milestoneChip}>✓ Certified Health</span>
              </div>
            </div>

            {/* ── INFO GRID ── */}
            <div style={certPx.infoGrid}>
              {/* Box 1 */}
              <div style={certPx.infoBox}>
                <div style={certPx.infoBoxTitle}>
                  <span style={{ color: '#059669' }}>🛡</span> Health &amp; Vaccines
                </div>
                <div style={certPx.infoRow}>
                  <span style={certPx.infoKey}>Deworming:</span>
                  <span style={certPx.infoValGreen}>3× Completed</span>
                </div>
                <div style={certPx.infoRow}>
                  <span style={certPx.infoKey}>Vitamins:</span>
                  <span style={certPx.infoVal}>LC Plus &amp; Coatshine</span>
                </div>
              </div>

              {/* Box 2 */}
              <div style={certPx.infoBox}>
                <div style={certPx.infoBoxTitle}>
                  <span style={{ color: '#3b82f6' }}>✔</span> Habit Training
                </div>
                <div style={certPx.infoRow}>
                  <span style={certPx.infoKey}>Litter Box:</span>
                  <span style={certPx.infoValGreen}>100% Trained ✅</span>
                </div>
                <div style={certPx.infoRow}>
                  <span style={certPx.infoKey}>Bath Routine:</span>
                  <span style={certPx.infoValBlue}>Calm &amp; Trained ✅</span>
                </div>
              </div>

              {/* Box 3 */}
              <div style={certPx.infoBox}>
                <div style={certPx.infoBoxTitle}>
                  <span style={{ color: '#d97706' }}>✦</span> Nutrition Protocol
                </div>
                <div style={certPx.infoRow}>
                  <span style={certPx.infoKey}>Kibble:</span>
                  <span style={certPx.infoVal}>Whiskas Kitten</span>
                </div>
                <div style={certPx.infoRow}>
                  <span style={certPx.infoKey}>Fresh:</span>
                  <span style={certPx.infoVal}>Tuna, Chicken &amp; Squash</span>
                </div>
              </div>
            </div>

            {/* ── FOOTER / SIGNATURES ── */}
            <div style={certPx.sigFooter}>
              {/* Caregiver signature */}
              <div style={certPx.sigBlock}>
                <div style={certPx.sigLine}>Jv &amp; Michaella Paulene</div>
                <p style={certPx.sigLabel}>Authorized Caregivers Signature</p>
              </div>

              {/* Official seal */}
              <div style={certPx.seal}>
                <div style={certPx.sealRing}>
                  <div style={certPx.sealInner}>
                    <span style={certPx.sealPaw}>🐾</span>
                    <span style={certPx.sealText}>OFFICIAL</span>
                  </div>
                </div>
                <span style={certPx.sealCaption}>ROYAL PAW SEAL</span>
              </div>

              {/* Date */}
              <div style={certPx.dateBlock}>
                <div style={certPx.dateLine}>{issueDate}</div>
                <p style={{ ...certPx.sigLabel, textAlign: 'right' }}>
                  Issue Date &amp; Validation
                </p>
              </div>
            </div>
            </div>
            {/* ── END CERTIFICATE CANVAS ── */}
          </div>
        </div>

        {/* Mobile helper notice */}
        {isMobile && !isGenerating && (
          <div
            style={{
              marginTop: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              color: '#475569',
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(4px)',
              padding: '4px 12px',
              borderRadius: 20,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              fontWeight: 600,
            }}
          >
            {viewMode === 'fit' ? (
              <span>✦ Scaled to fit screen • Tap "100%" for full view</span>
            ) : (
              <span>↔ Swipe horizontally to pan full certificate</span>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
</div>
);
};
