'use client'

import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { useState } from 'react'
import styled from 'styled-components'

interface Symptom {
    numberOfResults: number
    codes: Array<string>
    extraCodes: Array<string> | null
    dfCodes: Array<string>
    dfSystemCodes?: Array<string>

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

export function Symptoms({ props: symptoms }: { props: Symptom[] }) {
    const [apiData, setApiData] = useState<Symptom[]>([])
    const [terms, setTerms] = useState('')
    const fetch = require('node-fetch');

    function getApiData() {
        const url = `https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${terms}&df=condition_name&maxList=10&sf=term_type&ef=umls_cui&knowledgeResponseType=application/json`;

        fetch(url)
            .then((response: any) => response.json())
            .then((data: any[]) => setApiData(data.map(v => ({

                numberOfResults: v[0],
                codes: v[1],
                extraCodes: v[2],
                dfCodes: v[3],
                dfSystemCodes: v[4]
            }))))
            .catch((err: any) => console.error('error:' + err));
    }

    return (
        <div className="relative mx-auto max-w-3.5xl px-4">
            <form>
                <input
                    type="text"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    placeholder="Search for medical conditions"
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                    type="button"
                    onClick={getApiData}
                    className="mt-2 p-2 bg-blue-500 text-white rounded-md"
                >
                    Search
                </button>
            </form>

            {apiData.map((data, index) => (
                <div key={index}>
                    {
                        data.dfCodes.map((code, codeIndex) => (
                            <div key={codeIndex}>{code}</div>))
                    }
                </div>
            ))}
        </div>
    )
}