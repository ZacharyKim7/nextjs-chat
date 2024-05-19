import { Separator } from '@/components/ui/separator'
import { UIState } from '@/lib/chat/actions'
import { Session } from '@/lib/types'
import Link from 'next/link'
// import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

export interface ChatList {
  messages: UIState
  session?: Session
  isShared: boolean
}
type MedicalObject = {
  numberOfResults: number
  codes: Array<string>
  extraCodes: Array<string> | null
  dfCodes: Array<string>
  dfSystemCodes?: Array<string>

}

export function ChatList({ messages, session, isShared }: ChatList) {
  const [apiData, setApiData] = useState<MedicalObject[]>([])
  const [terms, setTerms] = useState('')
  const fetch = require('node-fetch');


  if (!messages.length) {
    return null
  }

  function getApiData() {
    const url = `https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${terms}&df=condition_name&maxList=10&sf=term_type&ef=umls_cui&knowledgeResponseType=application/json`;

    fetch(url)
      .then((response: any) => response.json())
      .then((data: MedicalObject[]) => setApiData(data))
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

      {messages.map((message, index) => (
        <div key={message.id}>
          {message.display}
          {index < messages.length - 1 && <Separator className="my-4" />}
        </div>
      ))}

      {apiData.map((message, index) => (
        <div key={index}>
          {
            message.dfCodes.map((code, codeIndex) => (
              <div key={codeIndex}>{code}</div>))
          }
        </div>
      ))}
    </div>
  )
}
