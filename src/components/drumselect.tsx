"use client"

import React from 'react'
import * as SampleTypes from '../../ADMINISTRATION/src/interfaces'
import { Sample } from '@/API'

export default function DrumSelect({ updateValue, defaultDrum }: {  updateValue: any, defaultDrum: SampleTypes.Drum}) {
    
  return (
    <div>
        <div>
            <h1>Select Drum Type</h1>
            <select 
            name="drum" 
            id="drum" 
            title='drum' 
            value={defaultDrum} 
            defaultValue={defaultDrum}
            className='text-black'
            onChange={(e) => {updateValue(e.target.value)}}
            >
                {Object.keys(SampleTypes.Drum).map((key) => {
                    return <option key={key}>{key}</option>
                })}
            </select>
        </div>
    </div>
  )
}
