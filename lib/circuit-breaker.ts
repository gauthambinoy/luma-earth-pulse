// ══════════════════════════════════════════════════════
// Circuit Breaker Pattern — Production-grade API resilience
// States: CLOSED (healthy) → OPEN (failing) → HALF_OPEN (testing)
// ══════════════════════════════════════════════════════

export type CircuitState = "closed" | "open" | "half_open";

interface CircuitBreakerConfig {
  failureThreshold: number;  // failures before opening
  resetTimeout: number;      // ms before trying again
  halfOpenRequests: number;  // test requests in half-open
}

interface CircuitMetrics {
  name: string;
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure: number | null;
  lastSuccess: number | null;
  lastResponseMs: number | null;
  totalRequests: number;
  errorRate: number;
  avgResponseMs: number;
  p95ResponseMs: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  resetTimeout: 30000,
  halfOpenRequests: 2,
};

class CircuitBreaker {
  private state: CircuitState = "closed";
  private failures = 0;
  private successes = 0;
  private lastFailureTime = 0;
  private responseTimes: number[] = [];
  private totalRequests = 0;
  private totalErrors = 0;
  private lastResponseMs: number | null = null;
  private lastSuccess: number | null = null;
  private lastFailure: number | null = null;

  constructor(
    public readonly name: string,
    private config: CircuitBreakerConfig = DEFAULT_CONFIG
  ) {}

  async execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeout) {
        this.state = "half_open";
      } else if (fallback) {
        return fallback();
      } else {
        throw new Error(`Circuit ${this.name} is OPEN`);
      }
    }

    const start = Date.now();
    this.totalRequests++;

    try {
      const result = await fn();
      const elapsed = Date.now() - start;
      this.lastResponseMs = elapsed;
      this.lastSuccess = Date.now();
      this.responseTimes.push(elapsed);
      if (this.responseTimes.length > 100) this.responseTimes.shift();

      this.successes++;
      if (this.state === "half_open") {
        if (this.successes >= this.config.halfOpenRequests) {
          this.state = "closed";
          this.failures = 0;
        }
      } else {
        this.failures = 0;
      }

      return result;
    } catch (error) {
      const elapsed = Date.now() - start;
      this.lastResponseMs = elapsed;
      this.lastFailure = Date.now();
      this.responseTimes.push(elapsed);
      if (this.responseTimes.length > 100) this.responseTimes.shift();

      this.failures++;
      this.totalErrors++;
      this.lastFailureTime = Date.now();

      if (this.failures >= this.config.failureThreshold) {
        this.state = "open";
      }

      if (fallback) return fallback();
      throw error;
    }
  }

  getMetrics(): CircuitMetrics {
    const sorted = [...this.responseTimes].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    return {
      name: this.name,
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailure: this.lastFailure,
      lastSuccess: this.lastSuccess,
      lastResponseMs: this.lastResponseMs,
      totalRequests: this.totalRequests,
      errorRate: this.totalRequests > 0 ? (this.totalErrors / this.totalRequests) * 100 : 0,
      avgResponseMs: sorted.length > 0 ? Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length) : 0,
      p95ResponseMs: sorted.length > 0 ? sorted[p95Index] || sorted[sorted.length - 1] : 0,
    };
  }
}

// Global circuit breaker registry
const breakers: Map<string, CircuitBreaker> = new Map();

export function getCircuitBreaker(name: string, config?: CircuitBreakerConfig): CircuitBreaker {
  if (!breakers.has(name)) {
    breakers.set(name, new CircuitBreaker(name, config));
  }
  return breakers.get(name)!;
}

export function getAllMetrics(): CircuitMetrics[] {
  return Array.from(breakers.values()).map((b) => b.getMetrics());
}

export type { CircuitMetrics };
