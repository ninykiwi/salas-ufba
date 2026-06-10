type Status = "OCUPADA" | "LIVRE" | "EM_REUNIAO";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  OCUPADA: {
    label: "OCUPADA",
    className: "bg-[#1A237E] text-white",
  },
  LIVRE: {
    label: "LIVRE",
    className: "bg-gray-200 text-gray-600",
  },
  EM_REUNIAO: {
    label: "EM REUNIÃO",
    className: "bg-red-100 text-red-700",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = statusConfig[status];

  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${className}`}>
      {label}
    </span>
  );
}