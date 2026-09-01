import { useEffect, useState } from 'react';

export function DevelopmentAgentation() {
  const [Agentation, setAgentation] = useState(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;

    let mounted = true;

    // Keep the feedback toolbar from delaying the portfolio's initial render.
    import('agentation')
      .then(({ Agentation: AgentationComponent }) => {
        if (mounted) setAgentation(() => AgentationComponent);
      })
      .catch((error) => console.error('Agentation konnte nicht geladen werden.', error));

    return () => {
      mounted = false;
    };
  }, []);

  return Agentation ? <Agentation /> : null;
}
