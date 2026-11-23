import { useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const BottomSheet = ({
  open,
  onClose,
  height,
  children,
  draggable = false,
}) => {
  const contentRef = useRef(null);

  const isAtTop = () => contentRef.current?.scrollTop === 0;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="no-scrollbar mx-auto w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white"
            style={{
              height: height ?? "auto",
              maxHeight: "calc(100% - env(safe-area-inset-top) - 80px)",
            }}
            drag={!draggable ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0}
            onDragEnd={(_, info) => {
              if (info.offset.y > 10 && isAtTop()) {
                onClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", stiffness: 400, damping: 60 }}
          >
            <div className="sticky top-0 z-10 bg-white py-2">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300" />
            </div>

            <div
              ref={contentRef}
              className="no-scrollbar h-full flex-1 overflow-y-auto"
              style={{
                touchAction: "pan-y",
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default BottomSheet;
