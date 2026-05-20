"use client";

import {
    Timetable,
} from "@/types/timetable.types";

import { Card } from "@/components/ui/Card";

import { Button } from "@/components/ui/Button";

import {
    Clock,
    MapPin,
    Pencil,
    CalendarDays,
    BookOpen,
} from "lucide-react";

interface TimetableCardProps {

    timetable: Timetable;

    onEdit?: (
        timetable: Timetable
    ) => void;
}

export function TimetableCard({

    timetable,

    onEdit,
}: TimetableCardProps) {

    return (

        <Card
            variant="bordered"
            className="
                        group
                        relative
                        overflow-hidden
                        border
                        border-dark-700
                        bg-gradient-to-br
                        from-dark-900
                        via-dark-800
                        to-dark-900

                        transition-all
                        duration-500

                        hover:-translate-y-1
                        hover:border-primary-500/60
                        hover:shadow-2xl
                        hover:shadow-primary-500/20
                    "
        >
            {/* ANIMATED GLOW */}

            <div
                className="
    absolute
    inset-0
    opacity-0
    transition-opacity
    duration-500
    group-hover:opacity-100
  "
            >
                <div
                    className="
                            absolute
                            -left-32
                            top-0
                            h-full
                            w-24
                            rotate-12
                            bg-white/10   
                            blur-2xl
                            transition-all
                            duration-1000
                            group-hover:left-[120%]
                            "
                />
            </div>

            {/* HEADER */}

            <div className="mb-4 flex items-start justify-between">

                <div>

                    <div
                        className=" inline-flex items-center rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1 shadow-lg shadow-primary-500/10 backdrop-blur-sm"
                    >
                        <h3 className="text-lg font-bold tracking-wide text-primary-300">
                            {timetable.subject}
                        </h3>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-sm text-dark-300">

                        <CalendarDays className="h-4 w-4" />

                        {timetable.day}

                    </div>
                </div>

                {onEdit && (

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                            onEdit(timetable)
                        }
                    >

                        <Pencil className="h-4 w-4" />

                    </Button>
                )}
            </div>

            {/* TIME */}

            <div className="mb-3 flex items-center gap-2 text-dark-200">

                <Clock className="h-4 w-4 text-primary-300" />

                <span>

                    {timetable.start_time}
                    {" - "}
                    {timetable.end_time}

                </span>
            </div>

            {/* ROOM */}

            <div className="mb-3 flex items-center gap-2 text-dark-200">

                <MapPin className="h-4 w-4 text-primary-300" />

                <span>

                    Room {timetable.room}

                </span>
            </div>

            {/* SUBJECT */}

            <div className="flex items-center gap-2 text-dark-300">

                <BookOpen className="h-4 w-4 text-primary-400" />

                <span>

                    {timetable.subject}

                </span>
            </div>
        </Card>
    );
}