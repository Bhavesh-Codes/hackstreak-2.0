/**
 * LoadingSpinner — CSS-animated circular spinner using the --accent colour.
 *
 * Props:
 *   size  — 'sm' | 'md' | 'lg'  (default: 'md')
 *   text  — optional loading message string
 */

const SIZE_CLASS = {
  sm: 'spinner spinner-sm',
  md: 'spinner',
  lg: 'spinner spinner-lg',
};

export function LoadingSpinner({ size = 'md', text }) {
  const spinnerClass = SIZE_CLASS[size] ?? SIZE_CLASS.md;

  if (text) {
    return (
      <div className="loading-area" role="status" aria-live="polite">
        <div className={spinnerClass} aria-hidden="true" />
        <span>{text}</span>
      </div>
    );
  }

  return (
    <div className={spinnerClass} role="status" aria-label="Loading" />
  );
}

export default LoadingSpinner;
