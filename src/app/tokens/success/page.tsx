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
              Vaš zahtev za tokene je poslat. Admin će proveriti uplatu i odobriti tokene na vaš nalog.
            </p>
            <Link href="/tokens"><Button>Povratak na tokene</Button></Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
