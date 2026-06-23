
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
import { FileJson, FileType, AlertTriangle, Lightbulb, Calculator, Info, ShieldCheck } from "lucide-react"
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

  const calculatedTax = (inputs.grossIncome * inputs.taxRate) / 100
  const effectiveTax = Math.max(calculatedTax, inputs.minimumTaxable)
  const isUsingMin = inputs.minimumTaxable > calculatedTax
  const taxBurden = inputs.grossIncome > 0 ? (effectiveTax / inputs.grossIncome) * 100 : 0

  const chartData = useMemo(() => [
    { name: t.taxLabel, value: calculatedTax, fill: "hsl(var(--primary))" },
    { name: t.minLabel, value: inputs.minimumTaxable, fill: isUsingMin ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))" }
  ], [t, calculatedTax, inputs.minimumTaxable, isUsingMin])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(lang === 'es' ? 'es-VE' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val)
  }

  const narrativeAnalysis = useMemo(() => {
    const rubroName = t.categories[inputs.category as keyof typeof t.categories]
    if (isUsingMin) {
      return lang === 'es' 
        ? `Según la Ordenanza Municipal, el rubro "${rubroName}" tiene un mínimo tributable de ${formatCurrency(inputs.minimumTaxable)}. Su cálculo por ingresos (${formatCurrency(calculatedTax)}) no alcanza este umbral, por lo que aplica el pago del Mínimo Mensual.`
        : `According to Municipal Ordinance, "${rubroName}" has a minimum taxable amount of ${formatCurrency(inputs.minimumTaxable)}. Your income-based calculation (${formatCurrency(calculatedTax)}) is below this threshold, so the Monthly Minimum applies.`;
    }
    return lang === 'es'
      ? `Sus ingresos brutos para "${rubroName}" han superado el mínimo tributable. Se aplica la alícuota del ${inputs.taxRate}% sobre la base imponible declarada.`
      : `Your gross income for "${rubroName}" has exceeded the minimum threshold. A tax rate of ${inputs.taxRate}% is applied to the declared tax base.`;
  }, [lang, isUsingMin, calculatedTax, inputs, t])

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            {t.overview}
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 hidden md:flex">V1.2 Stable</Badge>
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {lang === 'es' ? 'Gestión y simulación de compromiso tributario municipal.' : 'Management and simulation of municipal tax commitment.'}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none border-primary/10 hover:bg-primary/5">
            <FileType size={14} className="text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.exportPdf}</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none border-primary/10 hover:bg-primary/5">
            <FileJson size={14} className="text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.exportCsv}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-all border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{t.calculatedTax}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-code text-primary/70">{formatCurrency(calculatedTax)}</div>
            <p className="text-[10px] font-semibold text-muted-foreground/70 mt-1 uppercase tracking-tighter">
              {inputs.taxRate}% DE {formatCurrency(inputs.grossIncome)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md border-primary/20 bg-primary/[0.03] ring-1 ring-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-primary uppercase tracking-[0.15em]">{t.effectiveTax}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-code text-primary">{formatCurrency(effectiveTax)}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={isUsingMin ? "destructive" : "default"} className="uppercase text-[9px] font-black px-2 py-0">
                {isUsingMin ? (lang === 'es' ? 'Mínimo de Ley' : 'Legal Min') : (lang === 'es' ? 'Excedente' : 'Surplus')}
              </Badge>
              <ShieldCheck size={14} className="text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm sm:col-span-2 lg:col-span-1 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{t.taxBurden}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-code">{taxBurden.toFixed(2)}%</div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-3 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                style={{ width: `${Math.min(taxBurden * 10, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7 shadow-xl border-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 font-bold uppercase tracking-wider">
              <Calculator size={16} className="text-primary" />
              {t.comparison}
            </CardTitle>
            <CardDescription className="text-xs">{t.taxBreakdown}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} opacity={0.05} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10 }} 
                  tickFormatter={(val) => `$${val}`}
                />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background/95 backdrop-blur-md border rounded-xl p-3 shadow-2xl border-primary/20">
                          <p className="text-[9px] font-black uppercase text-muted-foreground mb-1 tracking-widest">{payload[0].name}</p>
                          <p className="text-lg font-code font-bold text-primary">{formatCurrency(payload[0].value as number)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[10, 10, 0, 0]} 
                  barSize={50}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 shadow-xl border-primary/10 bg-primary/[0.01]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-wider">
              <Info className="text-primary" size={16} />
              {t.fiscalAdvisor}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-5 rounded-2xl bg-background border border-primary/10 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Calculator size={80} className="text-primary" />
              </div>
              <h4 className="text-[10px] font-black uppercase text-primary mb-3 flex items-center gap-2 tracking-widest">
                <Lightbulb size={12} />
                {lang === 'es' ? 'DICTAMEN TÉCNICO' : 'TECHNICAL RULING'}
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80 font-medium italic">
                "{narrativeAnalysis}"
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                <AlertTriangle size={12} className="text-amber-500" />
                {t.optimizationTips}
              </h4>
              <ul className="space-y-4">
                <li className="flex gap-4 text-sm items-start group">
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <span className="text-[10px] font-bold">01</span>
                  </div>
                  <span className="text-muted-foreground font-medium text-xs leading-snug">
                    {lang === 'es' 
                      ? 'Considere los incentivos por "Pronto Pago" contemplados en la Ley de Armonización Tributaria (LOCAPEM).' 
                      : 'Consider the "Early Payment" incentives included in the Tax Harmonization Law (LOCAPEM).'}
                  </span>
                </li>
                <li className="flex gap-4 text-sm items-start group">
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <span className="text-[10px] font-bold">02</span>
                  </div>
                  <span className="text-muted-foreground font-medium text-xs leading-snug">
                    {lang === 'es' 
                      ? 'Verifique que su código de actividad (Rubro) corresponda exactamente a su Registro de Comercio para evitar multas.' 
                      : 'Verify that your activity code matches your Trade Registry exactly to avoid penalties.'}
                  </span>
                </li>
              </ul>
            </div>

            {taxBurden > 7 && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex gap-4 items-center animate-pulse">
                <AlertTriangle className="text-destructive shrink-0" size={20} />
                <p className="text-[10px] font-bold text-destructive uppercase leading-tight tracking-tight">
                  {lang === 'es' 
                    ? 'ADVERTENCIA: La carga impositiva municipal supera el 7% de sus ingresos brutos. Revise márgenes.' 
                    : 'WARNING: Municipal tax burden exceeds 7% of gross income. Review margins.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
