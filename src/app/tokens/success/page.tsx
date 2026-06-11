import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TokenSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <Sidebar />
      <main className="flex-1 p-6">
        <Card className="mx-auto max-w-md text-center">
          <CardHeader><CardTitle>Zahtev poslat!</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Zahtev je poslat adminu. Potvrda stiže na vaš email. Predračun sa IPS QR kodom admin šalje ručno — stiže na isti email kada admin klikne „Pošalji predračun”. Tokeni se dodaju kada admin potvrdi uplatu.
            </p>
            <Link href="/tokens"><Button>Povratak na tokene</Button></Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
