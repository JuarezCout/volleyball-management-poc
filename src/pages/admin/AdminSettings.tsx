import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardHeader } from "@/components/ui/Card";
import { Settings, CircleDot } from "lucide-react";

export function AdminSettings() {
  return (
    <AppLayout title="Configurações">
      <div className="p-4 sm:p-6 space-y-5 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
          <p className="text-slate-500 text-sm">Configurações do clube</p>
        </div>
        <Card>
          <CardHeader>Clube</CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <CircleDot size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">VoleiClub Lisboa</p>
                <p className="text-sm text-slate-500">voleiclub.pt</p>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader>POC Information</CardHeader>
          <div className="text-sm text-slate-500 space-y-2">
            <p>
              Esta é uma demonstração visual da plataforma de gestão do clube de
              voleibol.
            </p>
            <p>Os dados são mockados e a autenticação é simulada.</p>
            <p className="text-primary-600 font-medium">
              Stack: React · TypeScript · Vite · Tailwind CSS
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
