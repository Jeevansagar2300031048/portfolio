import { useTransition } from "./TransitionProvider";

export default function CircuitLink({ to, children }) {
  const { startTransition, isTransitioning } = useTransition();

  return children({
    onClick: (event) => startTransition(event, to),
    isTransitioning
  });
}
