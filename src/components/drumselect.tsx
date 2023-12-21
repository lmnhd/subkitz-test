"use client"

import React from 'react'
import * as SampleTypes from '../../ADMINISTRATION/src/interfaces'
import { Sample } from '@/API'

export default function DrumSelect({ updateValue, defaultDrum }: {  updateValue: any, defaultDrum: SampleTypes.Drum}) {
    
  return (
    <div>
        <div className='w-full flex flex-col gap-6'>
            
            <select 
            name="drum" 
            id="drum" 
            title='drum' 
            value={defaultDrum} 
           
            className='text-violet-900 bg-lime-400 w-28 h-6 text-center '
            onChange={(e) => {updateValue(e.target.value)}}
            >
                {Object.keys(SampleTypes.Drum).map((key) => {
                    return <option key={key}>{key}</option>
                })}
            </select>
            <p className='text-md text-amber-600 w-48'>Select Drum Type</p>
        </div>
    </div>
  )
}
