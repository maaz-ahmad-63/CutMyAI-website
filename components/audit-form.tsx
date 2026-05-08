'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowRight, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AI_TOOLS, USE_CASES, getToolById, type UserTool } from '@/lib/ai-tools-data'

interface AuditFormProps {
  onSubmit: (tools: UserTool[]) => void
  isLoading?: boolean
}

interface ToolEntry {
  id: string
  toolId: string
  plan: string
  monthlyCost: number
  teamSize: number
  useCase: string
}

const STORAGE_KEY = 'cutmyai-form-state'

export function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [tools, setTools] = useState<ToolEntry[]>([
    { id: '1', toolId: '', plan: '', monthlyCost: 0, teamSize: 1, useCase: '' },
  ])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTools(parsed)
        }
      } catch (e) {
        console.error('Failed to parse stored form state:', e)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever tools change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tools))
    }
  }, [tools, isHydrated])

  const addTool = () => {
    setTools([
      ...tools,
      { id: Date.now().toString(), toolId: '', plan: '', monthlyCost: 0, teamSize: 1, useCase: '' },
    ])
  }

  const removeTool = (id: string) => {
    if (tools.length > 1) {
      setTools(tools.filter(t => t.id !== id))
    }
  }

  const updateTool = (id: string, field: keyof ToolEntry, value: string | number) => {
    setTools(tools.map(t => {
      if (t.id !== id) return t
      
      const updated = { ...t, [field]: value }
      
      // Auto-fill cost when tool and plan are selected
      if (field === 'toolId' || field === 'plan') {
        const toolData = getToolById(field === 'toolId' ? value as string : updated.toolId)
        const planName = field === 'plan' ? value as string : updated.plan
        const plan = toolData?.plans.find(p => p.name === planName)
        if (plan) {
          updated.monthlyCost = plan.monthlyPrice
        }
      }
      
      return updated
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validTools = tools
      .filter(t => t.toolId && t.plan && t.useCase)
      .map(t => ({
        toolId: t.toolId,
        plan: t.plan,
        monthlyCost: t.monthlyCost,
        teamSize: t.teamSize,
        useCase: t.useCase,
      }))
    
    if (validTools.length > 0) {
      onSubmit(validTools)
    }
  }

  const totalMonthly = tools.reduce((sum, t) => sum + (t.monthlyCost * t.teamSize), 0)

  const categorizedTools = {
    llm: AI_TOOLS.filter(t => t.category === 'llm'),
    code: AI_TOOLS.filter(t => t.category === 'code'),
    image: AI_TOOLS.filter(t => t.category === 'image'),
    video: AI_TOOLS.filter(t => t.category === 'video'),
    audio: AI_TOOLS.filter(t => t.category === 'audio'),
    productivity: AI_TOOLS.filter(t => t.category === 'productivity'),
  }

  if (!isHydrated) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-8 text-center text-muted-foreground">
          Loading form...
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Your AI Tools</CardTitle>
          <CardDescription>
            Add each AI tool your team pays for. We&apos;ll analyze your spending and find savings.
            (Your data is saved locally and never sent to servers)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {tools.map((tool, index) => (
            <div key={tool.id} className="flex flex-col gap-4 rounded-lg border border-border/50 bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Tool {index + 1}</span>
                {tools.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTool(tool.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Tool Selection */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`tool-${tool.id}`}>AI Tool *</Label>
                  <Select
                    value={tool.toolId}
                    onValueChange={(value) => updateTool(tool.id, 'toolId', value)}
                  >
                    <SelectTrigger id={`tool-${tool.id}`}>
                      <SelectValue placeholder="Select a tool" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>LLMs & Chatbots</SelectLabel>
                        {categorizedTools.llm.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Code Assistants</SelectLabel>
                        {categorizedTools.code.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Image Generation</SelectLabel>
                        {categorizedTools.image.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Video</SelectLabel>
                        {categorizedTools.video.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Audio & Voice</SelectLabel>
                        {categorizedTools.audio.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Productivity</SelectLabel>
                        {categorizedTools.productivity.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Plan Selection */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`plan-${tool.id}`}>Plan *</Label>
                  <Select
                    value={tool.plan}
                    onValueChange={(value) => updateTool(tool.id, 'plan', value)}
                    disabled={!tool.toolId}
                  >
                    <SelectTrigger id={`plan-${tool.id}`}>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {getToolById(tool.toolId)?.plans.map(p => (
                          <SelectItem key={p.name} value={p.name}>
                            {p.name} - ${p.monthlyPrice}/mo
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Monthly Cost */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`cost-${tool.id}`}>Monthly Cost per Seat</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={`cost-${tool.id}`}
                      type="number"
                      min={0}
                      step={0.01}
                      value={tool.monthlyCost || ''}
                      onChange={(e) => updateTool(tool.id, 'monthlyCost', parseFloat(e.target.value) || 0)}
                      className="pl-9"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Team Size / Number of Seats */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`team-${tool.id}`}>Number of Seats/Users</Label>
                  <Input
                    id={`team-${tool.id}`}
                    type="number"
                    min={1}
                    value={tool.teamSize}
                    onChange={(e) => updateTool(tool.id, 'teamSize', parseInt(e.target.value) || 1)}
                    placeholder="1"
                  />
                </div>

                {/* Use Case */}
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor={`usecase-${tool.id}`}>Primary Use Case *</Label>
                  <Select
                    value={tool.useCase}
                    onValueChange={(value) => updateTool(tool.id, 'useCase', value)}
                  >
                    <SelectTrigger id={`usecase-${tool.id}`}>
                      <SelectValue placeholder="How do you use this tool?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {USE_CASES.map(useCase => (
                          <SelectItem key={useCase} value={useCase}>{useCase}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addTool}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 size-4" />
            Add Another Tool
          </Button>

          <div className="flex flex-col gap-4 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Current Monthly Spend</span>
              <span className="text-2xl font-semibold">${totalMonthly.toFixed(2)}</span>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !tools.some(t => t.toolId && t.plan && t.useCase)}
              className="gap-2"
            >
              {isLoading ? 'Analyzing...' : 'Get My Savings Report'}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
