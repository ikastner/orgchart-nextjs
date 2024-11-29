import { Employee, OrgChartData } from "./types"

export function processCSVData(data: any[]): OrgChartData {
  // Clean and normalize the data first
  const cleanedData = data.map(row => {
    // Handle both object and array formats
    const rawRow = Array.isArray(row) ? row : Object.values(row)
    
    // Clean each field
    return {
      id: String(rawRow[0] || '').trim(),
      name: String(rawRow[1] || '').trim(),
      title: String(rawRow[2] || '').trim(),
      department: String(rawRow[3] || '').trim(),
      managerId: rawRow[4] ? String(rawRow[4]).trim() : null,
      email: String(rawRow[5] || '').trim() || undefined,
      imageUrl: String(rawRow[6] || '').trim() || undefined,
    }
  }).filter(row => row.id && row.name) // Filter out empty rows

  // Validate the cleaned data
  validateData(cleanedData)

  // Convert to Employee array
  const employees: Employee[] = cleanedData

  // Find root employee (no manager)
  const root = employees.find((emp) => !emp.managerId)
  if (!root) {
    throw new Error("No root employee found (employee without manager)")
  }

  // Build hierarchy
  function buildHierarchy(employee: Employee): OrgChartData {
    const children = employees.filter((emp) => emp.managerId === employee.id)
    return {
      id: employee.id,
      name: employee.name,
      title: employee.title,
      department: employee.department,
      email: employee.email,
      imageUrl: employee.imageUrl,
      children: children.length > 0 ? children.map(buildHierarchy) : undefined,
    }
  }

  return buildHierarchy(root)
}

function validateData(employees: Employee[]): void {
  if (employees.length === 0) {
    throw new Error("No valid data found in CSV file")
  }

  // Validate required fields
  employees.forEach((emp, index) => {
    if (!emp.id) throw new Error(`Row ${index + 1}: Missing ID`)
    if (!emp.name) throw new Error(`Row ${index + 1}: Missing Name`)
    if (!emp.title) throw new Error(`Row ${index + 1}: Missing Title`)
    if (!emp.department) throw new Error(`Row ${index + 1}: Missing Department`)
  })

  // Validate manager references
  const employeeIds = new Set(employees.map(emp => emp.id))
  const invalidManagerRefs = employees
    .filter(emp => emp.managerId && !employeeIds.has(emp.managerId))
    .map(emp => emp.id)

  if (invalidManagerRefs.length > 0) {
    throw new Error(`Invalid manager IDs found for employees: ${invalidManagerRefs.join(', ')}`)
  }

  // Check for circular references
  employees.forEach(emp => {
    const visited = new Set<string>()
    let current = emp
    while (current.managerId) {
      if (visited.has(current.managerId)) {
        throw new Error(`Circular management chain detected for employee ${emp.name}`)
      }
      visited.add(current.managerId)
      current = employees.find(e => e.id === current.managerId)!
    }
  })
}