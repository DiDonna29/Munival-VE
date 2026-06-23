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
import { TrendingUp, Percent, DollarSign, Briefcase } from "lucide-react"
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
    const defaults: Record<string, { rate: number; min: number }> = {
      retail: { rate: 1.5, min: 25 },
      services: { rate: 2.5, min: 40 },
      industry: { rate: 1.2, min: 100 },
      liquor: { rate: 5.0, min: 150 },
      tech: { rate: 2.0, min: 30 }
    }
    
    setInputs((prev: any) => ({ 
      ...prev, 
      category: value,
      taxRate: defaults[value].rate,
      minimumTaxable: defaults[value].min
    }))
  }

  return (
    <Sidebar variant="sidebar" className="border-r overflow-hidden">
      <SidebarHeader className="p-6 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-primary rounded-xl p-2.5 text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
            <TrendingUp size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-bold tracking-tight text-primary leading-none truncate">{t.appName}</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1 truncate">Venezuela</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-primary font-bold mb-2 uppercase text-[10px] tracking-widest">
            {t.fiscalInputs}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-4 space-y-6">
            
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Briefcase size={12} />
                <span className="truncate">{t.commercialCategory}</span>
              </Label>
              <Select value={inputs.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full bg-background border-primary/20 focus:ring-primary/30 overflow-hidden">
                  <SelectValue placeholder="Selecciona rubro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">{t.categories.retail}</SelectItem>
                  <SelectItem value="services">{t.categories.services}</SelectItem>
                  <SelectItem value="industry">{t.categories.industry}</SelectItem>
                  <SelectItem value="liquor">{t.categories.liquor}</SelectItem>
                  <SelectItem value="tech">{t.categories.tech}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grossIncome" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <DollarSign size={12} />
                <span className="truncate">{t.grossIncome}</span>
              </Label>
              <Input
                id="grossIncome"
                name="grossIncome"
                type="number"
                value={inputs.grossIncome}
                onChange={handleChange}
                className="font-code font-semibold border-primary/20 focus:ring-primary/30"
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Percent size={12} />
                  <span className="truncate">{t.taxRate}</span>
                </Label>
                <Input
                  id="taxRate"
                  name="taxRate"
                  type="number"
                  step="0.01"
                  value={inputs.taxRate}
                  onChange={handleChange}
                  className="font-code font-semibold border-primary/20 focus:ring-primary/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumTaxable" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                  {t.minTaxable}
                </Label>
                <Input
                  id="minimumTaxable"
                  name="minimumTaxable"
                  type="number"
                  value={inputs.minimumTaxable}
                  onChange={handleChange}
                  className="font-code font-semibold border-primary/20 focus:ring-primary/30"
                />
              </div>
            </div>

          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4 mx-4 opacity-50" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] uppercase tracking-widest">{t.language}</SidebarGroupLabel>
          <SidebarGroupContent className="px-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-muted/50 rounded-lg border border-primary/5">
              <Button
                variant={lang === 'en' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1 text-[10px] h-8 font-bold"
                onClick={() => setLang('en')}
              >
                ENGLISH
              </Button>
              <Button
                variant={lang === 'es' ? 'default' : 'ghost'}
                size="sm"
                className="flex-1 text-[10px] h-8 font-bold"
                onClick={() => setLang('es')}
              >
                ESPAÑOL
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 shrink-0">
        <div className="text-[9px] text-center text-muted-foreground/60 font-bold uppercase tracking-[0.2em] break-words">
          Munival Solutions VE
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
