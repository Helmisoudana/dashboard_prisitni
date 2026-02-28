'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCreateEmployee } from '@/hooks/use-queries'
import { toast } from 'sonner'
import { UserPlus, Loader2 } from 'lucide-react'
import { Employee } from '@/lib/api'

const formSchema = z.object({
    employee_id: z.string().min(1, "ID requis"),
    nom: z.string().min(1, "Nom requis"),
    prenom: z.string().min(1, "Prénom requis"),
    sexe: z.string().min(1, "Sexe requis"),
    date_naissance: z.string().min(1, "Date requis"),
    age: z.coerce.number().min(18),
    etat_civil: z.string().min(1),
    nombre_enfants: z.coerce.number().min(0),
    niveau_etude: z.string().min(1),
    poste: z.string().min(1),
    departement: z.string().min(1),
    type_contrat: z.string().min(1),
    anciennete_annees: z.coerce.number().min(0),
    salaire_mensuel: z.coerce.number().min(0),
    prime_rendement: z.coerce.number().min(0),
    heures_travail_semaine: z.coerce.number().min(0),
    heures_absence_mois: z.coerce.number().min(0),
    retards_mois: z.coerce.number().min(0),
    jours_conge_restant: z.coerce.number().min(0),
    statut_presence: z.string().min(1),
    rfid_uid: z.string().min(1),
    shift_travail: z.string().min(1),
    performance_moyenne: z.coerce.number().min(0).max(5),
    taux_rendement: z.coerce.number().min(0).max(100),
    accidents_travail: z.coerce.number().min(0),
    maladies_professionnelles: z.coerce.number().min(0),
    evaluation_manager: z.coerce.number().min(0).max(5),
    risque_absenteisme: z.string().min(1),
    risque_depart: z.string().min(1),
    date_embauche: z.string().min(1)
})

export function CreateEmployeeDialog() {
    const [open, setOpen] = useState(false)
    const createEmployee = useCreateEmployee()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            employee_id: '',
            nom: '',
            prenom: '',
            sexe: 'M',
            date_naissance: '1990-01-01',
            age: 34,
            etat_civil: 'Célibataire',
            nombre_enfants: 0,
            niveau_etude: 'Licence',
            poste: 'Opérateur',
            departement: 'Production',
            type_contrat: 'CDI',
            anciennete_annees: 0,
            salaire_mensuel: 0,
            prime_rendement: 0,
            heures_travail_semaine: 40,
            heures_absence_mois: 0,
            retards_mois: 0,
            jours_conge_restant: 25,
            statut_presence: 'Présent',
            rfid_uid: '',
            shift_travail: 'Matin',
            performance_moyenne: 0,
            taux_rendement: 0,
            accidents_travail: 0,
            maladies_professionnelles: 0,
            evaluation_manager: 0,
            risque_absenteisme: 'Faible',
            risque_depart: 'Faible',
            date_embauche: new Date().toISOString().split('T')[0]
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createEmployee.mutateAsync(values as Employee)
            toast.success("Employé créé avec succès")
            setOpen(false)
            form.reset()
        } catch (err) {
            toast.error("Erreur lors de la création")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Ajouter un Employé
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer un nouvel employé</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="personal">Personnel</TabsTrigger>
                                <TabsTrigger value="job">Poste</TabsTrigger>
                                <TabsTrigger value="financial">Finances</TabsTrigger>
                                <TabsTrigger value="performance">Stats & Risques</TabsTrigger>
                            </TabsList>

                            <TabsContent value="personal" className="space-y-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="employee_id" render={({ field }) => (
                                        <FormItem><FormLabel>ID Employé</FormLabel><FormControl><Input placeholder="EMP001" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="nom" render={({ field }) => (
                                        <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="prenom" render={({ field }) => (
                                        <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="sexe" render={({ field }) => (
                                        <FormItem><FormLabel>Sexe</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Sexe" /></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="M">Masculin</SelectItem><SelectItem value="F">Féminin</SelectItem></SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="date_naissance" render={({ field }) => (
                                        <FormItem><FormLabel>Date de Naissance</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="age" render={({ field }) => (
                                        <FormItem><FormLabel>Âge</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="etat_civil" render={({ field }) => (
                                        <FormItem><FormLabel>État Civil</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Célibataire">Célibataire</SelectItem>
                                                    <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                                                    <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="nombre_enfants" render={({ field }) => (
                                        <FormItem><FormLabel>Enfants</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="niveau_etude" render={({ field }) => (
                                        <FormItem><FormLabel>Niveau d'Études</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </TabsContent>

                            <TabsContent value="job" className="space-y-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="poste" render={({ field }) => (
                                        <FormItem><FormLabel>Poste</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="departement" render={({ field }) => (
                                        <FormItem><FormLabel>Département</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Production">Production</SelectItem>
                                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                                    <SelectItem value="Qualité">Qualité</SelectItem>
                                                    <SelectItem value="Logistique">Logistique</SelectItem>
                                                    <SelectItem value="Administratif">Administratif</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="type_contrat" render={({ field }) => (
                                        <FormItem><FormLabel>Contrat</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CDI">CDI</SelectItem>
                                                    <SelectItem value="CDD">CDD</SelectItem>
                                                    <SelectItem value="SIVP">SIVP</SelectItem>
                                                    <SelectItem value="Intérim">Intérim</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="date_embauche" render={({ field }) => (
                                        <FormItem><FormLabel>Date d'Embauche</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="anciennete_annees" render={({ field }) => (
                                        <FormItem><FormLabel>Ancienneté (ans)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="shift_travail" render={({ field }) => (
                                        <FormItem><FormLabel>Shift</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Matin">Matin (06:00 - 14:00)</SelectItem>
                                                    <SelectItem value="Jour">Jour (14:00 - 22:00)</SelectItem>
                                                    <SelectItem value="Nuit">Nuit (22:00 - 06:00)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="rfid_uid" render={({ field }) => (
                                        <FormItem><FormLabel>RFID UID</FormLabel><FormControl><Input placeholder="00:11:22:33" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </TabsContent>

                            <TabsContent value="financial" className="space-y-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="salaire_mensuel" render={({ field }) => (
                                        <FormItem><FormLabel>Salaire Mensuel (TND)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="prime_rendement" render={({ field }) => (
                                        <FormItem><FormLabel>Prime Rendement (TND)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </TabsContent>

                            <TabsContent value="performance" className="space-y-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="statut_presence" render={({ field }) => (
                                        <FormItem><FormLabel>Statut Présence</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Présent">Présent</SelectItem>
                                                    <SelectItem value="Absent">Absent</SelectItem>
                                                    <SelectItem value="En congé">En congé</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="performance_moyenne" render={({ field }) => (
                                        <FormItem><FormLabel>Performance (/5)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="taux_rendement" render={({ field }) => (
                                        <FormItem><FormLabel>Taux de Rendement (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="evaluation_manager" render={({ field }) => (
                                        <FormItem><FormLabel>Évaluation Manager (/5)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="risque_absenteisme" render={({ field }) => (
                                        <FormItem><FormLabel>Risque Absentéisme</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="Faible">Faible</SelectItem><SelectItem value="Moyen">Moyen</SelectItem><SelectItem value="Élevé">Élevé</SelectItem></SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="risque_depart" render={({ field }) => (
                                        <FormItem><FormLabel>Risque Départ</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="Faible">Faible</SelectItem><SelectItem value="Moyen">Moyen</SelectItem><SelectItem value="Élevé">Élevé</SelectItem></SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </TabsContent>
                        </Tabs>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                            <Button type="submit" disabled={createEmployee.isPending}>
                                {createEmployee.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Créer l'Employé
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
