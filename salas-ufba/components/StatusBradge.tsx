type Status = "OCUPADA" | "LIVRE" | "EM_REUNIAO";
type Variant = "default" | "tv";

interface StatusBadgeProps {
  status: Status;
  variant?: Variant;
}

const statusConfig: Record<Status, Record<Variant, { label: string; className: string }>> = {
  OCUPADA: {
    default: { label: "OCUPADA", className: "bg-indigo-900 text-white" },
    tv: { label: "OCUPADA", className: "bg-red-600 text-white" },
  },
  LIVRE: {
    default: { label: "LIVRE", className: "bg-gray-200 text-gray-600" },
    tv: { label: "LIVRE", className: "bg-gray-500 text-white" },
  },
  EM_REUNIAO: {
    default: { label: "EM REUNIÃO", className: "bg-red-100 text-red-500" },
    tv: { label: "EM REUNIÃO", className: "bg-red-600 text-white" },
  },
};

export default function StatusBadge({ status, variant = "default" }: StatusBadgeProps) {
  const { label, className } = statusConfig[status][variant];

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${className}`}>
      {label}
    </span>
  );
}