import { useEffect, useRef, useState } from 'react';
import { ModalProps } from '@/types';

const FOOTER_GAP = 48;

const Modal = ({ open, onClose, children, style, footer }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerTop, setFooterTop] = useState<number>();

  useEffect(() => {
    if (!open) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Ignore clicks inside modal or footer
      if (
        modalRef.current?.contains(target) ||
        footerRef.current?.contains(target)
      ) {
        return;
      }
      onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);

    if (footer && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setFooterTop(rect.bottom + FOOTER_GAP);
    }

    return () => {
      document.body.style.overflow = ''; // Make sure to enable scroll on unmount
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, footer]);

  // Return null if modal is not open
  if (!open) return null;

  return (
    <div className="bg-black-900/50 pointer-events-auto fixed inset-0 z-[100] flex h-dvh w-dvw items-center justify-center backdrop-blur-lg">
      <div
        ref={modalRef}
        className="border-background-dark-100 max-h-[90vh] overflow-y-scroll rounded-3xl border backdrop-blur-lg"
        style={{
          translate: footer ? `0 -${FOOTER_GAP}px` : undefined,
          ...style,
        }}
      >
        {children}
      </div>

      {footer && footerTop !== undefined && (
        <div
          ref={footerRef}
          className="absolute text-center"
          style={{ top: `${footerTop}px` }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Modal;
