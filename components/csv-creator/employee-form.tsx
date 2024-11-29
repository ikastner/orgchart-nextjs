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

interface EmployeeFormProps {
  employee: Employee
  managers: Employee[]
  onChange: (employee: Employee) => void
  isFirst?: boolean
  className?: string
}

export function EmployeeForm({ employee, managers, onChange, isFirst, className }: EmployeeFormProps) {
  const departments = [
    "Executive",
    "Technology",
    "Sales",
    "Marketing",
    "Finance",
    "Human Resources",
    "Operations",
    "RAD"
  ]

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
          <Select
            value={employee.department}
            onValueChange={(value) => onChange({ ...employee, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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