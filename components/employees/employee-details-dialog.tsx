'use client'

import React, { useState, useEffect } from 'react'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { employeesAPI, Employee } from '@/lib/api'
import { Loader2, User, Briefcase, DollarSign, TrendingUp, AlertCircle, Calendar, ShieldCheck, Heart, GraduationCap, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'

interface EmployeeDetailsDialogProps {
    employeeId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EmployeeDetailsDialog({ employeeId, open, onOpenChange }: EmployeeDetailsDialogProps) {
    const [employee, setEmployee] = useState<Employee | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && employeeId) {
            fetchEmployee()
        }
    }, [open, employeeId])

    async function fetchEmployee() {
        setLoading(true)
        try {
            const response = await employeesAPI.getByIdQuery(employeeId!)
            if (response.data.data && response.data.data.length > 0) {
                setEmployee(response.data.data[0])
            }
        } catch (err) {
            console.error("Error fetching employee details:", err)
        } finally {
            setLoading(false)
        }
    }

    const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) => (
        <div className="bg-secondary/30 p-4 rounded-xl border border-border/50 flex items-center gap-4">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-foreground">{value}</p>
            </div>
        </div>
    )

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border shadow-2xl">
                {loading ? (
                    <div className="h-[500px] flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : employee ? (
                    <div className="flex flex-col h-full max-h-[90vh]">
                        {/* Header Profile Section */}
                        <div className="relative h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-b border-border">
                            <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-card border-4 border-background shadow-xl flex items-center justify-center overflow-hidden">
                                    <User className="w-12 h-12 text-primary" />
                                </div>
                                <div className="pb-2">
                                    <h2 className="text-2xl font-bold text-foreground">{employee.prenom} {employee.nom}</h2>
                                    <p className="text-muted-foreground font-mono text-sm">{employee.employee_id}</p>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Badge variant={employee.statut_presence === 'En_travail' ? 'success' : 'destructive'} className="capitalize">
                                    {employee.statut_presence?.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>

                        <div className="mt-16 px-8 pb-8 flex-1 overflow-hidden">
                            <Tabs defaultValue="overview" className="h-full flex flex-col">
                                <TabsList className="bg-secondary/50 p-1 rounded-lg w-fit mb-6">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="job">Work & Experience</TabsTrigger>
                                    <TabsTrigger value="performance">Performance & Risk</TabsTrigger>
                                </TabsList>

                                <ScrollArea className="flex-1 pr-4 -mr-4">
                                    <AnimatePresence mode="wait">
                                        <TabsContent value="overview" className="space-y-6 mt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <StatCard icon={Briefcase} label="Poste" value={employee.poste} color="bg-blue-500" />
                                                <StatCard icon={TrendingUp} label="Performance" value={`${(employee.performance_moyenne * 100).toFixed(0)}%`} color="bg-green-500" />
                                                <StatCard icon={AlertCircle} label="Risque Départ" value={employee.risque_depart} color={employee.risque_depart === 'Eleve' ? 'bg-red-500' : 'bg-yellow-500'} />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                        <TrendingUp className="w-5 h-5 text-primary" />
                                                        Key Performance Indicators
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <div className="flex justify-between text-sm mb-2">
                                                                <span className="text-muted-foreground">Taux de Rendement</span>
                                                                <span className="font-bold text-foreground">{(employee.taux_rendement * 100).toFixed(1)}%</span>
                                                            </div>
                                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${Math.min(employee.taux_rendement * 100, 100)}%` }}
                                                                    className="h-full bg-primary"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                                            <div className="text-center p-2 bg-secondary/20 rounded-lg">
                                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Congés Restants</p>
                                                                <p className="text-lg font-bold text-primary">{employee.jours_conge_restant} j</p>
                                                            </div>
                                                            <div className="text-center p-2 bg-secondary/20 rounded-lg">
                                                                <p className="text-[10px] text-muted-foreground uppercase font-bold">Heures/Semaine</p>
                                                                <p className="text-lg font-bold text-primary">{employee.heures_travail_semaine}h</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                        <AlertCircle className="w-5 h-5 text-destructive" />
                                                        Incidents & Santé
                                                    </h3>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div className="flex items-center justify-between p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                                                            <span className="text-sm font-medium">Accidents de Travail</span>
                                                            <Badge variant="destructive" className="rounded-full h-8 w-8 flex items-center justify-center p-0 text-white border-0">
                                                                {employee.accidents_travail}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-orange-500/5 rounded-xl border border-orange-500/10">
                                                            <span className="text-sm font-medium">Maladies Professionnelles</span>
                                                            <Badge variant="outline" className="rounded-full h-8 w-8 flex items-center justify-center p-0 border-orange-500/30 text-orange-500">
                                                                {employee.maladies_professionnelles}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="personal" className="space-y-6 mt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Informations Basiques</h3>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4" /> Âge</div>
                                                        <div className="font-medium">{employee.age} ans</div>
                                                        <div className="text-muted-foreground flex items-center gap-2"><Heart className="w-4 h-4" /> État Civil</div>
                                                        <div className="font-medium">{employee.etat_civil}</div>
                                                        <div className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Enfants</div>
                                                        <div className="font-medium">{employee.nombre_enfants}</div>
                                                        <div className="text-muted-foreground flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Sexe</div>
                                                        <div className="font-medium">{employee.sexe === 'H' ? 'Masculin' : 'Féminin'}</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Formation & Embauche</h3>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="text-muted-foreground flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Niveau d'études</div>
                                                        <div className="font-medium">{employee.niveau_etude}</div>
                                                        <div className="text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Date d'embauche</div>
                                                        <div className="font-medium">{employee.date_embauche}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="job" className="space-y-6 mt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Poste et Contrat</h3>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="text-muted-foreground">Département</div>
                                                        <div className="font-medium">{employee.departement}</div>
                                                        <div className="text-muted-foreground">Shift</div>
                                                        <div className="font-medium">{employee.shift_travail}</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Finances</h3>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" /> Salaire Mensuel</div>
                                                        <div className="font-bold text-foreground text-base">{employee.salaire_mensuel} TND</div>
                                                        <div className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4" /> Prime Rendement</div>
                                                        <div className="font-medium text-success">{employee.prime_rendement} TND</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="performance" className="space-y-6 mt-0">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Risques</h3>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="text-muted-foreground">Risque Absentéisme</div>
                                                        <Badge variant={employee.risque_absenteisme === 'Eleve' ? 'destructive' : 'secondary'}>{employee.risque_absenteisme}</Badge>
                                                        <div className="text-muted-foreground">Risque Départ</div>
                                                        <Badge variant={employee.risque_depart === 'Eleve' ? 'destructive' : 'secondary'}>{employee.risque_depart}</Badge>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Présence Mensuelle</h3>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="text-muted-foreground">Heures Absence/Mois</div>
                                                        <div className="font-medium text-red-500">{employee.heures_absence_mois}h</div>
                                                        <div className="text-muted-foreground">Retards/Mois</div>
                                                        <div className="font-medium text-amber-500">{employee.retards_mois}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </AnimatePresence>
                                </ScrollArea>
                            </Tabs>
                        </div>
                    </div>
                ) : (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                        No data found
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
