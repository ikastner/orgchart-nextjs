import { Employee } from "@/lib/types"

export function generateCSV(employees: Employee[]) {
  // Validate employees before generating CSV
  const validationErrors = validateEmployees(employees)
  if (validationErrors.length > 0) {
    throw new Error(`Invalid employee data:\n${validationErrors.join('\n')}`)
  }

  // Define CSV headers
  const headers = ['id', 'name', 'title', 'department', 'managerId', 'email', 'imageUrl']
  
  // Convert employees to CSV rows
  const rows = employees.map(emp => {
    return headers.map(header => {
      const value = emp[header as keyof Employee]
      // Handle empty values and proper CSV escaping
      if (value === null || value === undefined) return ''
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  })

  // Combine headers and rows
  const csv = [headers.join(','), ...rows].join('\n')
  
  // Create and download the file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', 'organization.csv')
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function validateEmployees(employees: Employee[]): string[] {
  const errors: string[] = []
  const employeeIds = new Set(employees.map(e => e.id))

  employees.forEach((emp, index) => {
    // Required fields validation
    if (!emp.id) errors.push(`Employee ${index + 1}: ID is required`)
    if (!emp.name?.trim()) errors.push(`Employee ${index + 1}: Name is required`)
    if (!emp.title?.trim()) errors.push(`Employee ${index + 1}: Title is required`)
    if (!emp.department?.trim()) errors.push(`Employee ${index + 1}: Department is required`)

    // Manager validation (except for CEO)
    if (index > 0) {
      if (!emp.managerId) {
        errors.push(`Employee ${index + 1}: Manager ID is required for non-CEO employees`)
      } else if (!employeeIds.has(emp.managerId)) {
        errors.push(`Employee ${index + 1}: Invalid manager ID`)
      }
    }

    // Email format validation if provided
    if (emp.email && !isValidEmail(emp.email)) {
      errors.push(`Employee ${index + 1}: Invalid email format`)
    }
  })

  return errors
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}