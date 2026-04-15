import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  accepted: boolean | null;
  visible: boolean;
}

export function AcceptanceDisplay({ accepted, visible }: Props) {
  if (!visible || accepted === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`
        rounded-2xl p-4 flex items-center gap-3 font-bold text-lg
        ${accepted
          ? 'glass border-success/40 glow-success text-success'
          : 'glass border-destructive/40 glow-destructive text-destructive'
        }
      `}
    >
      {accepted ? (
        <>
          <CheckCircle2 className="w-6 h-6" />
          <span>String Accepted ✓</span>
        </>
      ) : (
        <>
          <XCircle className="w-6 h-6" />
          <span>String Rejected ✗</span>
        </>
      )}
    </motion.div>
  );
}
