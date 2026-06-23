
"use client"

import React, { useState } from 'react'
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/dashboard/SidebarNav"
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard"
import { Language } from "@/app/lib/translations"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [lang, setLang] = useState<Language>('es')
  const [inputs, setInputs] = useState({
    category: 'retail',
    grossIncome: 150000,
    taxRate: 2.5,
    minimumTaxable: 5000
  })

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <SidebarNav 
          lang={lang} 
          setLang={setLang} 
          inputs={inputs} 
          setInputs={setInputs} 
        />
        
        <SidebarInset className="flex flex-col w-full h-full overflow-y-auto">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b bg-background/80 backdrop-blur-md px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {lang === 'es' ? 'Simulador de Tasas Municipales' : 'Municipal Tax Simulator'}
              </span>
            </div>
          </header>
          
          <main className="flex-1 bg-muted/20">
            <AnalyticsDashboard lang={lang} inputs={inputs} />
          </main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
