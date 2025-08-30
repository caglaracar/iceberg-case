import dayjs from 'dayjs'

// Mock agents data
export const mockAgents = [
  { id: 'LK', name: 'Liam Kelly', initials: 'LK', color: '#10B981' },
  { id: 'AE', name: 'Alex Evans', initials: 'AE', color: '#3B82F6' },
  { id: 'OT', name: 'Olivia Taylor', initials: 'OT', color: '#F59E0B' },
  { id: 'MB', name: 'Maya Brooks', initials: 'MB', color: '#8B5CF6' },
  { id: 'YT', name: 'Yuki Tanaka', initials: 'YT', color: '#06B6D4' },
  { id: 'SJ', name: 'Sam Johnson', initials: 'SJ', color: '#EC4899' }
]

// Status configurations
export const appointmentStatuses = [
  { 
    value: 'upcoming', 
    label: 'Upcoming', 
    color: 'bg-blue-100 text-blue-800',
    badge: 'info'
  },
  { 
    value: 'completed', 
    label: 'Completed', 
    color: 'bg-green-100 text-green-800',
    badge: 'success'
  },
  { 
    value: 'cancelled', 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800',
    badge: 'danger'
  }
]

// Generate mock appointments
export const generateMockAppointments = (count = 134) => {
  const appointments = []
  const baseDate = dayjs()
  
  for (let i = 0; i < count; i++) {
    const randomAgent = mockAgents[Math.floor(Math.random() * mockAgents.length)]
    const randomAgents = [randomAgent]
    
    // Add 1-2 additional agents sometimes
    if (Math.random() > 0.7) {
      const additionalAgent = mockAgents[Math.floor(Math.random() * mockAgents.length)]
      if (additionalAgent.id !== randomAgent.id) {
        randomAgents.push(additionalAgent)
      }
    }
    
    // Generate random date within last 30 days to next 60 days
    const randomDays = Math.floor(Math.random() * 90) - 30
    const appointmentDate = baseDate.add(randomDays, 'day')
    
    // Determine status based on date
    let status
    if (appointmentDate.isBefore(baseDate)) {
      status = Math.random() > 0.2 ? 'completed' : 'cancelled'
    } else {
      status = Math.random() > 0.1 ? 'upcoming' : 'cancelled'
    }
    
    const names = [
      'Emma Smith', 'Emily Johnson', 'David Smith', 'Sarah Brown', 
      'Jennifer Martinez', 'Elizabeth Rose Johnson', 'Michael Chen',
      'Jessica Williams', 'Christopher Davis', 'Ashley Miller'
    ]
    
    const addresses = [
      '45 South Western Terrace, Mitcham, CM4 15U',
      '51 Cherry Tree Road, Newcastle upon Tyne, NE1 4LD',
      '12 Green Lane, Manchester, M2 4TG',
      '9 Cherry Blossom Close, Bournemouth, Dorset, BH1 3AB',
      '38 Elmwood Lane, Harrogate, North Yorkshire, HG1 4YZ'
    ]
    
    const phones = [
      '+44 7700 900123',
      '+44 7700 900456',
      '+44 7896 123456',
      '+44 7987 654321',
      '+44 7700 900789'
    ]
    
    appointments.push({
      id: `apt_${i + 1}`,
      customerName: names[Math.floor(Math.random() * names.length)],
      email: `customer${i + 1}@example.com`,
      phone: phones[Math.floor(Math.random() * phones.length)],
      address: addresses[Math.floor(Math.random() * addresses.length)],
      date: appointmentDate.format('YYYY-MM-DD'),
      time: appointmentDate.format('HH:mm'),
      status,
      agents: randomAgents,
      createdAt: baseDate.subtract(Math.floor(Math.random() * 30), 'day').toISOString(),
      updatedAt: baseDate.subtract(Math.floor(Math.random() * 5), 'day').toISOString()
    })
  }
  
  return appointments.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
}

export const mockAppointments = generateMockAppointments()

// API simulation helpers
export const simulateApiDelay = (ms = 500) => 
  new Promise(resolve => setTimeout(resolve, ms))

export const simulateApiResponse = async (data, delay = 500) => {
  await simulateApiDelay(delay)
  return {
    data,
    status: 200,
    message: 'Success'
  }
}
