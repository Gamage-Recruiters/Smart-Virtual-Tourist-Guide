import Direction from './Direction';

// Keep the start-page behavior on the same navigation engine while its UI is split out.
export default function StartPage() {
  return <Direction showDetailsPanel={false} />;
}
