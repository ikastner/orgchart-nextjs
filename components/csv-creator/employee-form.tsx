"use client"

import { Employee } from "@/lib/types"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface EmployeeFormProps {
  employee: Employee
  managers: Employee[]
  onChange: (employee: Employee) => void
  isFirst?: boolean
  className?: string
}

export function EmployeeForm({ employee, managers, onChange, isFirst, className }: EmployeeFormProps) {
  const [departments, setDepartments] = useState(() => {
    const defaultDepartments = [
      "Executive",
      "Technology",
      "Sales",
      "Marketing",
      "Finance",
      "Human Resources",
      "Operations",
      "RAD"
    ]
    const savedDepartments = localStorage.getItem('customDepartments')
    return savedDepartments ? JSON.parse(savedDepartments) : defaultDepartments
  })
  const [newDepartment, setNewDepartment] = useState("")

  const handleAddDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      const updatedDepartments = [...departments, newDepartment.trim()]
      setDepartments(updatedDepartments)
      localStorage.setItem('customDepartments', JSON.stringify(updatedDepartments))
      onChange({ ...employee, department: newDepartment.trim() })
      setNewDepartment("")
    }
  }

  const handleDeleteDepartment = (departmentToDelete: string) => {
    const updatedDepartments = departments.filter(dept => dept !== departmentToDelete)
    setDepartments(updatedDepartments)
    localStorage.setItem('customDepartments', JSON.stringify(updatedDepartments))
    
    // Si le département supprimé était sélectionné, réinitialiser la sélection
    if (employee.department === departmentToDelete) {
      onChange({ ...employee, department: "" })
    }
  }

  return (
    <div className={cn("grid gap-4", className)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`name-${employee.id}`}>Full Name *</Label>
          <Input
            id={`name-${employee.id}`}
            placeholder="e.g., John Doe"
            value={employee.name}
            onChange={(e) => onChange({ ...employee, name: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`title-${employee.id}`}>Job Title *</Label>
          <Input
            id={`title-${employee.id}`}
            placeholder="e.g., Software Engineer"
            value={employee.title}
            onChange={(e) => onChange({ ...employee, title: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Department *</Label>
          <div className="flex gap-2">
            <Select
              value={employee.department}
              onValueChange={(value) => onChange({ ...employee, department: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <div key={dept} className="flex items-center justify-between px-2 py-1.5">
                    <SelectItem value={dept} className="flex-1">
                      {dept}
                    </SelectItem>
                    {!["Executive", "Technology", "Sales", "Marketing", "Finance", "Human Resources", "Operations", "RAD"].includes(dept) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteDepartment(dept)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                placeholder="New department"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddDepartment()
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleAddDepartment}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Manager {!isFirst && '*'}</Label>
          <Select
            value={employee.managerId || ""}
            onValueChange={(value) => onChange({ ...employee, managerId: value || null })}
            disabled={isFirst}
          >
            <SelectTrigger>
              <SelectValue placeholder={isFirst ? "No Manager (CEO)" : "Select manager"} />
            </SelectTrigger>
            <SelectContent>
              {managers.map((manager) => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.name} ({manager.title})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`email-${employee.id}`}>Email</Label>
          <Input
            id={`email-${employee.id}`}
            type="email"
            placeholder="email@company.com"
            value={employee.email || ""}
            onChange={(e) => onChange({ ...employee, email: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}