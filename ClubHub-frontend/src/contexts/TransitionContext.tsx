import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

interface TransitionContextValue {
  /** Mostra o overlay de transição */
  showTransition: () => void;
  /** Esconde o overlay de transição */
  hideTransition: () => void;
  /** Estado atual do overlay */
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextValue>({
  showTransition: () => {},
  hideTransition: () => {},
  isTransitioning: false,
});

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Guard para não esconder antes do tempo mínimo (evita flash)
  const minTimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHide = useRef(false);

  const showTransition = useCallback(() => {
    pendingHide.current = false;
    setIsTransitioning(true);
    // Tempo mínimo de 300ms para o overlay ser visível (evita flash rápido)
    minTimeRef.current = setTimeout(() => {
      minTimeRef.current = null;
      if (pendingHide.current) {
        setIsTransitioning(false);
        pendingHide.current = false;
      }
    }, 300);
  }, []);

  const hideTransition = useCallback(() => {
    if (minTimeRef.current) {
      // ainda no tempo mínimo - agenda hide para depois
      pendingHide.current = true;
    } else {
      setIsTransitioning(false);
    }
  }, []);

  return (
    <TransitionContext.Provider
      value={{ showTransition, hideTransition, isTransitioning }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);
