import { GuestLayout } from "@/components/layout/guest-layout";

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestLayout>{children}</GuestLayout>;
}
