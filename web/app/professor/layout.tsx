import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfessorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["PROFESSOR"]}>
      {children}
    </ProtectedRoute>
  );
}
