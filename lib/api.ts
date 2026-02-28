import axios, { AxiosError } from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types

export interface Employee {
  employee_id: string
  nom: string
  prenom: string
  sexe: string
  date_naissance: string
  age: number
  etat_civil: string
  nombre_enfants: number
  niveau_etude: string
  poste: string
  departement: string
  type_contrat: string
  anciennete_annees: number
  salaire_mensuel: number
  prime_rendement: number
  heures_travail_semaine: number
  heures_absence_mois: number
  retards_mois: number
  jours_conge_restant: number
  statut_presence: string
  rfid_uid: string
  shift_travail: string
  performance_moyenne: number
  taux_rendement: number
  accidents_travail: number
  maladies_professionnelles: number
  evaluation_manager: number
  risque_absenteisme: string
  risque_depart: string
  date_embauche: string
}

export interface Machine {
  machine_id: string
  nom_machine: string
  type_machine: string
  atelier: string
  tache: string
  unite_production: string
  capacite: number
  temps_par_unite_min: number
  temps_total_tache_min: number
  operateurs_requis: number
  pannes_mois: number
  etat_machine: string
  annee_installation: number
  marque: string
  consommation_energie: string
  rendement_machine: number
}

export interface ProductionLog {
  log_id: string
  employee_id: string
  machine_id: string
  task_name: string
  tag_event_start: string
  tag_event_end: string
  task_duration_min: number
  shift: string
  product: string
  task_status: string
  anomaly_flag: number
}

export interface Alert {
  alert_id?: number
  id?: string // leaving id for backward compat if needed, but backend is using alert_id
  statut: string
  machine_id: string
  employee_id: string
  message: string
  severity?: string
}

export interface DashboardData {
  // keeping previous dashboard response in case frontend still relies on it, or mock it later
  total_employees: number
  total_machines: number
  active_alerts: number
  production_efficiency: number
  top_alerts: any[]
  kpis: any
  hourly_production: any[]
  machine_health: any[]
}

export interface Recommendation {
  id: string
  category: string
  priority: string
  description: string
  impact: string
  estimated_savings: string
}

// Keeping some generic mock interfaces if they are still called.
export const dashboardAPI = {
  getOverview: () => api.get<DashboardData>('/dashboard/overview'),
}

export const employeesAPI = {
  getAll: (page: number = 1, limit: number = 20) =>
    api.get<Employee[] | { data: Employee[]; total: number }>(`/employees?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get<Employee>(`/employees/${id}`),
  create: (employee: Employee) => api.post('/employees', employee),
  update: (id: string, employee: Employee) => api.put(`/employees/${id}`, employee),
  delete: (id: string) => api.delete(`/employees/${id}`),
}

export const machinesAPI = {
  getAll: (page: number = 1, limit: number = 20) =>
    api.get<Machine[] | { data: Machine[]; total: number }>(`/machines?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get<Machine>(`/machines/${id}`),
  create: (machine: Machine) => api.post('/machines', machine),
  update: (id: string, machine: Machine) => api.put(`/machines/${id}`, machine),
  delete: (id: string) => api.delete(`/machines/${id}`),
  getLogs: (id: string, page: number = 1, limit: number = 20) => api.get<ProductionLog[]>(`/machines/${id}/logs?page=${page}&limit=${limit}`),
}

export const logsAPI = {
  getAll: (page: number = 1, limit: number = 20) =>
    api.get<ProductionLog[] | { data: ProductionLog[]; total: number }>(`/production-logs?page=${page}&limit=${limit}`),
  getById: (id: string) => api.get<ProductionLog>(`/production-logs/${id}`),
  create: (log: ProductionLog) => api.post('/production-logs', log),
  update: (id: string, log: ProductionLog) => api.put(`/production-logs/${id}`, log),
  delete: (id: string) => api.delete(`/production-logs/${id}`),
  getByEmployee: (employeeId: string, page: number = 1, limit: number = 20) =>
    api.get<ProductionLog[]>(`/production-logs/employee/${employeeId}?page=${page}&limit=${limit}`),
  getByMachine: (machineId: string, page: number = 1, limit: number = 20) =>
    api.get<ProductionLog[]>(`/production-logs/machine/${machineId}?page=${page}&limit=${limit}`),
}

export const kpisAPI = {
  getRendementGlobal: () => api.get('/kpis/rendement-global'),
  getRendementParEmploye: (employee_id?: string) => api.get(`/kpis/rendement-par-employe`, { params: { employee_id } }),
  getDureeMoyenneTaches: () => api.get('/kpis/duree-moyenne-taches'),
  getSummary: () => api.get('/kpis/summary'),
}

export const alertsAPI = {
  getAll: (statut?: string, machine_id?: string, employee_id?: string, page: number = 1, limit: number = 20) =>
    api.get<Alert[] | { data: Alert[]; total: number }>('/alerts', { params: { statut, machine_id, employee_id, page, limit } }),
  getStats: () => api.get('/alerts/stats'),
  updateStatus: (alertId: number, statut: string) => api.patch(`/alerts/${alertId}/statut`, null, { params: { statut } })
}

export const summariesAPI = {
  getAllMonthly: () => api.get('/monthly-summaries'),
  getMonthlyByPeriode: (periode: string) => api.get(`/monthly-summaries/${periode}`),
  generateMonthly: () => api.post('/monthly-summaries/generate'),
  getAllShift: (shift?: string) => api.get('/shift-summaries', { params: { shift } }),
  getShiftByDate: (date: string) => api.get(`/shift-summaries/${date}`),
  generateShift: (shift: string) => api.post(`/shift-summaries/generate/${shift}`),
  getShiftLast10Days: () => api.get('/shift-summaries/last10days'),
}

export const anomalyAPI = {
  predictSingle: (log_id: string) => api.post(`/anomaly/predict/${log_id}`),
  predictBatch: (limit: number = 100) => api.post('/anomaly/predict-batch', null, { params: { limit } }),
  getStats: () => api.get('/anomaly/stats'),
}

// Generic fallback methods mapped for old components if they still rely on them:
export const chatAPI = {
  sendMessage: (messages: any[]) => api.post('/chat', { messages }),
}
export const recommendationsAPI = {
  getAll: () => api.get<Recommendation[]>('/recommendations'),
  getByCategory: (category: string) => api.get<Recommendation[]>(`/recommendations/category/${category}`),
}

// Error handler
export const handleAPIError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.detail) {
      if (Array.isArray(error.response.data.detail)) {
        return error.response.data.detail.map((e: any) => e.msg).join(', ')
      }
      return error.response.data.detail
    }
    return error.message || 'An error occurred'
  }
  return 'An unexpected error occurred'
}

export default api
