// components/StatusBadge.jsx
const STATUS_STYLES = {
  Active:     { bg: '#dcfce7', color: '#166534' },
  Monitoring: { bg: '#fef9c3', color: '#854d0e' },
  Critical:   { bg: '#fee2e2', color: '#991b1b' },
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES['Monitoring'];
  return (
    <span style={{ background: style.bg, color: style.color,
                   padding: '2px 10px', borderRadius: '9999px',
                   fontSize: '0.75rem', fontWeight: 600 }}>
      {status}
    </span>
  );
}
