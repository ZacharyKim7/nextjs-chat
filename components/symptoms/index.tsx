'use client'

import dynamic from 'next/dynamic'

export { spinner } from './spinner'
export { BotCard, BotMessage, SystemMessage } from './message'


const Symptoms = dynamic(() => import('./symptoms').then(mod => mod.Symptoms

), {
  ssr: false,
  loading: () => <div>Temp Skeleton</div>
})

export { Symptoms }