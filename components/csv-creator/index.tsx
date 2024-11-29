"use client"

import { useState } from "react"
import { Plus, Download, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmployeeForm } from "./employee-form"
import { Employee } from "@/lib/types"
import { generateCSV } from "@/lib/csv-generator"

export function CSVCreator() {
  const [employees, setEmployees] = useState<Employee[]>([
    { 
      id: "1", 
      name: "John Doe", 
      title: "CEO", 
      department: "Executive", 
      managerId: null,
      email: "john@example.com"
    }
  ])

  const [errors, setErrors] = useState<string[]>([])

  const validateEmployees = () => {
    const newErrors: string[] = []
    
    // Check for empty required fields
    employees.forEach((emp, index) => {
      if (!emp.name.trim()) newErrors.push(`Employee ${index + 1}: Name is required`)
      if (!emp.title.trim()) newErrors.push(`Employee ${index + 1}: Title is required`)
      if (!emp.department.trim()) newErrors.push(`Employee ${index + 1}: Department is required`)
    })

    // Check for valid manager IDs
    const employeeIds = new Set(employees.map(e => e.id))
    employees.forEach((emp) => {
      if (emp.managerId && !employeeIds.has(emp.managerId)) {
        newErrors.push(`Invalid manager ID for employee ${emp.name}`)
      }
    })

    // Ensure CEO has no manager
    if (employees[0]?.managerId) {
      newErrors.push("CEO cannot have a manager")
    }

    // Check for circular references
    const checkCircularReference = (empId: string, visited: Set<string> = new Set()): boolean => {
      if (visited.has(empId)) return true
      visited.add(empId)
      
      const employee = employees.find(e => e.id === empId)
      if (employee?.managerId) {
        return checkCircularReference(employee.managerId, visited)
      }
      return false
    }

    employees.forEach(emp => {
      if (checkCircularReference(emp.id)) {
        newErrors.push(`Circular management chain detected for employee ${emp.name}`)
      }
    })

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const addEmployee = () => {
    const newId = (Math.max(...employees.map(e => parseInt(e.id))) + 1).toString()
    setEmployees([...employees, {
      id: newId,
      name: "",
      title: "",
      department: "",
      managerId: "1", // Default to CEO as manager
      email: ""
    }])
  }

  const updateEmployee = (index: number, employee: Employee) => {
    const newEmployees = [...employees]
    newEmployees[index] = employee
    setEmployees(newEmployees)
    setErrors([]) // Clear errors on update
  }

  const removeEmployee = (index: number) => {
    // Don't allow removing the CEO
    if (index === 0) return

    const employeeToRemove = employees[index]
    const newEmployees = employees.filter((_, i) => i !== index)
    
    // Update any employees that had this employee as manager
    const updatedEmployees = newEmployees.map(emp => {
      if (emp.managerId === employeeToRemove.id) {
        return { ...emp, managerId: "1" } // Default back to CEO
      }
      return emp
    })
    
    setEmployees(updatedEmployees)
    setErrors([])
  }

  const downloadCSV = () => {
    if (validateEmployees()) {
      generateCSV(employees)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Structure Creator</CardTitle>
        <CardDescription>
          Create your organization structure by adding employees and their relationships.
          The first employee is always the CEO and cannot be removed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {employees.map((employee, index) => (
              <div key={index} className="flex items-start gap-4">
                <EmployeeForm
                  employee={employee}
                  managers={employees.filter(e => e.id !== employee.id)}
                  onChange={(updated) => updateEmployee(index, updated)}
                  isFirst={index === 0}
                  className="flex-1"
                />
                {index !== 0 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeEmployee(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-4">
            <Button onClick={addEmployee}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
            <Button variant="secondary" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}