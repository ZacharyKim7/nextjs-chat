'use client'

import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { useState } from 'react'
import styled from 'styled-components'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'


interface AppointmentSlot {
    id: number
    start: string
    end: string
    title: string
    // isAvailable: boolean // Added to determine if the slot is available or not
}

const CalendarContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 10px;
    padding: 10px;
    overflow-x: auto;
`

const CalendarDay = styled.div`
    flex: 1;
    min-width: 200px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    padding: 10px;
    text-align: center;
`

const DayHeader = styled.h3`
    font-size: 1.2em;
    margin-bottom: 10px;
    color: #333;
`

const AppointmentBlock = styled.button<{ isAvailable: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    background-color: ${({ isAvailable }) => (isAvailable ? '#d4edda' : '#f8d7da')};
    color: ${({ isAvailable }) => (isAvailable ? '#155724' : '#721c24')};
    border: none;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`

const Time = styled.div`
    font-weight: bold;
    margin-bottom: 5px;
`

const Details = styled.div`
    span {
        display: block;
        font-size: 0.9em;
    }
`

export function AppointmentSlots({ props: appointmentSlots }: { props: AppointmentSlot[] }) {
    // const [, setMessages] = useUIState<typeof AI>()
    const [selectingUI] = useState<null | React.ReactNode>(null)
    // const { confirmAppointment } = useActions()

    // Get the unique days from the appointment slots
    // const uniqueDays = Array.from(new Set(appointmentSlots.map(slot => new Date(slot.time).toLocaleDateString())))

    return (
        <div>
            {selectingUI ? (
                <div className="mt-4 text-zinc-200">{selectingUI}</div>
            ) : (
                <FullCalendar
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    events = {[
                        // {   title: , 
                        //     start: '2024-05-20T09:00:00'
                        //     // durationMinutes: 30,
                        //     // doctor: 'Dr. Smith'
                        // },
                        // { title: 'event 2', date: '2024-05-20' }
                        appointmentSlots.map(slot => ({id: slot.id.toString(), startStr: slot.start, endStr: slot.end, title: slot.title}))
                    ]}
                />
            )}
        </div>
    )
}