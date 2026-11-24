import { Component, type ReactNode } from "react";
import { WifiOff } from "lucide-react";

type Props = { children: ReactNode; fallback?: ReactNode; resetKey?: string };
type State = { failed: boolean };

// A screen whose code is still on the server (first visit, no signal) would otherwise leave a blank page.
// This catches that one failure and offers a way back, while the rest of the app keeps working.
export class ChunkBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidUpdate(prev: Props) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div role="alert" className="mx-auto mt-10 grid max-w-md gap-3 rounded-3xl border border-border/70 bg-card p-6 text-center">
        <WifiOff aria-hidden className="mx-auto h-6 w-6 text-accent" />
        <p className="font-serif text-lg font-semibold text-foreground">This screen needs a signal the first time</p>
        <p className="text-sm leading-relaxed text-muted-foreground">Once it opens with a connection, it stays on this phone for offline use. Today is ready now.</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Try again</button>
          <a href="/today" className="inline-flex min-h-11 items-center rounded-full border border-border/70 px-5 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Go to Today</a>
        </div>
      </div>
    );
  }
}
