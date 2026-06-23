
"use client"

import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Language, translations } from "@/app/lib/translations"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Badge } from "@/components/ui/badge"
import { FileJson, FileType, AlertTriangle, Lightbulb, Calculator, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnalyticsDashboardProps {
  lang: Language
  inputs: {
    category: string
    grossIncome: number
    taxRate: number
    minimumTaxable: number
  }
}

export function AnalyticsDashboard({ lang, inputs }: AnalyticsDashboardProps) {
  const t = translations[lang]

  // Cálculos en tiempo real
  const calculatedTax = (inputs.grossIncome * inputs.taxRate) / 100
  const effectiveTax = Math.max(calculatedTax, inputs.minimumTaxable)
  const isUsingMin = inputs.minimumTaxable > calculatedTax
  const taxBurden = inputs.grossIncome > 0 ? (effectiveTax / inputs.grossIncome) * 100 : 0

  const chartData = useMemo(() => [
    { name: t.taxLabel, value: calculatedTax, fill: "hsl(var(--primary))" },
    { name: t.minLabel, value: inputs.minimumTaxable, fill: isUsingMin ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))" }
  ], [t, calculatedTax, inputs.minimumTaxable, isUsingMin])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val)
  }

  // Generación de reporte narrativo basado en reglas (Mock de IA)
  const narrativeAnalysis = useMemo(() => {
    if (isUsingMin) {
      return lang === 'es' 
        ? `Debido a que el impuesto calculado (${formatCurrency(calculatedTax)}) es menor al umbral establecido para el rubro de ${t.categories[inputs.category as keyof typeof t.categories]}, se debe tributar el Mínimo Mensual de ${formatCurrency(inputs.minimumTaxable)}.`
        : `Since the calculated tax (${formatCurrency(calculatedTax)}) is lower than the threshold for ${t.categories[inputs.category as keyof typeof t.categories]}, the Monthly Minimum of ${formatCurrency(inputs.minimumTaxable)} applies.`;
    }
    return lang === 'es'
      ? `Su actividad económica en el rubro de ${t.categories[inputs.category as keyof typeof t.categories]} ha superado el mínimo tributable. El impuesto se calcula sobre el ${inputs.taxRate}% de sus ingresos brutos.`
      : `Your economic activity in ${t.categories[inputs.category as keyof typeof t.categories]} has exceeded the minimum threshold. The tax is calculated as ${inputs.taxRate}% of your gross income.`;
  }, [lang, isUsingMin, calculatedTax, inputs, t])

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.overview}</h1>
          <p className="text-muted-foreground mt-1">
            {lang === 'es' ? 'Simulación interactiva para la administración tributaria.' : 'Interactive simulation for tax administration.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FileType size={16} />
            {t.exportPdf}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileJson size={16} />
            {t.exportCsv}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.calculatedTax}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-code text-primary/80">{formatCurrency(calculatedTax)}</div>
            <p className="text-[10px] text-muted-foreground mt-1">{inputs.taxRate}% of {formatCurrency(inputs.grossIncome)}</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-primary/20 bg-primary/[0.02]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.effectiveTax}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-code text-primary">{formatCurrency(effectiveTax)}</div>
            <Badge variant={isUsingMin ? "destructive" : "default"} className="mt-2 uppercase text-[9px] tracking-tighter">
              {isUsingMin ? (lang === 'es' ? 'Mínimo Aplicado' : 'Min Applied') : (lang === 'es' ? 'Exceso sobre Mínimo' : 'Above Minimum')}
            </Badge>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.taxBurden}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-code">{taxBurden.toFixed(2)}%</div>
            <div className="w-full bg-muted rounded-full h-1 mt-3 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-1000" 
                style={{ width: `${Math.min(taxBurden * 10, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator size={18} className="text-primary" />
              {t.comparison}
            </CardTitle>
            <CardDescription>{t.taxBreakdown}</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 500 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 11 }} 
                  tickFormatter={(val) => `$${val}`}
                />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-2xl border-primary/20">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">{payload[0].name}</p>
                          <p className="text-xl font-code font-bold text-primary">{formatCurrency(payload[0].value as number)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[6, 6, 0, 0]} 
                  barSize={60}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-xl border-emerald-500/20 bg-emerald-500/[0.01]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="text-primary" size={20} />
              {t.fiscalAdvisor}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-background border border-primary/10 shadow-sm">
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-2">
                <Lightbulb size={14} className="text-primary" />
                {lang === 'es' ? 'Análisis del Cálculo' : 'Calculation Analysis'}
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80 italic">
                "{narrativeAnalysis}"
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} className="text-primary" />
                {t.optimizationTips}
              </h4>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary text-[10px] font-bold">1</span>
                  </div>
                  <span className="text-muted-foreground">
                    {lang === 'es' 
                      ? 'Revise si su rubro permite deducciones por pronto pago (incentivo municipal).' 
                      : 'Check if your category allows early payment deductions (municipal incentive).'}
                  </span>
                </li>
                <li className="flex gap-3 text-sm items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary text-[10px] font-bold">2</span>
                  </div>
                  <span className="text-muted-foreground">
                    {lang === 'es' 
                      ? 'Mantenga sus ingresos brutos certificados para evitar multas por sub-declaración.' 
                      : 'Keep your gross income certified to avoid under-reporting penalties.'}
                  </span>
                </li>
              </ul>
            </div>

            {taxBurden > 10 && (
              <div className="p-3 rounded-md bg-destructive/5 border border-destructive/10 flex gap-3 items-center animate-pulse">
                <AlertTriangle className="text-destructive shrink-0" size={18} />
                <p className="text-[11px] font-medium text-destructive leading-tight">
                  {lang === 'es' 
                    ? 'ALERTA: La carga tributaria supera el 10%, revise su rentabilidad operativa.' 
                    : 'ALERT: Tax burden exceeds 10%, review your operational profitability.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
