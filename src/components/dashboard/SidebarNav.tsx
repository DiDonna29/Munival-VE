
"use client"

import React from 'react'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calculator, Globe, LayoutDashboard, FileText, TrendingUp } from "lucide-react"
import { Language, translations } from "@/app/lib/translations"
import { Button } from "@/components/ui/button"

interface SidebarNavProps {
  lang: Language
  setLang: (l: Language) => void
  inputs: {
    grossIncome: number
    taxRate: number
    minimumTaxable: number
  }
  setInputs: (i: any) => void
}

export function SidebarNav({ lang, setLang, inputs, setInputs }: SidebarNavProps) {
  const t = translations[lang]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary rounded-lg p-2 text-primary-foreground">
            <TrendingUp size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">{t.appName}</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4">{t.fiscalInputs}</SidebarGroupLabel>
          <SidebarGroupContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grossIncome" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.grossIncome}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                <Input
                  id="grossIncome"
                  name="grossIncome"
                  type="number"
                  value={inputs.grossIncome}
                  onChange={handleChange}
                  className="pl-7 font-code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.taxRate}
              </Label>
              <div className="relative">
                <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">%</span>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  step="0.01"
                  value={inputs.taxRate}
                  onChange={handleChange}
                  className="font-code"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumTaxable" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.minTaxable}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">$</span>
                <Input
                  id="minimumTaxable"
                  name="minimumTaxable"
                  type="number"
                  value={inputs.minimumTaxable}
                  onChange={handleChange}
                  className="pl-7 font-code"
                />
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2 mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-4">{t.language}</SidebarGroupLabel>
          <SidebarGroupContent className="px-4 pt-2">
            <div className="flex gap-2 p-1 bg-muted rounded-md">
              <Button
                variant={lang === 'en' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setLang('en')}
              >
                EN
              </Button>
              <Button
                variant={lang === 'es' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1"
                onClick={() => setLang('es')}
              >
                ES
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-widest">
          © 2024 Munival Fiscal Solutions
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
