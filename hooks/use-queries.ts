import { useQuery, useQueries, UseQueryResult, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  dashboardAPI,
  employeesAPI,
  machinesAPI,
  logsAPI,
  alertsAPI,
  kpisAPI,
  summariesAPI,
  anomalyAPI,
  DashboardData,
  Employee,
  Machine,
  ProductionLog,
  Alert,
  Recommendation,
  recommendationsAPI
} from '@/lib/api'

// Dashboard queries
export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: async () => {
      // Mocked or kept for backward compat
      const response = await dashboardAPI.getOverview()
      return response.data
    },
    refetchInterval: 60000, // 60 seconds
    staleTime: 30000,       // 30 seconds
  })
}

// Employee queries
export const useEmployees = (skip: number = 0, limit: number = 50) => {
  return useQuery({
    queryKey: ['employees', skip, limit],
    queryFn: async () => {
      const page = Math.floor(skip / limit) + 1;
      const response = await employeesAPI.getAll(page, limit)
      return response.data as { data: Employee[]; total: number } | Employee[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useEmployee = (id: string | null) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      if (!id) throw new Error('Employee ID is required')
      const response = await employeesAPI.getById(id)
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateEmployee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (employee: Employee) => employeesAPI.create(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

/*
export const useEmployeeSearch = (query: string) => {
  // Not documented in OpenAPI, omit or mock
  return useQuery({
    queryKey: ['employees', 'search', query],
    queryFn: async () => [],
    enabled: !!query,
  })
}
*/

// Machine queries
export const useMachines = (skip: number = 0, limit: number = 50) => {
  return useQuery({
    queryKey: ['machines', skip, limit],
    queryFn: async () => {
      const page = Math.floor(skip / limit) + 1;
      const response = await machinesAPI.getAll(page, limit)
      return response.data as { data: Machine[]; total: number } | Machine[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useMachine = (id: string | null) => {
  return useQuery({
    queryKey: ['machine', id],
    queryFn: async () => {
      if (!id) throw new Error('Machine ID is required')
      const response = await machinesAPI.getById(id)
      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/*
export const useMachineStatus = () => {
  // Not documented in OpenAPI, omit or mock
  return useQuery({
    queryKey: ['machines', 'status'],
    queryFn: async () => [],
    refetchInterval: 30000,
  })
}
*/

// Production logs queries
export const useProductionLogs = (skip: number = 0, limit: number = 50) => {
  return useQuery({
    queryKey: ['logs', skip, limit],
    queryFn: async () => {
      const page = Math.floor(skip / limit) + 1;
      const response = await logsAPI.getAll(page, limit)
      return response.data as { data: ProductionLog[]; total: number } | ProductionLog[]
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useProductionLogsByMachine = (machineId: string | null, skip: number = 0, limit: number = 50) => {
  return useQuery({
    queryKey: ['logs', 'machine', machineId, skip, limit],
    queryFn: async () => {
      if (!machineId) throw new Error('Machine ID is required')
      const page = Math.floor(skip / limit) + 1;
      const response = await logsAPI.getByMachine(machineId, page, limit)
      return response.data
    },
    enabled: !!machineId,
    staleTime: 5 * 60 * 1000,
  })
}

// Alerts queries
export const useAlerts = (skip: number = 0, limit: number = 50, statut?: string) => {
  return useQuery({
    queryKey: ['alerts', skip, limit, statut],
    queryFn: async () => {
      const page = Math.floor(skip / limit) + 1;
      const response = await alertsAPI.getAll(statut, undefined, undefined, page, limit)
      return response.data as { data: Alert[]; total: number } | Alert[]
    },
    refetchInterval: 30000, // 30 seconds
    staleTime: 15000, // 15 seconds
  })
}

// KPIs
export const useKpisSummary = () => {
  return useQuery({
    queryKey: ['kpis', 'summary'],
    queryFn: async () => {
      const response = await kpisAPI.getSummary()
      return response.data
    },
    staleTime: 60000,
  })
}

export const useKpisRendementGlobal = () => {
  return useQuery({
    queryKey: ['kpis', 'rendement-global'],
    queryFn: async () => {
      const response = await kpisAPI.getRendementGlobal()

      // 👇 EXTRAIRE LE data INTERNE
      return response.data.data as {
        total_logs: number
        taches_completees: number
        taches_interrompues: number
        total_anomalies: number
        taux_anomalie_pct: number
        rendement_global_pct: number
        duree_moyenne_min: number
      }
    },
    refetchInterval: 3600000,
    staleTime: 1800000,
  })
}

export const useMonthlySummaries = () => {
  return useQuery({
    queryKey: ['summaries', 'monthly'],
    queryFn: async () => {
      const response = await summariesAPI.getAllMonthly()
      return response.data.data as Array<{
        id: number
        periode: string
        date_generation: string
        rendement_global_pct: number
        rendement_matin: number
        rendement_jour: number
        rendement_nuit: number
        taux_anomalie_pct: number
        total_anomalies: number
        duree_moyenne_taches_min: number
        total_employes: number
        employes_en_travail: number
        employes_absents: number
        employes_en_conge: number
        total_machines: number
        machines_en_panne: number
        total_taches: number
        taches_completees: number
        taches_interrompues: number
        score_fatigue_global: number
        niveau_fatigue_global: string
        employes_fatigue_critique: number
        employes_fatigue_eleve: number
        employes_fatigue_moyen: number
        employes_fatigue_faible: number
      }>
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useShiftSummaries = () => {
  return useQuery({
    queryKey: ['summaries', 'shift'],
    queryFn: async () => {
      const response = await summariesAPI.getAllShift()
      return response.data.data as Array<{
        id: number
        shift: string
        date: string
        date_generation: string
        rendement_pct: number
        taux_anomalie_pct: number
        duree_moyenne_min: number
        total_employes_shift: number
        total_taches: number
        taches_completees: number
        score_fatigue_shift: number
      }>
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useShiftLast10Days = () => {
  return useQuery({
    queryKey: ['summaries', 'shift', 'last10days'],
    queryFn: async () => {
      const response = await summariesAPI.getShiftLast10Days()
      return response.data.data as Array<{
        id: number
        shift: string
        date: string
        date_generation: string
        rendement_pct: number
        taux_anomalie_pct: number
        duree_moyenne_min: number
        total_employes_shift: number
        total_taches: number
        taches_completees: number
        taches_interrompues: number
        score_fatigue_shift: number
        niveau_fatigue_shift: string
      }>
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Recommendations queries
export const useRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const response = await recommendationsAPI.getAll()
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useRecommendationsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['recommendations', 'category', category],
    queryFn: async () => {
      const response = await recommendationsAPI.getByCategory(category)
      return response.data
    },
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
  })
}

