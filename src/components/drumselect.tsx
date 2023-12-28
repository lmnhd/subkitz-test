"use client"

import React from 'react'
import * as SampleTypes from '../../ADMINISTRATION/src/interfaces'
import { Sample } from '@/API'
import { getDrumColor } from '@/lib/utils'

export default function DrumSelect({ updateValue, defaultDrum, color = 'bg-lime-400', textColor = 'violet-900' }: {  updateValue: any, defaultDrum: any, color?: string, textColor?:string}) {
    
  return (
    <div>
        <div className='w-full flex flex-col gap-6'>
            
            <select 
            name="drum" 
            id="drum" 
            title='drum' 
            value={defaultDrum} 
           
            className={`text-${textColor} ${color} w-28 h-8 pb-1  rounded-2xl text-center`} 
            onChange={(e) => {updateValue(e.target.value)}}
            >
                <option value="any">none</option>
                {Object.keys(SampleTypes.Drum).sort().map((key) => {
                  
                    return <option className={`bg-slate-400`} key={key}>{key}</option>
                })}
            </select>
            
        </div>
    </div>
  )
}
