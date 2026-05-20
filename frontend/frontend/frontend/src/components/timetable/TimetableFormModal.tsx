"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";

import { Button } from "@/components/ui/Button";

import { Input } from "@/components/ui/Input";

import {
    Timetable,
    CreateTimetableRequest,
} from "@/types/timetable.types";

interface TimetableFormModalProps {

    open: boolean;

    onClose: () => void;

    timetable?: Timetable | null;

    onSubmit: (
        data: CreateTimetableRequest
    ) => void;

    isLoading?: boolean;
}

export function TimetableFormModal({

    open,

    onClose,

    timetable,

    onSubmit,

    isLoading,
}: TimetableFormModalProps) {

    const [day, setDay] =
        useState("");

    const [subject, setSubject] =
        useState("");

    const [startTime, setStartTime] =
        useState("");

    const [endTime, setEndTime] =
        useState("");

    const [room, setRoom] =
        useState("");

    // EDIT MODE

    useEffect(() => {

        if (timetable) {

            setDay(
                timetable.day || ""
            );

            setSubject(
                timetable.subject || ""
            );

            setStartTime(
                timetable.start_time || ""
            );

            setEndTime(
                timetable.end_time || ""
            );

            setRoom(
                timetable.room || ""
            );

        } else {

            // RESET

            setDay("");

            setSubject("");

            setStartTime("");

            setEndTime("");

            setRoom("");
        }

    }, [timetable, open]);

    // SUBMIT

    const handleSubmit = (
        e: React.FormEvent
    ) => {

        e.preventDefault();
        console.log(
            "TIMETABLE SUBMIT =>",
            {
                day,
                subject,
                start_time:
                    startTime,
                end_time:
                    endTime,
                room,
            }
        );

        onSubmit({

            day: day.slice(0, 3),

            subject,

            start_time:
                startTime,

            end_time:
                endTime,

            room,
        });
    };

    return (

        <Dialog
            open={open}
            onOpenChange={onClose}
        >

            <DialogContent className="border-dark-700 bg-dark-900 text-white sm:max-w-xl">

                <DialogHeader>

                    <DialogTitle>

                        {timetable
                            ? "Update Timetable"
                            : "Create Timetable"}

                    </DialogTitle>

                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* DAY */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-dark-200">

                            Day

                        </label>

                        <select
                            value={day}
                            onChange={(e) =>
                                setDay(
                                    e.target.value
                                )
                            }
                            className="
                w-full rounded-lg
                border border-dark-600
                bg-dark-800
                px-4 py-3
                text-white
              "
                            required
                        >

                            <option value="">
                                Select Day
                            </option>

                            <option value="Monday">
                                Mon
                            </option>

                            <option value="Tuesday">
                                Tue
                            </option>

                            <option value="Wednesday">
                                Wed
                            </option>

                            <option value="Thursday">
                                Thu
                            </option>

                            <option value="Friday">
                                Fri
                            </option>

                            <option value="Saturday">
                                Sat
                            </option>
                            <option value="Sunday">
                                Sun
                            </option>

                        </select>
                    </div>

                    {/* SUBJECT */}

                    <Input
                        label="Subject"
                        placeholder="Enter subject"
                        value={subject}
                        onChange={(e) =>
                            setSubject(
                                e.target.value
                            )
                        }
                        required
                    />

                    {/* TIME */}

                    <div className="grid grid-cols-2 gap-4">

                        <Input
                            type="time"
                            label="Start Time"
                            value={startTime}
                            onChange={(e) =>
                                setStartTime(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <Input
                            type="time"
                            label="End Time"
                            value={endTime}
                            onChange={(e) =>
                                setEndTime(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>

                    {/* ROOM */}

                    <Input
                        label="Room"
                        placeholder="Enter room"
                        value={room}
                        onChange={(e) =>
                            setRoom(
                                e.target.value
                            )
                        }
                        required
                    />

                    {/* ACTIONS */}

                    <div className="flex justify-end gap-3">

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isLoading}
                        >

                            {isLoading
                                ? "Saving..."
                                : timetable
                                    ? "Update"
                                    : "Create"}

                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}