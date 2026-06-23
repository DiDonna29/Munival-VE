
"use client"

import React from 'react'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarFooter
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrendingUp } from "lucide-react"
import { Language, translations } from "@/app/lib/translations"
import { Button } from "@/components/ui/button"

interface SidebarNavProps {
  lang: Language
  setLang: (l: Language) => void
  inputs: {
    category: string
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

  const handleCategoryChange = (value: string) => {
    // Definimos valores predeterminados por rubro para mejorar la interactividad
    const defaults: Record<string, { rate: number; min: number }> = {
      retail: { rate: 2.5, min: 5000 },
      services: { rate: 3.0, min: 4500 },
      industry: { rate: 1.8, min: 12000 },
      hospitality: { rate: 4.0, min: 8000 },
      tech: { rate: 1.5, min: 3000 }
    }
    
    setInputs((prev: any) => ({ 
      ...prev, 
      category: value,
      taxRate: defaults[value].rate,
      minimumTaxable: defaults[value].min
    }))
  }

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary rounded-lg p-2 text-primary-foreground shadow-sm">
            <TrendingUp size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">{t.appName}</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-primary font-bold">{t.fiscalInputs}</SidebarGroupLabel>
          <SidebarGroupContent className="p-4 space-y-6">
            
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.commercialCategory}
              </Label>
              <Select value={inputs.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un rubro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">{t.categories.retail}</SelectItem>
                  <SelectItem value="services">{t.categories.services}</SelectItem>
                  <SelectItem value="industry">{t.categories.industry}</SelectItem>
                  <SelectItem value="hospitality">{t.categories.hospitality}</SelectItem>
                  <SelectItem value="tech">{t.categories.tech}</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
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
                    step="0.1"
                    value={inputs.taxRate}
                    onChange={handleChange}
                    className="font-code pr-7"
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
                    className="pl-7 font-code text-xs"
                  />
                </div>
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
