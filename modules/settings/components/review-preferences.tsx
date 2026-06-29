"use client"

import { useState, type FormEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getReviewPreferences, updateReviewPreferences } from "../actions"
import { REVIEW_PRESETS, type ReviewPresetId } from "@/modules/ai/lib/review-presets"

const ReviewPreferences = () => {
    const queryClient = useQueryClient()
    const [reviewPreset, setReviewPreset] = useState<ReviewPresetId | null>(null)

    const { data: preferences, isLoading } = useQuery({
        queryKey: ["review-preferences"],
        queryFn: async () => await getReviewPreferences(),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    })

    const selectedReviewPreset = reviewPreset ?? preferences?.reviewPreset ?? "balanced"

    const updateMutation = useMutation({
        mutationFn: async (data: { reviewPreset: ReviewPresetId }) => {
            return await updateReviewPreferences(data)
        },
        onSuccess: (result) => {
            if (result?.success) {
                queryClient.invalidateQueries({ queryKey: ["review-preferences"] })
                toast.success("Review Preferences Updated Successfully")
            } else {
                toast.error(result?.error || "Failed to update review preferences")
            }
        },
        onError: () => {
            toast.error("Failed to update review preferences")
        }
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateMutation.mutate({ reviewPreset: selectedReviewPreset })
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Review Preferences</CardTitle>
                    <CardDescription>Choose how CodeDRS reviews pull requests</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="animate-pulse space-y-3">
                        <div className="h-16 bg-muted rounded"></div>
                        <div className="h-16 bg-muted rounded"></div>
                        <div className="h-10 bg-muted rounded"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Review Preferences</CardTitle>
                <CardDescription>Choose how CodeDRS reviews pull requests</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
                    <RadioGroup
                        value={selectedReviewPreset}
                        onValueChange={(value) => setReviewPreset(value as ReviewPresetId)}
                        className="grid gap-3 md:grid-cols-2"
                        disabled={updateMutation.isPending}
                    >
                        {REVIEW_PRESETS.map((preset) => (
                            <Label
                                key={preset.id}
                                htmlFor={`review-preset-${preset.id}`}
                                className="flex min-h-24 cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 has-[[data-checked=true]]:border-primary has-[[data-checked=true]]:bg-primary/5"
                            >
                                <RadioGroupItem
                                    id={`review-preset-${preset.id}`}
                                    value={preset.id}
                                    className="mt-1 border-indigo-600 text-indigo-600 focus-visible:ring-indigo-600 data-[state=checked]:border-indigo-600"
                                />
                                <span className="space-y-1">
                                    <span className="block font-medium">{preset.label}</span>
                                    <span className="block text-sm leading-5 text-muted-foreground">
                                        {preset.description}
                                    </span>
                                </span>
                            </Label>
                        ))}
                    </RadioGroup>

                    <Button type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? "Saving ... " : "Save Preferences"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default ReviewPreferences
