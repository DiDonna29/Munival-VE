
"use client"

import React, { useState, useEffect } from 'react'
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Download, FileJson, FileType, AlertTriangle, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { municipalTaxAdvisor, MunicipalTaxAdvisorOutput } from "@/ai/flows/municipal-tax-advisor"
import { Skeleton } from "@/components/ui/skeleton"

interface AnalyticsDashboardProps {
  lang: Language
  inputs: {
    grossIncome: number
    taxRate: number
    minimumTaxable: number
  }
}

export function AnalyticsDashboard({ lang, inputs }: AnalyticsDashboardProps) {
  const t = translations[lang]
  const [aiData, setAiData] = useState<MunicipalTaxAdvisorOutput | null>(null)
  const [loading, setLoading] = useState(false)

  const calculatedTax = (inputs.grossIncome * inputs.taxRate) / 100
  const effectiveTax = Math.max(calculatedTax, inputs.minimumTaxable)
  const isUsingMin = inputs.minimumTaxable > calculatedTax

  const chartData = [
    { name: t.taxLabel, value: calculatedTax, fill: "var(--primary)" },
    { name: t.minLabel, value: inputs.minimumTaxable, fill: isUsingMin ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))" }
  ]

  const fetchAIAnalysis = async () => {
    setLoading(true)
    try {
      const result = await municipalTaxAdvisor(inputs)
      setAiData(result)
    } catch (error) {
      console.error("AI Analysis failed", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.overview}</h1>
          <p className="text-muted-foreground mt-1">
            {lang === 'es' ? 'Análisis fiscal en tiempo real basado en sus ingresos declarados.' : 'Real-time fiscal analysis based on your declared income.'}
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
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.calculatedTax}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-code text-primary">{formatCurrency(calculatedTax)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.effectiveTax}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-code">{formatCurrency(effectiveTax)}</div>
            <Badge variant={isUsingMin ? "destructive" : "secondary"} className="mt-2">
              {isUsingMin ? (lang === 'es' ? 'Mínimo Aplicado' : 'Min Applied') : (lang === 'es' ? 'Basado en Tasa' : 'Rate Based')}
            </Badge>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.taxBurden}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-code">
              {inputs.grossIncome > 0 ? ((effectiveTax / inputs.grossIncome) * 100).toFixed(2) : '0.00'}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 shadow-xl">
          <CardHeader>
            <CardTitle>{t.comparison}</CardTitle>
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
                  tick={{ fill: 'currentColor', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 12 }} 
                  tickFormatter={(val) => `$${val}`}
                />
                <RechartsTooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-xl">
                          <p className="text-sm font-bold">{payload[0].name}</p>
                          <p className="text-lg font-code text-primary">{formatCurrency(payload[0].value as number)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]} 
                  barSize={80}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-xl border-emerald-500/20 bg-emerald-500/[0.02]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary" size={20} />
                {t.aiAdvisor}
              </CardTitle>
              <Button onClick={fetchAIAnalysis} disabled={loading} size="sm" variant="secondary">
                {loading ? t.analysisLoading : t.getAnalysis}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!aiData && !loading && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <div className="bg-muted rounded-full p-4 mb-4">
                  <Lightbulb size={32} />
                </div>
                <p>{lang === 'es' ? 'Ejecute el análisis para obtener sugerencias de la IA.' : 'Run analysis to get AI-powered suggestions.'}</p>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}

            {aiData && (
              <>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Download size={16} className="text-primary" />
                    {lang === 'es' ? 'Análisis Narrativo' : 'Narrative Analysis'}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {aiData.analysis}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Lightbulb size={16} className="text-primary" />
                    {t.optimizationTips}
                  </h4>
                  <ul className="text-sm space-y-1">
                    {aiData.optimizationTips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-muted-foreground">
                        <span className="text-primary">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {aiData.flags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <AlertTriangle size={16} className="text-destructive" />
                      {t.flags}
                    </h4>
                    <ul className="text-sm space-y-1">
                      {aiData.flags.map((flag, i) => (
                        <li key={i} className="flex gap-2 text-destructive/80">
                          <span className="text-destructive">•</span> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
