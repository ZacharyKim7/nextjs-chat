'use client'

import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { useState } from 'react'
import styled from 'styled-components'

interface AppointmentSlot {
    id: number
    time: string
    durationMinutes: number
    doctor: string
    isAvailable: boolean // Added to determine if the slot is available or not
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
    const [, setMessages] = useUIState<typeof AI>()
    const [selectingUI, setSelectingUI] = useState<null | React.ReactNode>(null)
    const { confirmAppointment } = useActions()

    // Get the unique days from the appointment slots
    const uniqueDays = Array.from(new Set(appointmentSlots.map(slot => new Date(slot.time).toLocaleDateString())))

    return (
        <div>
            {selectingUI ? (
                <div className="mt-4 text-zinc-200">{selectingUI}</div>
            ) : (
                <CalendarContainer>
                    {uniqueDays.map(day => (
                        <CalendarDay key={day}>
                            <DayHeader>{day}</DayHeader>
                            {appointmentSlots
                                .filter(slot => new Date(slot.time).toLocaleDateString() === day)
                                .map(slot => (
                                    <AppointmentBlock
                                        key={slot.id}
                                        isAvailable={slot.isAvailable}
                                        onClick={async () => {
                                            if (slot.isAvailable) {
                                                const response = await confirmAppointment(slot)
                                                setSelectingUI(response.selectingUI)

                                                // Insert a new system message to the UI.
                                                setMessages((currentMessages: any) => [
                                                    ...currentMessages,
                                                    response.newMessage
                                                ])
                                            }
                                        }}
                                        disabled={!slot.isAvailable}
                                    >
                                        <Time>{new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Time>
                                        <Details>
                                            <span>Duration: {slot.durationMinutes} min</span>
                                            <span>Doctor: {slot.doctor}</span>
                                        </Details>
                                    </AppointmentBlock>
                                ))}
                        </CalendarDay>
                    ))}
                </CalendarContainer>
            )}
        </div>
    )
}